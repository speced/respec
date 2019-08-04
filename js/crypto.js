// A module to expose SHA-1 digest feature both on browsers and Node.js
// TODO: migrate to ES module when top-level await arrives
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    const nodeCrypto = require("crypto");
    const v = factory(exports, nodeCrypto);
    if (v !== undefined) module.exports = v;
  }
})((exports, nodeCrypto) => {
  "use strict";
  exports.__esModule = true;
  exports.sha1Digest = str => {
    if (nodeCrypto) {
      const hash = nodeCrypto.createHash("sha1");
      hash.update(str);
      return Promise.resolve(hash.digest().buffer);
    }
    const buffer = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-1", buffer);
  };
});
