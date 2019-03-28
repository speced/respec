// A shim to use hyperhtml on Node.js.
// TODO: migrate to ES module when top-level await arrives
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["require", "exports", "hyperhtml"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    const hypermorphic =
      typeof document !== "undefined"
        ? require("hyperhtml")
        : require("viperhtml");
    var v = factory(require, exports, hypermorphic);
    if (v !== undefined) module.exports = v;
  }
})(function (require, exports, hypermorphic) {
  "use strict";
  exports.__esModule = true;
  exports.default = function(strings, ...args) {
    const result = (hypermorphic.default || hypermorphic)(strings, ...args);
    if (result.constructor.name !== "Buffer") {
      return result;
    }
    const { JSDOM } = require("jsdom");
    const fragment = JSDOM.fragment(result.toString());
    if (fragment.childNodes.length === 1) {
      return fragment.childNodes[0];
    }
    return fragment;
  };
});
