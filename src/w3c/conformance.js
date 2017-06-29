// Module w3c/conformance
// Handle the conformance section properly.
import tmpls from "templates";
import { pub } from "core/pubsubhub";

export const name = "w3c/conformance";
const confoTmpl = tmpls["conformance.html"];

export function run(conf, doc, cb) {
  var $confo = $("#conformance");
  if ($confo.length) $confo.prepend(confoTmpl(conf));
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", "w3c/conformance");
  cb();
}
