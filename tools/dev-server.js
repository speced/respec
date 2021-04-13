/**
 * This tools lets one effectively run:
 *  $ npm run build:w3c
 *  $ npm run server
 *  $ npm run test:unit
 *  $ npm run test:integration
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
const boxen = require("boxen");
const sade = require("sade");
const serveConfig = require("../serve.json");
const { Builder } = require("./builder");

const KARMA_PORT_UNIT_TESTS = 9876;
const KARMA_PORT_INTEGRATION_TESTS = 9877;
const SERVE_PORT = 5000;
const TESTS_DIR = path.join(__dirname, "..", "tests");

class KarmaServer {
  /**
   * @param {string} configFile
   * @param {number} port
   * @param {string} label
   * @param {string} [browser]
   */
  constructor(configFile, port, label, browser, grep = "") {
    this._label = label;
    const browsers = browser ? [browser] : undefined;
    this._karmaConfig = karma.config.parseConfig(configFile, {
      browsers,
      port,
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

    process.stdout.write(boxen(`Running ${this._label}`, { dimBorder: true }));

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
  const unitTestServer = new KarmaServer(
    path.join(TESTS_DIR, "unit/karma.conf.js"),
    KARMA_PORT_UNIT_TESTS,
    "Unit Tests",
    args.browser,
    args.grep
  );
  const integrationTestServer = new KarmaServer(
    path.join(TESTS_DIR, "spec/karma.conf.js"),
    KARMA_PORT_INTEGRATION_TESTS,
    "Integration Tests",
    args.browser,
    args.grep
  );
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
  printWelcomeMessage(args);
  await Promise.all([unitTestServer.start(), integrationTestServer.start()]);
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
          await unitTestServer.stop();
          await integrationTestServer.stop();
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
    const {
      preventBuild = false,
      unitTests = true,
      integrationTests = true,
    } = options;
    if (isActive) return;
    try {
      isActive = true;
      if (!preventBuild) {
        await Builder.build({ name: args.profile, debug: true });
      }
      if (unitTests) await unitTestServer.run();
      if (integrationTests) await integrationTestServer.run();
    } catch (err) {
      console.error(colors.error(err.stack));
    } finally {
      isActive = false;
    }
  }

  async function onError(err) {
    console.error(colors.error(err.stack));
    await unitTestServer.stop();
    await integrationTestServer.stop();
    process.exit(1);
  }

  async function onFileChange(_event, file) {
    const preventBuild = file.startsWith("tests");
    const unitTests =
      !file.startsWith("tests") || file.startsWith("tests/unit");
    const integrationTests =
      !file.startsWith("tests") || file.startsWith("tests/spec");

    await buildAndTest({ preventBuild, unitTests, integrationTests });
  }
}

function printWelcomeMessage(args) {
  const messages = [
    ["dev server", `http://localhost:${SERVE_PORT}`],
    ["karma (unit tests)", `http://localhost:${KARMA_PORT_UNIT_TESTS}`],
    [
      "karma (integration tests)",
      `http://localhost:${KARMA_PORT_INTEGRATION_TESTS}`,
    ],
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
  console.log(boxen(message, boxOptions));
}
