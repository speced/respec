// @ts-check
// Module core/data-abbr
// - Finds all elements with data-abbr attribute and processes them.
import { showInlineWarning } from "./utils";
export const name = "core/dfn-abbr";

export function run() {
  document.querySelectorAll("[data-abbr]").forEach(elem => {
    const { localName } = elem;
    switch (localName) {
      case "dfn":
        // @ts-ignore
        processDfnElement(elem);
        break;
      default: {
        const msg =
          `[\`data-dfn\`](https://github.com/w3c/respec/wiki/data-abbr)` +
          ` attribute not supported on \`${localName}\` elements.`;
        showInlineWarning(elem, msg, "Error: unsupported.");
      }
    }
  });
}
/**
 * @param {HTMLElement} dfn
 */
function processDfnElement(dfn) {
  if (dfn.dataset.abbr === "") {
    // Generates abbreviation from textContent
    // e.g., "Permanent Account Number" -> "PAN"
    dfn.dataset.abbr = dfn.textContent
      .match(/\b([a-z])/gi)
      .join("")
      .toUpperCase();
  }
  const fullForm = dfn.textContent.trim();
  const { abbr } = dfn.dataset;
  dfn.insertAdjacentHTML(
    "afterend",
    ` (<abbr title="${fullForm}">${abbr}</abbr>)`
  );
  dfn.dataset.lt = dfn.dataset.lt ? `${dfn.dataset.lt}|${abbr}` : abbr;
}
