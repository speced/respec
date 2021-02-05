// @ts-check
// Module core/data-abbr
// - Finds all elements with data-abbr attribute and processes them.
import { showError } from "./utils.js";
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
 * @param {HTMLElement} dfn
 */
function processDfnElement(dfn) {
  const abbr = generateAbbreviation(dfn);
  // get normalized <dfn> textContent to remove spaces, tabs, new lines.
  const fullForm = dfn.textContent.replace(/\s\s+/g, " ").trim();
  dfn.insertAdjacentHTML(
    "afterend",
    ` (<abbr title="${fullForm}">${abbr}</abbr>)`
  );
  const lt = dfn.dataset.lt || "";
  dfn.dataset.lt = lt
    .split("|")
    .filter(i => i.trim())
    .concat(abbr)
    .join("|");
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
