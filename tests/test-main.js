"use strict";

// Safety net: Safari can propagate unhandled rejections with reason=undefined
// from opaque-origin srcdoc iframes. jasmine-core 4.6.1 crashes on these
// (formatProperties(undefined).split). Suppress them in the parent frame.
// The primary fix is in SpecHelper.js (absolute import URLs + base tag).
setTimeout(() => {
  const jasmineOnerror = window.onerror;
  if (!jasmineOnerror) return;
  window.onerror = function (msgOrEvent, ...rest) {
    if (msgOrEvent === undefined || msgOrEvent === null) return true;
    if (msgOrEvent === "Unhandled promise rejection: undefined") return true;
    return jasmineOnerror.call(this, msgOrEvent, ...rest);
  };
}, 0);

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
