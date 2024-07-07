/* eslint-env node */
"use strict";
// Get a list of all the test files to include
const testFiles = Object.keys(window.__karma__.files)
  // ends with "-spec.js"
  .filter(file => /-spec\.js$/.test(file));

// Allows tests to be loaded asynchronously
// TODO: Remove this when browsers add support for top level await
window.__karma__.loaded = function () {};

// Note that import() here is a special ES syntax
// so it cannot be used as .map(import);
Promise.all(testFiles.map(testFile => import(testFile))).then(
  window.__karma__.start
);
