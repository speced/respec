// Module pcisig/conformance
// Handle the conformance section properly.
import tmpls from "../deps/templates.js";
import { pub } from "../core/pubsubhub.js";

export const name = "pcisig/conformance";
const confoTmpl = tmpls["pcisig-conformance"];

export function run(conf, doc, cb) {
  var $confo = $("#conformance");
  if ($confo.length) $confo.prepend(confoTmpl(conf));
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", "pcisig/conformance");
  cb();
}
