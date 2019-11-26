const path = require("path");
const { createServer } = require("http");
const chokidar = require("chokidar");
const karma = require("karma");
const serve = require("serve-handler");
const colors = require("colors");
const serveConfig = require("../serve.json");
const { Builder } = require("./builder");

const KARMA_PORT = 9876;
const SERVE_PORT = 5000;

const karmaConfig = karma.config.parseConfig(
  path.join(__dirname, "../karma.conf.js"),
  {
    browsers: ["FirefoxHeadless"],
    autoWatch: false,
    port: KARMA_PORT,
    logLevel: karma.constants.LOG_WARN,
  }
);
const karmaServer = new karma.Server(karmaConfig);
karmaServer.start();

const server = createServer((req, res) => serve(req, res, serveConfig));
server.listen(SERVE_PORT);
server.on("error", onError);

const watcher = chokidar.watch("./src", { ignoreInitial: true });
watcher.on("all", onFileChange);
watcher.on("error", onError);

printWelcomeMessage();

async function onFileChange(_event, _file) {
  try {
    await Builder.build({ name: "w3c", debug: true });
    karma.runner.run({ port: KARMA_PORT, autoWatch: true }, () => {});
  } catch (err) {
    console.error(colors.error(err.stack));
  }
}

function onError(err) {
  console.error(colors.error(err.stack));
  process.exit(1);
}

function printWelcomeMessage() {
  const messages = [
    ["dev server", `http://localhost:${SERVE_PORT}`],
    ["karma server", `http://localhost:${KARMA_PORT}`],
    ["file watcher", "watching changes..."],
  ];

  const maxMsgLength = Math.max(
    ...messages.map(msg => msg.reduce((l, m) => l + m.length, 0))
  );
  const box = {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    hr: "─",
    vert: "│",
  };
  const hrWidth = maxMsgLength + 2 + 10; // TODO: remove magic constant
  const lines = [
    ` ${box.topLeft}${box.hr.repeat(hrWidth)}${box.topRight}`,
    ...messages.map(msg => {
      return [
        box.vert,
        colors.white.bold(`${msg[0]}:`),
        colors.white(msg[1]),
        box.vert,
      ].join("\t");
    }),
    ` ${box.bottomLeft}${box.hr.repeat(hrWidth)}${box.bottomRight}`,
  ];
  console.log(colors.bgBlack.green(lines.map(line => `\t${line}`).join("\n")));
  console.log();
}
