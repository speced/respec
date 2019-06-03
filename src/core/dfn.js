// @ts-check
// Module core/dfn
// Finds all <dfn> elements and:
// - populates definitionMap to identify them.
// - normalize `data-dfn-for`
// - add `data-export` unless there is `data-noexport`

import { getDfnTitles } from "./utils.js";
import { registerDefinition } from "./dfn-map.js";

export const name = "core/dfn";

export function run() {
  document.querySelectorAll("dfn").forEach(dfn => {
    /** @type {HTMLElement} */
    const closestDfn = dfn.closest("[data-dfn-for]");
    if (closestDfn && closestDfn !== dfn && !dfn.dataset.dfnFor) {
      dfn.dataset.dfnFor = closestDfn.dataset.dfnFor;
    }
    if (dfn.dataset.dfnFor) {
      dfn.dataset.dfnFor = dfn.dataset.dfnFor.toLowerCase();
    }
    if (!("noexport" in dfn.dataset)) {
      dfn.dataset.export = "";
    }

    // TODO: we should probably use weakmaps and weaksets here to avoid leaks.
    const titles = getDfnTitles(dfn, { isDefinition: true });
    registerDefinition(dfn, titles);
  });
}
