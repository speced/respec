// @ts-check
// Module core/dfn
// - Finds all <dfn> elements with data-abbr attribute and parses them and registers definitions.
// - Also populates abbrMap used by core/inlines for such definitions.

import { getAbbreviationFromText } from "./utils";
import { registerDefinition } from "./dfn-map";

export const name = "core/dfn-abbr";
export const abbrMap = new Map();

/**
 * Parses Elements of form <dfn data-abbr="PAN">Permanent Account Number</dfn>
 * to <dfn data-abbr="PAN">Permanent Account Number (PAN)</dfn>
 * @param {HTMLElement} dfn Element to be parsed.
 */
function parseAbbreviatedDefinition(dfn) {
  // checks if text content is already in the form Permanent Account Number (PAN)
  const matched = /\((.*?)\)/.exec(dfn.textContent);
  if (!matched || !(matched.pop() === dfn.dataset.abbr))
    dfn.textContent = dfn.textContent.concat(` (${dfn.dataset.abbr})`);
}

export function run() {
  document.querySelectorAll("dfn").forEach(dfn => {
    if (!dfn.hasAttribute("data-abbr")) return;

    if (dfn.dataset.abbr === "")
      dfn.dataset.abbr = getAbbreviationFromText(dfn.textContent);

    abbrMap.set(dfn.dataset.abbr, dfn.textContent);

    parseAbbreviatedDefinition(dfn);

    const fullForm = dfn.textContent
      .substr(0, dfn.textContent.lastIndexOf("("))
      .trim();

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
