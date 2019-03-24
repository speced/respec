// @ts-check
// Module core/dfn
// - Finds all <dfn> elements and populates conf.definitionMap to identify them.
// - Also populates abbrMap from core/inlines for definitions that have an abbreviation

import { registerDefinition } from "./dfn-map";

export const name = "core/dfn-abbr";
export const abbrMap = new Map();

export function run() {
  document.querySelectorAll("dfn[data-abbr]").forEach(dfn => {
    if (dfn.dataset.abbr === "")
      dfn.dataset.abbr = dfn.textContent
        .split(" ")
        .map(definition => definition.charAt(0))
        .filter(char => char.match(/[a-z]/i))
        .join("")
        .toUpperCase();
    abbrMap.set(dfn.dataset.abbr, dfn.textContent);

    // checks if text content is already in the form Permanent Account Number (PAN)
    const matched = /\((.*?)\)/.exec(dfn.textContent);
    if (!matched || !(matched.pop() === dfn.dataset.abbr))
      dfn.textContent = dfn.textContent.concat(` (${dfn.dataset.abbr})`);
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
