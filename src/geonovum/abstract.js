// Module geonovum/abstract
// Handle the abstract section properly.
import "deps/regenerator";
import { pub } from "core/pubsubhub";

export const name = "geonovum/abstract";

export async function run(conf) {
  const abs = document.getElementById("abstract");
  if (!abs) {
    pub("error", `Document must have one element with \`id="abstract"`);
    return;
  }
  abs.classList.add("introductory");
  let abstractHeading = document.querySelector("#abstract>h2");
  if (abstractHeading) {
    return;
  }
  abstractHeading = document.createElement("h2");
  abstractHeading.innerText = conf.l10n.abstract;
  abs.insertAdjacentElement("afterbegin", abstractHeading);
}
