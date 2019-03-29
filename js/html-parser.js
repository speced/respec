// A module to parse HTML into DocumentFragment both on browsers and Node.js
// TODO: migrate to ES module when top-level await arrives
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    const jsdom = require("jsdom");
    const v = factory(exports, jsdom);
    if (v !== undefined) module.exports = v;
  }
})((exports, jsdom) => {
  "use strict";
  exports.__esModule = true;
  exports.parseHTML = jsdom
    ? jsdom.JSDOM.fragment
    : fragment => {
        return document.createRange().createContextualFragment(fragment);
      };
});
