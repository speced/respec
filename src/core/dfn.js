// @ts-check
// Module core/dfn
// - Finds all <dfn> elements and populates definitionMap to identify them.

import { getDfnTitles, norm } from "./utils.js";
import { registerDefinition } from "./dfn-map.js";

export const name = "core/dfn";

export function run() {
  document.querySelectorAll("dfn").forEach(dfn => {
    const titles = getDfnTitles(dfn);
    registerDefinition(dfn, titles);

    // Treat Internal Slots as IDL.
    if (!dfn.dataset.dfnType && /^\[\[\w+\]\]$/.test(titles[0])) {
      dfn.dataset.dfnType = "idl";
    }

    // Per https://tabatkins.github.io/bikeshed/#dfn-export, a dfn with dfnType
    // other than dfn and not marked with data-no-export is to be exported.
    // We also skip "imported" definitions via data-cite.
    const ds = dfn.dataset;
    if (ds.dfnType && ds.dfnType !== "dfn" && !ds.cite && !ds.noExport) {
      dfn.dataset.export = "";
    }

    // Only add `lt`s that are different from the text content
    if (titles.length === 1 && titles[0] === norm(dfn.textContent)) {
      return;
    }
    dfn.dataset.lt = titles.join("|");
  });
}
