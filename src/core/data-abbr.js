// @ts-check
// Module core/data-abbr
// - Finds all elements with data-abbr attribute and processes them.
import { showInlineWarning } from "./utils";
export const name = "core/dfn-abbr";

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
        const msg =
          `[\`data-dfn\`](https://github.com/w3c/respec/wiki/data-abbr)` +
          ` attribute not supported on \`${localName}\` elements.`;
        showInlineWarning(elem, msg, "Error: unsupported.");
      }
    }
  }
}
/**
 * @param {HTMLElement} dfn
 */
function processDfnElement(dfn) {
  const abbr = generateAbbreviation(dfn);
  const fullForm = dfn.textContent.trim();
  dfn.insertAdjacentHTML(
    "afterend",
    ` (<abbr title="${fullForm}">${abbr}</abbr>)`
  );
  dfn.dataset.lt = dfn.dataset.lt ? `${dfn.dataset.lt}|${abbr}` : abbr;
}

function generateAbbreviation(elem) {
  if (elem.dataset.abbr) return elem.dataset.abbr;
  // Generates abbreviation from textContent
  // e.g., "Permanent Account Number" -> "PAN"
  return elem.textContent
    .match(/\b([a-z])/gi)
    .join("")
    .toUpperCase();
}
