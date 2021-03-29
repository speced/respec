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
  /**
   * @param {string} configFile
   * @param {string} [browser]
   */
  constructor(configFile, browser, grep = "") {
    const browsers = browser ? [browser] : [];
    this._karmaConfig = karma.config.parseConfig(configFile, {
      browsers,
      autoWatch: false,
      port: KARMA_PORT,
      logLevel: karma.constants.LOG_INFO,
      client: {
        args: ["--grep", grep || ""],
      },
      mochaReporter: { ignoreSkipped: true },
    });
    this._isActive = null;
  }

  start() {
    this.karmaServer = new karma.Server(this._karmaConfig);
    this.karmaServer.start();
    return new Promise(resolve =>
      this.karmaServer.once("browsers_ready", resolve)
    );
  }

  stop() {
    return new Promise(resolve =>
      karma.stopper.stop(this._karmaConfig, resolve)
    );
  }

  async run() {
    if (this._isActive) return;
    this._isActive = true;
    karma.runner.run(this._karmaConfig, () => {});
    await new Promise(res => this.karmaServer.once("run_complete", res));
    this._isActive = false;
  }
}

sade("./tools/dev-server.js", true)
  .option("-p, --profile", "Name of profile to build.", "w3c")
  .option("-i, --interactive", "Run in interactive mode.", false)
  .option("--browser", 'Browser for Karma unit tests (e.g., "Chrome").')
  .option("--grep", "Run specific tests using karma --grep")
  .action(opts => run(opts))
  .parse(process.argv);

async function run(args) {
  let isActive = false;
  const karmaServer = new KarmaServer(
    path.join(__dirname, "../karma.conf.js"),
    args.browser,
    args.grep
  );
  const devServer = createServer((req, res) => serve(req, res, serveConfig));
  devServer.on("error", onError);

  if (args.interactive) {
    registerStdinHandler();
  } else {
    const paths = ["./src", "./tests/spec"];
    const watcher = chokidar.watch(paths, { ignoreInitial: true });
    watcher.on("all", onFileChange);
    watcher.on("error", onError);
  }

  process.on("exit", () => {
    execSync("git checkout -- builds", { stdio: "inherit" });
  });

  printWelcomeMessage(args);

  await karmaServer.start();
  devServer.listen(SERVE_PORT);
  await buildAndTest({ profile: args.profile });

  function registerStdinHandler() {
    // https://stackoverflow.com/a/12506613
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    stdin.on("data", async key => {
      if (isActive) {
        // do nothing if already active
        return process.stdout.write(key);
      }

      switch (key) {
        case "\u0003": //  ctrl-c (end of text)
        case "q":
          await karmaServer.stop();
          return process.exit(0);
        case "t":
          return await buildAndTest();
        case "T":
          return await buildAndTest({ preventBuild: true });
        case "h":
          return printWelcomeMessage(args);
        default:
          process.stdout.write(key);
      }
    });
  }

  async function buildAndTest(options = {}) {
    const { preventBuild = false } = options;
    if (isActive) return;
    try {
      isActive = true;
      if (!preventBuild) {
        await Builder.build({ name: args.profile, debug: true });
      }
      await karmaServer.run();
    } catch (err) {
      console.error(colors.error(err.stack));
    } finally {
      isActive = false;
    }
  }

  async function onError(err) {
    console.error(colors.error(err.stack));
    await karmaServer.stop();
    process.exit(1);
  }

  async function onFileChange(_event, file) {
    const preventBuild = file.startsWith("tests");
    await buildAndTest({ preventBuild });
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
