"use strict";
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
  }, [])
  .concat(["js/deps/async"]);

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: "/base/",
  // dynamically load all test files and other deps
  deps: testFiles,
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,
  paths: {
    "core/linter-rules/no-headingless-sections":
      "/base/js/core/linter-rules/no-headingless-sections",
    "core/linter-rules/no-http-props":
      "/base/js/core/linter-rules/no-http-props",
    "core/l10n": "/base/js/core/l10n",
    "w3c/linter-rules/privsec-section":
      "/base/js/w3c/linter-rules/privsec-section",
    "w3c/l10n": "/base/js/w3c/l10n",
    "core/LinterRule": "/base/js/core/LinterRule",
    "core/biblio-db": "/base/js/core/biblio-db",
    "core/jquery-enhanced": "/base/js/core/jquery-enhanced",
    "core/pubsubhub": "/base/js/core/pubsubhub",
    "core/utils": "/base/js/core/utils",
    "deps/async": "/base/js/deps/async",
    "deps/jquery": "/base/js/deps/jquery",
    "deps/marked": "/base/js/deps/marked",
    "w3c/linter": "/base/js/w3c/linter",
  },
});

// Attempt to reduce timeout errors
jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 2;
