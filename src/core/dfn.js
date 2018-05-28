// Module core/dfn
// - Finds all <dfn> elements and populates conf.definitionMap to identify them.
// - Adds data-lt based automatic pluralization, if enabled
import { plural as pluralize } from "deps/pluralize";
import { norm } from "core/utils";

export const name = "core/dfn";

export function run(conf) {
  if (!conf.hasOwnProperty("definitionMap")) {
    conf.definitionMap = Object.create(null);
  }
  const shouldPluralize = autoPluralizeDfns();
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
    if (conf.pluralize === true && shouldPluralize(dfn)) {
      const plural = pluralize(norm(dfn.textContent));
      dfnTitles.push(plural);
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

function autoPluralizeDfns() {
  const links = [...document.querySelectorAll("a")];
  const dfns = [...document.querySelectorAll("dfn")];

  return function shouldPluralize(dfn) {
    const plural = pluralize(norm(dfn.textContent));
    if (
      // has overridden to not do pluralization
      dfn.hasAttribute("data-lt-noPlural") ||
      // no <a> references the plural term
      !links.find(({ textContent }) => norm(textContent) === plural) ||
      // there is any dfn with plural term in data-lt or textContent
      dfns.find(
        ({ textContent, dataset }) =>
          norm(textContent) === plural ||
          (dataset.lt && dataset.lt.split("|").includes(plural))
      )
    ) {
      return false;
    }
    return true;
  };
}
