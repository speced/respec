"use strict";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
// Get a list of all the test files to include
var testFiles = Object.keys(window.__karma__.files)
  .filter(function(file) {
    // ends with "-spec.js"
    return /-spec\.js$/.test(file);
  })
  .map(function(file) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    return file.replace(/^\/base\//, "").replace(/\.js$/, "");
  })
  .reduce(function(collector, nextFile) {
    collector.push(nextFile);
    return collector;
  }, []);

var allDeps = [
  "js/core/jquery-enhanced",
  "fetch",
].concat(testFiles);

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: "/base/",
  paths: {
    "core/jquery-enhanced": "js/core/jquery-enhanced",
    "core/pubsubhub": "js/core/pubsubhub",
    "core/utils": "js/core/utils",
    "fetch": "/base/node_modules/whatwg-fetch/fetch",
    "jquery": "/base/node_modules/jquery/dist/jquery",
    "marked": "/base/node_modules/marked/lib/marked.js",
  },
  // dynamically load all test files and other deps
  deps: allDeps,
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,
});
