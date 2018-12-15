// Adds automatic pluralization to dfns
// If a dfn is referenced as it's plural (and plural of `data-lt` attributes),
//   plurals of it are automatically added to `data-plurals`.
// The linking is done in core/link-to-dfn

import { norm as normalize } from "./utils";
import { plural as pluralOf } from "../deps/pluralize";

export const name = "core/pluralize";

export function run(conf) {
  if (!conf.pluralize) return;

  const pluralizeDfn = getPluralizer();

  document
    .querySelectorAll("dfn:not([data-lt-no-plural]):not([data-lt-noDefault])")
    .forEach(dfn => {
      const terms = [dfn.textContent];
      if (dfn.dataset.lt) terms.push(...dfn.dataset.lt.split("|"));

      const plurals = Array.from(
        terms
          .map(pluralizeDfn)
          .filter(plural => plural)
          .reduce((plurals, plural) => plurals.add(plural), new Set())
      );

      if (plurals.length) {
        const userDefinedPlurals = dfn.dataset.plurals
          ? dfn.dataset.plurals.split("|")
          : [];
        const uniquePlurals = [...new Set([...userDefinedPlurals, ...plurals])];
        dfn.dataset.plurals = uniquePlurals.join("|");
        uniquePlurals.reduce((defMap, plural) => {
          if (!defMap[plural]) defMap[plural] = [];
          defMap[plural].push(dfn);
          return defMap;
        }, conf.definitionMap);
      }
    });
}

function getPluralizer() {
  const links = new Set();
  document.querySelectorAll("a:not([href])").forEach(el => {
    const normText = normalize(el.textContent).toLowerCase();
    links.add(normText);
    if (el.dataset.lt) {
      links.add(el.dataset.lt);
    }
  });

  const dfns = new Set();
  document.querySelectorAll("dfn:not([data-lt-noDefault])").forEach(dfn => {
    const normText = normalize(dfn.textContent).toLowerCase();
    dfns.add(normText);
    if (dfn.dataset.lt) {
      dfn.dataset.lt.split("|").reduce((dfns, lt) => dfns.add(lt), dfns);
    }
  });

  // returns pluralized term if `text` needs pluralization, "" otherwise
  return function pluralizeDfn(text) {
    const normText = normalize(text.toLowerCase());
    const plural = pluralOf(normText);
    return links.has(plural) && !dfns.has(plural) ? plural : "";
  };
}
