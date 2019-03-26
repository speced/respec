// @ts-check
// Module core/dfn
// - Finds all <dfn> elements with data-abbr attribute and parses them and registers definitions.
// - Also populates abbrMap used by core/inlines for such definitions.

import { registerDefinition } from "./dfn-map";

export const name = "core/dfn-abbr";
export const abbrMap = new Map();

export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const dfns = document.querySelectorAll("dfn[data-abbr]");
  dfns.forEach(dfn => {
    if (dfn.dataset.abbr === "") {
      // Generates simple Abbreviations from text passed.
      // A string like "Permanent Account Number" returns an abbreviation like "PAN"
      dfn.dataset.abbr = dfn.textContent
        .match(/\b([a-z])/gi)
        .join("")
        .toUpperCase();
    }

    const fullForm = dfn.textContent.trim();
    dfn.append(` (${dfn.dataset.abbr})`);

    abbrMap.set(dfn.dataset.abbr, fullForm);

    const titles = [
      ...new Set([
        dfn.dataset.abbr.toLowerCase(),
        dfn.textContent.toLowerCase(),
        fullForm.toLowerCase(),
      ]),
    ];
    registerDefinition(dfn, titles);
  });
}
