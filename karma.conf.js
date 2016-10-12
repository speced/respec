// Karma configuration
// Generated on Fri Feb 26 2016 13:09:51 GMT+1100 (AEDT)
/*globals module, require, process*/
"use strict";
module.exports = function(config) {
  var options = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "./",


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      "jasmine",
      "requirejs",
      "detectBrowsers",
    ],

    // configuration
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection(browsers){
        return browsers;
      }
    },

    // list of files / patterns to load in the browser
    files: [{
        pattern: "js/**/*.*",
        included: false,
        served: true,
      }, {
        pattern: "tests/**/*-spec.js",
        included: false,
        served: true,
      }, {
        pattern: "tests/**/*.html",
        included: false,
        served: true,
      },
      "js/deps/jquery.js",
      "js/deps/fetch.js",
      "tests/spec/SpecHelper.js",
      "tests/test-main.js",
    ],

    // list of files to exclude
    exclude: [
      "**/*.swp",
      "*.swp",
      ".DS_Store",
    ],

    proxies: {
      "/js/": "/base/js/",
      "/tests/": "/base/tests/",
      "/spec/": "/base/tests/spec/",
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha"],

    // web server port
    port: 9876,


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

    customLaunchers: {
      chrome_canary_travis: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      },
    },
  };
  if (process.env.TRAVIS) {
    options.detectBrowsers.enabled = false;
    options.autoWatch = false;
    options.singleRun = true;
    options.concurrency = 1;
    options.reporters = ["mocha"];
    options.browsers = ["chrome_canary_travis", "FirefoxNightly"];
  }
  config.set(options);
};
