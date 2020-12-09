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

    // per https://tabatkins.github.io/bikeshed/#dfn-export
    // a dfn typed with something else than dfn
    // and not marked with noexport is to be exported
    // We also skip "imported" definitions via data-cite
    if (
      dfn.dataset.dfnType &&
      dfn.dataset.dfnType !== "dfn" &&
      !dfn.dataset.cite &&
      !dfn.dataset.noexport
    ) {
      dfn.dataset.export = "";
    }

    // Only add `lt`s that are different from the text content
    if (titles.length === 1 && titles[0] === norm(dfn.textContent)) {
      return;
    }
    dfn.dataset.lt = titles.join("|");
  });
}
