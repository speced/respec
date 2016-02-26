var TEST_REGEXP = /(spec|test)\.js$/i;
var allTestFiles = [];
// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

var requireConfig = {
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/',

  // example of using a couple path translations (paths), to allow us to refer to different library dependencies, without using relative paths
  paths: {
    'js/jquery': 'jquery',
    'core/utils': 'js/core/utils',
    'ui': (window.respecVersion) ? "https://w3c.github.io/respec/js/ui" : "",
  },

  shim: {
    shortcut: {
      exports: "shortcut"
    }
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,
}

require.config(requireConfig);
