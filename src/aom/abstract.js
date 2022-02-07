// @ts-check
// Module aom/abstract
// Handle the abstract section properly.
import { getIntlData, showError } from "../core/utils.js";
export const name = "aom/abstract";

const localizationStrings = {
  en: {
    abstract: "Abstract",
  },
};
const l10n = getIntlData(localizationStrings);

export async function run() {
  const abs = document.getElementById("abstract");
  if (!abs) {
    const msg = `Document must have one element with \`id="abstract"`;
    showError(msg, name);
    return;
  }
  abs.classList.add("introductory");
  let abstractHeading = document.querySelector("#abstract>h2");
  if (abstractHeading) {
    return;
  }
  abstractHeading = document.createElement("h2");
  abstractHeading.textContent = l10n.abstract;
  abs.prepend(abstractHeading);
}
