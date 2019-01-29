// Karma configuration
// Generated on Fri Feb 26 2016 13:09:51 GMT+1100 (AEDT)
/*globals module, require, process*/
"use strict";
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
    reporters: ["mocha"],

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
  };
  if (process.env.TRAVIS) {
    process.env.CHROME_BIN = require("puppeteer").executablePath();
    options.detectBrowsers.enabled = false;
    options.autoWatch = false;
    options.singleRun = true;
    options.concurrency = 1;
    options.reporters = ["mocha"];
    options.browsers = ["ChromeHeadless"];
  }
  config.set(options);
};
