const path = require("path");
const { execSync } = require("child_process");
const { createServer } = require("http");
const chokidar = require("chokidar");
const karma = require("karma");
const serve = require("serve-handler");
const colors = require("colors");
const boxen = require("boxen");
const sade = require("sade");
const serveConfig = require("../serve.json");
const { Builder } = require("./builder");

const KARMA_PORT = 9876;
const SERVE_PORT = 5000;

class KarmaServer {
  constructor(browsers, grep) {
    this._browsers = browsers;
    this._grep = grep;
    this._isActive = null;
  }

  start() {
    this.karmaConfig = karma.config.parseConfig(
      path.join(__dirname, "../karma.conf.js"),
      {
        browsers: this._browsers,
        autoWatch: false,
        port: KARMA_PORT,
        logLevel: karma.constants.LOG_WARN,
        client: {
          args: ["--grep", this._grep || ""],
        },
        mochaReporter: { ignoreSkipped: true },
      }
    );
    this.karmaServer = new karma.Server(this.karmaConfig);
    this.karmaServer.start();
    return new Promise(resolve =>
      this.karmaServer.once("browsers_ready", resolve)
    );
  }

  async stop() {
    return new Promise(resolve =>
      karma.stopper.stop(this.karmaConfig, code =>
        setTimeout(() => resolve(code), 0)
      )
    );
  }

  async run() {
    if (this._isActive) return;
    this._isActive = true;
    karma.runner.run(this.karmaConfig, () => {});
    await new Promise(res => this.karmaServer.once("run_complete", res));
    this._isActive = false;
  }
}

sade("./tools/dev-server.js", true)
  .option("-p, --profile", "Name of profile to build.", "w3c")
  .option("-i, --interactive", "Run in interactive mode.", false)
  .option(
    "--browser",
    'Browser for Karma unit tests (e.g., "Chrome"). Multiple allowed.'
  )
  .option("--grep", "Run specific tests using karma --grep")
  .action(opts => run(opts))
  .parse(process.argv);

async function run(args) {
  /** @type {"ready" | "building" | "build_ready" | "testing"} */
  let state = "ready";

  const karmaServer = new KarmaServer(args.browsers, args.grep);
  const devServer = createServer((req, res) => serve(req, res, serveConfig));
  devServer.on("error", onError);

  if (args.interactive) {
    registerStdinHandler();
  } else {
    const paths = ["./tests/spec"];
    const watcher = chokidar.watch(paths, { ignoreInitial: true });
    watcher.on("change", runTests);
    watcher.on("error", onError);
  }

  process.on("exit", () => {
    execSync("git checkout -- builds", { stdio: "inherit" });
  });

  printWelcomeMessage(args);

  await karmaServer.start();
  devServer.listen(SERVE_PORT);

  if (!args.interactive) {
    Builder.watch({ name: args.profile, debug: true }).on("event", async ev => {
      if (args.interactive) return;
      switch (ev.code) {
        case "BUNDLE_START":
          if (state !== "ready") return;
          state = "building";
          break;
        case "BUNDLE_END":
          state = "build_ready";
          await runTests();
          break;
      }
    });
  } else {
    Builder.build({ name: args.profile, debug: true });
  }

  function registerStdinHandler() {
    // https://stackoverflow.com/a/12506613
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    stdin.on("data", async key => {
      if (state !== "ready") {
        // do nothing if already active
        return process.stdout.write(key);
      }

      switch (key) {
        case "\u0003": //  ctrl-c (end of text)
        case "q":
          return await karmaServer.stop();
        case "t":
          await Builder.build({ name: args.profile, debug: true });
          return await runTests();
        case "T":
          return await runTests();
        case "h":
          return printWelcomeMessage(args);
        default:
          process.stdout.write(key);
      }
    });
  }

  async function runTests() {
    if (state !== "build_ready" && state !== "ready") {
      return;
    }

    try {
      state = "testing";
      await karmaServer.run();
    } catch (err) {
      console.error(colors.red(err.stack));
    } finally {
      state = "ready";
    }
  }

  function onError(err) {
    console.error(colors.red(err.stack));
    karmaServer.stop().then(() => process.exit(1));
  }
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
    messages.push(["<keypress> T", "run tests only"]);
    messages.push(["<keypress> h", "print this help message"]);
    messages.push(["<keypress> q", "quit"]);
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
