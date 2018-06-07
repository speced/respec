// Module w3c/conformance
// Handle the conformance section properly.
import confoTmpl from "geonovum/templates/conformance";
import { pub } from "core/pubsubhub";

export const name = "geonovum/conformance";

export function run(conf, doc, cb) {
  var $confo = $("#conformance");
  if ($confo.length) $confo.prepend(confoTmpl(conf).childNodes);
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", "geonovum/conformance");
  cb();
}
