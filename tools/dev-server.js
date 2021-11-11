/**
 * This tools lets one effectively run:
 *  $ npm run build:w3c
 *  $ npm run server
 *  $ npm run test:unit + test:integration
 * with ability to:
 *  - build/test when a file changes
 *  - build/test on a single keypress (interactive mode)
 *  - cleanup builds/ directory after use.
 */

const path = require("path");
const { execSync } = require("child_process");
const { createServer } = require("http");
const chokidar = require("chokidar");
const karma = require("karma");
const serve = require("serve-handler");
const colors = require("colors");
const sade = require("sade");
const serveConfig = require("../serve.json");
const { Builder } = require("./builder.js");

const KARMA_PORT = 9876;
const SERVE_PORT = 8000;

class KarmaServer {
  /**
   * @param {number} port
   * @param {string} [browser]
   */
  constructor(port, browser, grep = "") {
    const browsers = browser ? [browser] : undefined;

    const files = [
      ...require("../tests/karma.conf.base.js").files,
      ...require("../tests/unit/karma.conf.js").additionalFiles,
      ...require("../tests/spec/karma.conf.js").additionalFiles,
    ];
    const configFile = require.resolve("../tests/karma.conf.base.js");

    this._karmaConfig = karma.config.parseConfig(configFile, {
      browsers,
      port,
      files,
      basePath: path.join(__dirname, ".."),
      autoWatch: false,
      logLevel: karma.constants.LOG_WARN,
      client: {
        args: ["--grep", grep],
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
    await new Promise(resolve =>
      this.karmaServer.once("run_complete", resolve)
    );
    this._isActive = false;
  }
}

sade("./tools/dev-server.js", true)
  .option("-p, --profile", "Name of profile to build.", "w3c")
  .option("-i, --interactive", "Run in interactive mode.", false)
  .option("--browser", 'Browser for Karma unit tests (e.g., "Chrome").')
  .option("--grep", "Run specific tests using karma --grep")
  .action(opts => run(opts))
  .parse(process.argv, {
    unknown: flag => console.error(`Unknown option: ${flag}`),
  });

async function run(args) {
  let isActive = false;
  const karmaServer = new KarmaServer(KARMA_PORT, args.browser, args.grep);
  const devServer = createServer((req, res) => serve(req, res, serveConfig));
  devServer.on("error", onError);

  if (args.interactive) {
    registerStdinHandler();
  } else {
    const paths = ["./src", "./tests/spec", "./tests/unit"];
    const watcher = chokidar.watch(paths, { ignoreInitial: true });
    watcher.on("all", onFileChange);
    watcher.on("error", onError);
  }

  process.on("exit", () => {
    execSync("git checkout -- builds", { stdio: "inherit" });
  });

  devServer.listen(SERVE_PORT);
  await printWelcomeMessage(args);

  await karmaServer.start();
  if (!args.interactive) {
    await buildAndTest();
  }

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

  async function buildAndTest({ preventBuild = false } = {}) {
    if (isActive) return;
    try {
      isActive = true;
      if (!preventBuild) {
        await Builder.build({ name: args.profile, debug: true });
      }
      await karmaServer.run();
    } catch (err) {
      console.error(colors.red(err.stack));
    } finally {
      isActive = false;
    }
  }

  async function onError(err) {
    console.error(colors.red(err.stack));
    await karmaServer.stop();
    process.exit(1);
  }

  async function onFileChange(_event, file) {
    const preventBuild = file.startsWith("tests");
    await buildAndTest({ preventBuild });
  }
}

async function printWelcomeMessage(args) {
  const messages = [
    ["dev server", `http://localhost:${SERVE_PORT}/examples/`],
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
      return colors.white.bold(`${title}:`.padEnd(30)) + colors.white(text);
    })
    .join("\n");

  const boxOptions = {
    padding: 1,
    borderColor: "green",
    borderStyle: "bold",
    backgroundColor: "black",
  };
  const { default: boxen } = await import("boxen");
  console.log(boxen(message, boxOptions));
}
