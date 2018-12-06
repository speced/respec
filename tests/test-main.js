/*eslint-env node*/
"use strict";
// Get a list of all the test files to include
const testFiles = Object.keys(window.__karma__.files)
  // ends with "-spec.js"
  .filter(file => /-spec\.js$/.test(file))
  // Normalize paths to RequireJS module names.
  // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
  // then do not normalize the paths
  .map(file => file.replace(/^\/base\//, "").replace(/\.js$/, ""))
  .reduce((collector, file) => {
    collector.push(file);
    return collector;
  }, []);

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
    "core/linter-rules/check-punctuation":
      "/base/js/core/linter-rules/check-punctuation",
    "core/linter-rules/local-refs-exist":
      "/base/js/core/linter-rules/local-refs-exist",
    "core/l10n": "/base/js/core/l10n",
    "w3c/linter-rules/privsec-section":
      "/base/js/w3c/linter-rules/privsec-section",
    "w3c/l10n": "/base/js/w3c/l10n",
    "core/LinterRule": "/base/js/core/LinterRule",
    "core/biblio-db": "/base/js/core/biblio-db",
    "core/jquery-enhanced": "/base/js/core/jquery-enhanced",
    "core/pubsubhub": "/base/js/core/pubsubhub",
    "core/utils": "/base/js/core/utils",
    "deps/jquery": "/base/js/deps/jquery",
    "deps/marked": "/base/js/deps/marked",
    "deps/idb": "/base/js/deps/idb",
    "w3c/linter": "/base/js/w3c/linter",
    "core/exporter": "/base/js/core/exporter",
    "deps/hyperhtml": "/base/js/deps/hyperhtml",
  },
});
