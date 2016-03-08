"use strict";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
// Get a list of all the test files to include
var allTestFiles = Object.keys(window.__karma__.files)
  .filter(function(file) {
    // ends with "-spec.js"
    return /-spec\.js$/.test(file);
  })
  .map(function(file) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    return file.replace(/^\/base\/|\.js$/g, "");
  })
  .reduce(function(collector, nextFile) {
    collector.push(nextFile);
    return collector;
  }, []);

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: "/base/",
  // dynamically load all test files
  deps: allTestFiles,
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,
});
window.isKarma = true;
