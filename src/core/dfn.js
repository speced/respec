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

  let pluralizeDfn;
  if (conf.pluralize === true) {
    // prevent pluralize booting overhead if not needed
    pluralizeDfn = autoPluralizeDfns();
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
    const normText = norm(dfn.textContent).toLowerCase();
    if (
      pluralizeDfn &&
      !dfn.hasAttribute("data-lt-no-plural") &&
      !dfn.hasAttribute("data-lt-noDefault")
    ) {
      const plural = pluralizeDfn(normText);
      if (plural) {
        dfnTitles.push(plural);
        dfn.dataset.lt = dfnTitles.join("|");
      }
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
  document.querySelectorAll("a:not([href])").forEach(el => {
    const normText = norm(el.textContent).toLowerCase();
    links.add(normText);
    if (el.dataset.lt) {
      links.add(el.dataset.lt);
    }
  });

  const dfns = new Set();
  document.querySelectorAll("dfn:not([data-lt-noDefault])").forEach(dfn => {
    dfns.add(norm(dfn.textContent).toLowerCase());
    if (dfn.dataset.lt) {
      dfn.dataset.lt.split("|").reduce((dfns, lt) => dfns.add(lt), dfns);
    }
  });

  // returns pluralized term if `text` needs pluralization, "" otherwise
  return function pluralizeDfn(text) {
    const plural = pluralize(text);
    return links.has(plural) && !dfns.has(plural) ? plural : "";
  };
}
