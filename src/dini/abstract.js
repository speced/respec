// @ts-check
// Module dini/abstract
// Handle the abstract section properly.
import { getIntlData, showError } from "../core/utils.js";
export const name = "dini/abstract";

const localizationStrings = {
  en: {
    abstract: "Abstract",
  },
  ko: {
    abstract: "요약",
  },
  zh: {
    abstract: "摘要",
  },
  ja: {
    abstract: "要約",
  },
  nl: {
    abstract: "Samenvatting",
  },
  es: {
    abstract: "Resumen",
  },
  de: {
    abstract: "Zusammenfassung",
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
