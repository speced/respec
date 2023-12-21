// @ts-check
/**
 * Module core/data-abbr
 *
 * Finds all elements with the data-abbr attribute and processes them.
 *
 * @module core/data-abbr
 */

import { showError } from "./utils.js";

export const name = "core/data-abbr";

/**
 * Runs the data-abbr processing on elements with the data-abbr attribute.
 */
export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const elements = document.querySelectorAll("[data-abbr]");
  for (const elem of elements) {
    const { localName } = elem;
    switch (localName) {
      case "dfn":
        processDfnElement(elem);
        break;
      default: {
        const msg = `\`data-abbr\` attribute not supported on \`${localName}\` elements.`;
        showError(msg, name, {
          elements: [elem],
          title: "Error: unsupported.",
        });
      }
    }
  }
}

/**
 * Processes the dfn element with the data-abbr attribute.
 * @param {HTMLElement} dfn - The dfn element.
 */
function processDfnElement(dfn) {
  const abbr = generateAbbreviation(dfn);
  const fullForm = dfn.textContent.replace(/\s\s+/g, " ").trim();
  const abbrMarkup = createAbbreviationMarkup(fullForm, abbr);
  dfn.insertAdjacentHTML("afterend", abbrMarkup);
  updateLtAttribute(dfn, abbr);
}

/**
 * Generates the abbreviation for the dfn element.
 * @param {HTMLElement} elem - The dfn element.
 * @returns {string} The generated abbreviation.
 */
function generateAbbreviation(elem) {
  if (elem.dataset.abbr) return elem.dataset.abbr;
  return elem.textContent
    .match(/\b([a-z])/gi)
    .join("")
    .toUpperCase();
}

/**
 * Creates the HTML markup for the abbreviation.
 * @param {string} fullForm - The full form text.
 * @param {string} abbr - The generated abbreviation.
 * @returns {string} The abbreviation markup.
 */
function createAbbreviationMarkup(fullForm, abbr) {
  return ` (<abbr title="${fullForm}">${abbr}</abbr>)`;
}

/**
 * Updates the `data-lt` attribute of the dfn element with the generated abbreviation.
 * @param {HTMLElement} dfn - The dfn element.
 * @param {string} abbr - The generated abbreviation.
 */
function updateLtAttribute(dfn, abbr) {
  const lt = dfn.dataset.lt || "";
  const ltValues = lt.split("|").filter(i => i.trim());
  ltValues.push(abbr);
  dfn.dataset.lt = ltValues.join("|");
}
