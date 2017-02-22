define(["exports", "core/utils"], function (exports, _utils) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.name = undefined;
  exports.run = run;
  var name = exports.name = "w3c/rfc2119"; // Module w3c/rfc2119
  // update the 2119 terms section with the terms actually used

  function run(conf, doc, cb) {
    var confo = doc.getElementById("respecRFC2119");
    if (!confo) {
      return cb();
    }
    // do we have a list of used RFC2119 items in
    // conf.respecRFC2119
    var terms = Object.getOwnPropertyNames(conf.respecRFC2119);

    // there are no terms used - remove the clause
    if (terms.length === 0) {
      confo.remove();
      return cb();
    }

    // put in the 2119 clause and reference
    var html = (0, _utils.joinAnd)(terms.sort(), function (item) {
      return "<em class=\"rfc2119\">" + item + "</em>";
    });
    var plural = terms.length > 1;
    var str = "The key word" + (plural ? "s " : " ") + " " + html + " " + (plural ? "are" : "is") + " " + confo.innerHTML;
    confo.innerHTML = str;
    cb();
  }
});
//# sourceMappingURL=rfc2119.js.map