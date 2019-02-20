/* eslint-env node */
"use strict";
// Get a list of all the test files to include
const testFiles = Object.keys(window.__karma__.files)
  // ends with "-spec.js"
  .filter(file => /-spec\.js$/.test(file))
  // Normalize paths to RequireJS module names.
  // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
  // then do not normalize the paths
  .map(file => file.replace(/^\/base\//, "").replace(/\.js$/, ""));

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: "/base/",
  // dynamically load all test files and other deps
  deps: testFiles,
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,
  paths: {
    core: "/base/js/core",
    w3c: "/base/js/w3c",
    clipboard: "deps/clipboard",
    hyperhtml: "deps/hyperhtml",
    "idb-keyval": "deps/idb",
    jquery: "deps/jquery",
    marked: "deps/marked",
    pluralize: "deps/pluralize",
    text: "deps/text",
    webidl2: "deps/webidl2",
  },
});
