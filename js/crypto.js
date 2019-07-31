// A module to parse HTML into DocumentFragment both on browsers and Node.js
// TODO: migrate to ES module when top-level await arrives
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    const crypto = require("crypto");
    const v = factory(exports, crypto);
    if (v !== undefined) module.exports = v;
  }
})((exports, crypto) => {
  "use strict";
  exports.__esModule = true;
  exports.sha1Digest = str => {
    if (crypto) {
      const hash = crypto.createHash("sha1");
      hash.update(str);
      return Promise.resolve(hash.digest().buffer);
    }
    const buffer = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-1", buffer);
  };
});
