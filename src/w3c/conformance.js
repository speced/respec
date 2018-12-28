// Module w3c/conformance
// Handle the conformance section properly.
import confoTmpl from "./templates/conformance.js";
import { pub } from "../core/pubsubhub.js";

export const name = "w3c/conformance";

export function run(conf) {
  const confo = document.getElementById("conformance");
  if (confo) confo.prepend(...confoTmpl(conf).childNodes);
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", "w3c/conformance");
}
