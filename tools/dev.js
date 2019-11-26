const path = require("path");
const { createServer } = require("http");
const chokidar = require("chokidar");
const karma = require("karma");
const serve = require("serve-handler");
const colors = require("colors");
const boxen = require("boxen");
const commandLineArgs = require("command-line-args");
const serveConfig = require("../serve.json");
const { Builder } = require("./builder");

const KARMA_PORT = 9876;
const SERVE_PORT = 5000;

/** @type {import("command-line-args").OptionDefinition[]} */
const optionList = [
  {
    name: "profile",
    alias: "p",
    description: "Name of profile to build.",
    defaultValue: "w3c",
    multiple: false,
    type: String,
  },
  {
    name: "interactive",
    alias: "i",
    description: "Run in interactive mode",
    defaultValue: false,
    type: Boolean,
  },
  {
    name: "browsers",
    description: "Browsers for Karma unit tests",
    defaultOption: undefined,
    multiple: true,
    type: String,
  },
  {
    name: "grep",
    description: "Run specific tests using karma --grep",
    defaultOption: undefined,
    type: String,
  },
];

let args;
try {
  args = commandLineArgs(optionList);
} catch (err) {
  console.error(colors.error(err.message));
  process.exit(1);
}

const karmaConfig = karma.config.parseConfig(
  path.join(__dirname, "../karma.conf.js"),
  {
    browsers: args.browsers,
    autoWatch: false,
    port: KARMA_PORT,
    logLevel: karma.constants.LOG_WARN,
    client: {
      args: ["--grep", args.grep || ""],
    },
    mochaReporter: { ignoreSkipped: true },
  }
);
const karmaServer = new karma.Server(karmaConfig);
karmaServer.start();

const devServer = createServer((req, res) => serve(req, res, serveConfig));
devServer.listen(SERVE_PORT);
devServer.on("error", onError);

if (args.interactive) {
  registerStdinHandler();
} else {
  const watcher = chokidar.watch("./src", { ignoreInitial: true });
  watcher.on("all", onFileChange);
  watcher.on("error", onError);
}

printWelcomeMessage(args);

function registerStdinHandler() {
  // https://stackoverflow.com/a/12506613
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  stdin.on("data", async key => {
    switch (key) {
      case "\u0003": {
        karma.stopper.stop(karmaConfig);
        return process.exit(1);
      }
      case "t":
        return await buildAndTest();
      case "h":
        return printWelcomeMessage(args);
      default:
        process.stdout.write(key);
    }
  });
}

async function onFileChange(_event, _file) {
  await buildAndTest();
}

async function buildAndTest() {
  try {
    await Builder.build({ name: args.profile, debug: true });
    karma.runner.run(karmaConfig, () => {});
  } catch (err) {
    console.error(colors.error(err.stack));
  }
}

function onError(err) {
  console.error(colors.error(err.stack));
  process.exit(1);
}

function printWelcomeMessage(args) {
  const messages = [
    ["dev server", `http://localhost:${SERVE_PORT}`],
    ["karma server", `http://localhost:${KARMA_PORT}`],
    [
      "file watcher",
      `${args.interactive ? "NOT " : ""}watching for changes...`,
    ],
  ];
  if (args.interactive) {
    messages.push(["<keypress> t", "build and run tests"]);
    messages.push(["<keypress> h", "print this help message"]);
  }

  const message = messages
    .map(([title, text]) => {
      return colors.white.bold(`${title}:`.padEnd(18)) + colors.white(text);
    })
    .join("\n");

  const boxOptions = {
    padding: 1,
    borderColor: "green",
    backgroundColor: "black",
  };
  console.log(boxen(message, boxOptions));
}
