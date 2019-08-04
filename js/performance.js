// A module to expose Performance Timing API both on browsers and Node.js
// TODO: migrate to ES module when top-level await arrives
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    const { performance } = require("perf_hooks");
    const v = factory(exports, performance);
    if (v !== undefined) module.exports = v;
  }
})((exports, performance) => {
  "use strict";
  exports.__esModule = true;
  exports.default = performance || self.performance;
});
