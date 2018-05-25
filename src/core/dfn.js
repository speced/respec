// Module core/dfn
// - Finds all <dfn> elements and populates conf.definitionMap to identify them.
// - Adds data-lt based automatic pluralization, if enabled
import { plural as pluralize } from "deps/pluralize";

export const name = "core/dfn";

export function run(conf) {
  if (!conf.hasOwnProperty("definitionMap")) {
    conf.definitionMap = Object.create(null);
  }
  document.querySelectorAll("dfn").forEach(dfn => {
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
    let dfnTitles = $dfn.getDfnTitles({ isDefinition: true });

    // add automatic pluralization to `data-lt` attributes
    // see https://github.com/w3c/respec/pull/1682
    if (
      conf.pluralize === true &&
      $dfn.attr("data-lt-noPlural") === undefined
    ) {
      dfnTitles = [...new Set([...dfnTitles, ...dfnTitles.map(pluralize)])];
      $dfn.attr("data-lt", dfnTitles.join("|"));
    }

    dfnTitles
      .map(dfnTitle => {
        if (!conf.definitionMap[dfnTitle]) {
          conf.definitionMap[dfnTitle] = [];
        }
        return conf.definitionMap[dfnTitle];
      })
      .reduce(($dfn, dfnTitleContainer) => {
        dfnTitleContainer.push($dfn);
        return $dfn;
      }, $dfn);
  });
}
