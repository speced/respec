// Module w3c/abstract
// Handle the abstract section properly.
import { l10n, lang } from "../core/l10n";
import { pub } from "../core/pubsubhub";
export const name = "w3c/abstract";

export async function run() {
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
  abstractHeading.innerText = l10n[lang].abstract;
  abs.prepend(abstractHeading);
}
