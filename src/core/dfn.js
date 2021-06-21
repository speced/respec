// @ts-check
// Module core/dfn
// - Finds all <dfn> elements and populates definitionMap to identify them.

import { getDfnTitles, norm, showError } from "./utils.js";
import { registerDefinition } from "./dfn-map.js";

export const name = "core/dfn";

export function run() {
  document.querySelectorAll("dfn").forEach(dfn => {
    const titles = getDfnTitles(dfn);
    registerDefinition(dfn, titles);

    const [firstTitle] = titles;

    processInternalSlotsAsIDL(firstTitle, dfn);

    // Per https://tabatkins.github.io/bikeshed/#dfn-export, a dfn with dfnType
    // other than dfn and not marked with data-no-export is to be exported.
    // We also skip "imported" definitions via data-cite.
    const ds = dfn.dataset;
    if (ds.dfnType && ds.dfnType !== "dfn" && !ds.cite && !ds.noExport) {
      dfn.dataset.export = "";
    }

    // Only add `lt`s that are different from the text content
    if (titles.length === 1 && firstTitle === norm(dfn.textContent)) {
      return;
    }
    dfn.dataset.lt = titles.join("|");
  });
}
/**
 *
 * @param {string} title
 * @param {HTMLElement} dfn
 */
function processInternalSlotsAsIDL(title, dfn) {
  if (!/^\[\[\w+\]\]$/.test(title)) return;
  if (!dfn.dataset.idl) {
    dfn.dataset.idl = "";
  }

  // Automatically use the closest data-dfn-for as the parent.
  /** @type HTMLElement */
  const parent = dfn.closest("[data-dfn-for]");
  if (parent && dfn !== parent && parent.dataset.dfnFor) {
    dfn.dataset.dfnFor = parent.dataset.dfnFor;
  }

  // Assure that it's data-dfn-for= something.
  if (!dfn.dataset.dfnFor) {
    const msg = `Internal slot "${title}" must be associated with a WebIDL interface.`;
    const hint =
      "Use a `data-dfn-for` attribute to associate this dfn with a WebIDL interface.";
    showError(msg, name, { hint, elements: [dfn] });
  }
  dfn.dataset.dfnType = "attribute";
}
