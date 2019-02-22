// Karma configuration
// Generated on Fri Feb 26 2016 13:09:51 GMT+1100 (AEDT)
/*globals module, require, process*/
"use strict";
const path = require('path');
module.exports = function(config) {
  const options = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "./",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "requirejs", "detectBrowsers"],

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
      "js/deps/jquery.js",
      {
        pattern: "assets/**/*.*",
        included: false,
        served: true,
      },
      {
        pattern: "tests/support-files/**/*",
        included: false,
        served: true,
      },
      {
        pattern: "builds/**/*.*",
        included: false,
        served: true,
      },
      {
        pattern: "js/deps/marked.js",
        included: false,
        served: true,
      },
      {
        pattern: "js/**/*.*",
        included: false,
        served: true,
      },
      {
        pattern: "tests/**/*-spec.js",
        included: false,
        served: true,
      },
      {
        pattern: "tests/data/**/*",
        included: false,
        served: true,
      },
      {
        pattern: "tests/*.html",
        included: false,
        served: true,
      },
      {
        pattern: "tests/**/*.html",
        included: false,
        served: true,
      },
      {
        pattern: "worker/*.js",
        included: false,
        served: true,
      },
      {
        pattern: "src/**/*.js",
        included: false,
      },
      "tests/spec/SpecHelper.js",
      "tests/test-main.js",
    ],

    // list of files to exclude
    exclude: ["**/*.swp", "*.swp", ".DS_Store"],

    proxies: {
      "/about-blank.html": "/base/tests/about-blank.html",
      "/assets/": "/base/assets/",
      "/js/": "/base/js/",
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
    reporters: ["mocha", "coverage-istanbul", "coveralls"],

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
    //browsers: ["Chrome", "Safari", "Firefox"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    browserNoActivityTimeout: 100000,

    client: {
      args: ["--grep", config.grep || ""],
    },

    // any of these options are valid: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-api/lib/config.js#L33-L39
    coverageIstanbulReporter: {
      // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
      reports: ['lcovonly'],

      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
      dir: path.join(__dirname, 'coverage'),

      // Combines coverage information from multiple browsers into one report rather than outputting a report
      // for each browser.
      combineBrowserReports: true,

      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,

      // Omit files with no statements, no functions and no branches from the report
      skipFilesWithNoCoverage: true,

      // Most reporters accept additional config options. You can pass these through the `report-config` option
      'report-config': {},

      // enforce percentage thresholds
      // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
      thresholds: {
        emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 100,
          lines: 100,
          branches: 100,
          functions: 100
        },
        // thresholds per file
        each: {
          statements: 100,
          lines: 100,
          branches: 100,
          functions: 100,
        }
      },

      verbose: true // output config used by istanbul for debugging
    }
  };
  if (process.env.TRAVIS) {
    process.env.CHROME_BIN = require("puppeteer").executablePath();
    options.detectBrowsers.enabled = false;
    options.autoWatch = false;
    options.singleRun = true;
    options.concurrency = 1;
    options.reporters = ["mocha", "progress", "coverage", "coveralls"];
    options.browsers = ["ChromeHeadless"];
  }
  config.set(options);
};
