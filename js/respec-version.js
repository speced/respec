// A shim for requirejs to read ReSpec version.
// TODO: migrate to native json import when we ditch requirejs.
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    const { version } = require("../package.json");
    const v = factory(exports, version);
    if (v !== undefined) module.exports = v;
  }
})((exports, version) => {
  "use strict";
  exports.__esModule = true;
  exports.version = version || "Developer Edition";
});
