// @ts-check
// Module core/dfn
// - Finds all <dfn> elements with data-abbr attribute and parses them and registers definitions.
// - Also populates abbrMap used by core/inlines for such definitions.

import { registerDefinition } from "./dfn-map";

export const name = "core/dfn-abbr";
export const abbrMap = new Map();

/**
 * Generates simple Abbreviations from text passed.
 *
 * @param {String} text A string like "Permanent Account Number".
 * @returns {String} abbr Abbreviation like "PAN"
 */

function getAbbreviationFromText(text) {
  return text
    .match(/\b([a-z])/gi)
    .join("")
    .toUpperCase();
}

/**
 * Parses Elements of form <dfn data-abbr="PAN">Permanent Account Number</dfn>
 * to <dfn data-abbr="PAN">Permanent Account Number (PAN)</dfn>
 * @param {HTMLElement} dfn Element to be parsed.
 */
function renderAbbreviatedDefinition(dfn) {
  dfn.textContent = dfn.textContent.concat(` (${dfn.dataset.abbr})`);
}

export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const dfns = document.querySelectorAll("dfn[data-abbr]");
  dfns.forEach(dfn => {
    if (dfn.dataset.abbr === "") {
      dfn.dataset.abbr = getAbbreviationFromText(dfn.textContent);
    }

    renderAbbreviatedDefinition(dfn);

    const fullForm = dfn.textContent
      .substr(0, dfn.textContent.lastIndexOf("("))
      .trim();

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
