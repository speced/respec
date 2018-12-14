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
    const titles = getDfnTitles(dfn, { isDefinition: true });
    titles.forEach(title => {
      return registerDefinitionMapping(dfn, title, conf.definitionMap);
    });
  });
}

/**
 *
 * @param {HTMLElement} dfn
 * @param {string} name
 * @param {Record<string, HTMLElement[]>} definitionMap
 */
export function registerDefinitionMapping(dfn, name, definitionMap) {
  if (!definitionMap[name]) {
    definitionMap[name] = [dfn];
  } else if (!definitionMap[name].includes(dfn)) {
    definitionMap[name].push(dfn);
  }
}
