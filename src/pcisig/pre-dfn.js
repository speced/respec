// Module pcisig/pre-dfn
// Finds all <dfn> elements and adjust dfn-type attribute.

export const name = "pcisig/pre-dfn";

export function run(conf, doc, cb) {
  "use strict";
  const dfnClass = ["dfn", "pin", "signal", "op", "opcode", "operation", "request", "response", "bit",
    "reply", "message", "msg", "command", "term", "field", "register",
    "regpict", "state", "value", "parameter", "argument"];

  $("dfn:not([data-dfn-type])", doc).each(function () {
    const $dfn = $(this);
    let tag = dfnClass[0];  // default "dfn"
    dfnClass.forEach(function (t) {
      if ($dfn.hasClass(t)) tag = t;
    });
    $dfn.attr("data-dfn-type", tag);   // core/dfn will convert this to data-dfn-type
  });
  cb();
}
