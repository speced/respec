// Karma configuration
// Generated on Fri Feb 26 2016 13:09:51 GMT+1100 (AEDT)
"use strict";
module.exports = function (config) {
  const options = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "./",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "detectBrowsers"],

    // configuration
    detectBrowsers: {
      enabled: !config.browsers.length,
      usePhantomJS: false,
      postDetection(browsers) {
        return (
          browsers
            // Remove IE
            .filter(browser => browser !== "IE")
        );
      },
    },

    // list of files / patterns to load in the browser
    files: [
      {
        pattern: "assets/**/*.*",
        included: false,
      },
      {
        pattern: "tests/support-files/**/*",
        included: false,
      },
      {
        pattern: "builds/**/*.*",
        included: false,
      },
      {
        pattern: "js/**/*.*",
        included: false,
      },
      {
        pattern: "src/**/*.*",
        included: false,
      },
      {
        pattern: "node_modules/idb/**/*.js",
        included: false,
      },
      {
        pattern: "node_modules/hyperhtml/**/*.js",
        included: false,
      },
      {
        pattern: "node_modules/marked/**/*.js",
        included: false,
      },
      {
        pattern: "node_modules/webidl2/**/*.js",
        included: false,
      },
      {
        pattern: "tests/**/*-spec.js",
        type: "module",
        included: false,
      },
      {
        pattern: "tests/data/**/*",
        included: false,
      },
      {
        pattern: "tests/**/*.html",
        included: false,
      },
      {
        pattern: "worker/*.js",
        included: false,
      },
      {
        pattern: "tests/spec/SpecHelper.js",
        type: "module",
        included: false,
      },
      {
        pattern: "tests/test-main.js",
        type: "module",
      },
    ],

    // list of files to exclude
    exclude: ["**/*.swp", "*.swp", ".DS_Store"],

    proxies: {
      "/about-blank.html": "/base/tests/about-blank.html",
      "/assets/": "/base/assets/",
      "/js/": "/base/js/",
      "/src/": "/base/src/",
      "/node_modules/": "/base/node_modules/",
      "/builds/": "/base/builds/",
      "/tests/": "/base/tests/",
      "/spec/": "/base/tests/spec/",
      "/deps/": "/base/js/deps/",
      "/js/deps/": "/base/js/deps/",
      "/base/deps/": "/base/js/deps/",
      "/worker/respec-worker.js": "/base/worker/respec-worker.js",
      "/support-files/hljs-testlang.js":
        "/base/tests/support-files/hljs-testlang.js",
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha", "kjhtml"],

    // web server port
    port: config.port || 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // See "detectBrowsers"
    // browsers: ["Chrome", "Safari", "Firefox"],
    customLaunchers: {
      FirefoxPref: {
        base: "Firefox",
        prefs: {
          "javascript.options.dynamicImport": true,
        },
      },
      FirefoxHeadlessPref: {
        base: "FirefoxHeadless",
        prefs: {
          "javascript.options.dynamicImport": true,
        },
      },
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    browserNoActivityTimeout: 100000,

    reportSlowerThan: 300,

    client: {
      args: ["--grep", config.grep || ""],
    },
  };
  if (process.env.TRAVIS) {
    process.env.CHROME_BIN = require("puppeteer").executablePath();
    options.autoWatch = false;
    options.concurrency = 1;
  }
  if (process.env.BROWSERS) {
    options.detectBrowsers.enabled = false;
    options.browsers = process.env.BROWSERS.split(" ");
  }

  if (process.env.GITHUB_WORKFLOW) {
    const localPlugins = [
      { "reporter:respec-github-action": ["type", GithubActionReporter] },
    ];
    options.reporters.push("respec-github-action");
    options.plugins = ["karma-*"].concat(localPlugins);
  }

  config.set(options);
};

function GithubActionReporter() {
  const browserFailures = [];
  this.onSpecComplete = (_browser, result) => {
    if (!result.success) {
      const failure = parseFailure(result);
      browserFailures.push(failure);
    }
  };

  this.onRunComplete = () => {
    print("group", "Failed tests");
    browserFailures.forEach(printFailure);
    print("endgroup");
  };

  /**
   * @typedef {{ test: string[], file: string, line: number, col: number, message: string }} Failure
   * @returns {Failure}
   */
  function parseFailure(result) {
    // convert newlines into array and flatten
    const log = result.log.flatMap(message => message.split("\n"));
    const { suite, description } = result;
    const message = log[0].replace("Error: ", "");
    const location = log[2].split(":9876/base/", 2)[1].replace(/\)$/, "");
    // eslint-disable-next-line prefer-const
    let [file, line, col] = location.split(":");
    line = parseInt(line, 10);
    col = parseInt(col, 10);
    const test = suite.concat(description);
    return { test, file, line, col, message };
  }

  /** @param {Failure} failure */
  function printFailure(failure) {
    const { file, line, col, test, message } = failure;
    const msg = test
      .map((s, i) => `${" ".repeat(i * 2)}${s}`)
      .concat([message])
      .join("\n");
    print("error", msg, { file, line, col });
  }

  /**
   * @param {string} command
   * @param {string} message
   * @param {Record<string, string>} options
   */
  function print(command, message = "", options = {}) {
    let optionsString = Object.entries(options)
      .map(([k, v]) => `${k}=${escapeProperty(v)}`)
      .join(",");
    if (optionsString) optionsString = ` ${optionsString}`;
    const msg = escapeData(message);
    const output = `::${command}${optionsString}::${msg}`;
    console.log(output);
  }

  /** @param {string} s */
  function escapeData(s) {
    return s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  }

  /** @param {string} s */
  function escapeProperty(s) {
    return s
      .toString()
      .replace(/\r/g, "%0D")
      .replace(/\n/g, "%0A")
      .replace(/]/g, "%5D")
      .replace(/:/g, "%3A")
      .replace(/,/g, "%2C")
      .replace(/;/g, "%3B");
  }
}
