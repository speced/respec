// Karma configuration
// Generated on Fri Feb 26 2016 13:09:51 GMT+1100 (AEDT)
"use strict";
module.exports = function (config) {
  const options = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "./",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

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
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

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
  if (process.env.BROWSERS) {
    options.browsers = process.env.BROWSERS.split(" ");
  }

  if (process.env.GITHUB_WORKFLOW) {
    const localPlugins = [require("./tools/github-action-reporter.js")];
    options.reporters.push("respec-github-action");
    options.plugins = ["karma-*"].concat(localPlugins);
  }

  config.set(options);
};
