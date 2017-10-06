// Module core/dfn
// Finds all <dfn> elements and populates conf.definitionMap to identify them.
export const name = "core/dfn";

import { pub } from "core/pubsubhub";

function canonicalize(query, attributeName) {
  const offendingElements = document.querySelectorAll(query);
  const offendingMsg =
    "The `for` and `dfn-for` attributes are deprecated. " +
    "Please use `data-dfn-for` instead. See developer console.";
  if (offendingElements.length) {
    pub(offendingMsg);
  }
  Array.from(offendingElements).forEach(el => {
    console.warn(offendingMsg, el);
    el.dataset.dfnFor = el.getAttribute(attributeName).toLowerCase();
    el.removeAttribute(attributeName);
  });
}

export function run(conf, doc, cb) {
  if (!conf.hasOwnProperty("definitionMap")) {
    conf.definitionMap = Object.create(null);
  }
  // Canonicalize "dfn-for" and "for" attributes to data-dfn-for
  canonicalize("[dfn-for]", "dfn-for");
  canonicalize("dfn[for]", "for");
  Array.from(document.querySelectorAll("dfn")).forEach(dfn => {
    const closestDfn = dfn.closest("[data-dfn-for]");
    if (closestDfn && closestDfn !== dfn && !dfn.dataset.dfnFor) {
      dfn.dataset.dfnFor = closestDfn.dataset.dfnFor;
    }
    if (dfn.dataset.dfnFor) {
      dfn.dataset.dfnFor = dfn.dataset.dfnFor.toLowerCase();
    }
    // TODO: dfn's are tragically jquery'ed and stored. Should fix this.
    // Also, we should probably use weakmaps and weaksets here
    // to avoid leaks.
    const $dfn = $(dfn);
    $dfn
      .getDfnTitles({ isDefinition: true })
      .map(dfnTitle => {
        if (!conf.definitionMap[dfnTitle]) {
          conf.definitionMap[dfnTitle] = [];
        }
        return conf.definitionMap[dfnTitle];
      })
      .reduce(function($dfn, dfnTitleContainer) {
        dfnTitleContainer.push($dfn);
        return $dfn;
      }, $dfn);
  });
  cb();
}
