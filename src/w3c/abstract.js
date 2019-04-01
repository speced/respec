// @ts-check
// Module w3c/abstract
// Handle the abstract section properly.
import { l10n } from "../core/l10n";
import { pub } from "../core/pubsubhub";
export const name = "w3c/abstract";

/**
 * @param {import("../respec-document").RespecDocument} respecDoc
 */
export default function({ document, lang }) {
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
  abstractHeading.textContent = l10n[lang].abstract;
  abs.prepend(abstractHeading);
}
