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

  let shouldPluralize;
  if (conf.pluralize === true) {
    // prevent pluralize booting overhead if not needed
    shouldPluralize = autoPluralizeDfns();
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
    const dfnTitles = $dfn.getDfnTitles({ isDefinition: true });

    // add automatic pluralization to `data-lt` attributes
    // see https://github.com/w3c/respec/pull/1682
    const normText = norm(dfn.textContent);
    if (
      conf.pluralize === true &&
      !dfn.hasAttribute("data-lt-noPlural") &&
      shouldPluralize(normText)
    ) {
      const plural = pluralize(normText);
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
  const links = new Set();
  document
    .querySelectorAll("a:not([href])")
    .forEach(({ textContent, dataset }) => {
      links.add(norm(textContent));
      if (dataset.lt) {
        links.add(dataset.lt);
      }
    });

  const dfnText = new Set();
  document.querySelectorAll("dfn").forEach(({ textContent, dataset }) => {
    dfnText.add(norm(textContent));
    if (dataset.lt) {
      dataset.lt.split("|").forEach(lt => dfnText.add(lt));
    }
  });

  return function shouldPluralize(text) {
    const plural = pluralize(text);
    return links.has(plural) && !dfnText.has(plural);
  };
}
