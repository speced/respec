// Module core/dfn
// - Finds all <dfn> elements and populates conf.definitionMap to identify them.

import { getDfnTitles } from "./utils";

export const name = "core/dfn";

export function run(conf) {
  document.querySelectorAll("dfn").forEach(dfn => {
    const closestDfn = dfn.closest("[data-dfn-for]");
    if (closestDfn && closestDfn !== dfn && !dfn.dataset.dfnFor) {
      dfn.dataset.dfnFor = closestDfn.dataset.dfnFor;
    }
    if (dfn.dataset.dfnFor) {
      dfn.dataset.dfnFor = dfn.dataset.dfnFor.toLowerCase();
    }
    // TODO: we should probably use weakmaps and weaksets here to avoid leaks.
    getDfnTitles(dfn, { isDefinition: true })
      .map(dfnTitle => {
        if (!conf.definitionMap[dfnTitle]) {
          conf.definitionMap[dfnTitle] = [];
        }
        return conf.definitionMap[dfnTitle];
      })
      .reduce((dfn, dfnTitleContainer) => {
        dfnTitleContainer.push(dfn);
        return dfn;
      }, dfn);
  });
}
