// @ts-check
// Adds automatic pluralization to dfns
// If a dfn is referenced as it's plural (and plural of `data-lt` attributes),
//   plurals of it are automatically added to `data-plurals`.
// The linking is done in core/link-to-dfn

import { norm as normalize } from "./utils.js";
import { pluralize } from "./import-maps.js";
import { registerDefinition } from "./dfn-map.js";

export const name = "core/pluralize";

export function run(conf) {
  if (!conf.pluralize) return;

  const pluralizeDfn = getPluralizer();

  /** @type {NodeListOf<HTMLElement>} */
  const dfns = document.querySelectorAll(
    "dfn:not([data-lt-no-plural]):not([data-lt-noDefault])"
  );
  dfns.forEach(dfn => {
    const terms = [dfn.textContent];
    if (dfn.dataset.lt) terms.push(...dfn.dataset.lt.split("|"));
    if (dfn.dataset.localLt) {
      terms.push(...dfn.dataset.localLt.split("|"));
    }

    const plurals = new Set(terms.map(pluralizeDfn).filter(plural => plural));

    if (plurals.size) {
      const userDefinedPlurals = dfn.dataset.plurals
        ? dfn.dataset.plurals.split("|")
        : [];
      const uniquePlurals = [...new Set([...userDefinedPlurals, ...plurals])];
      dfn.dataset.plurals = uniquePlurals.join("|");
      registerDefinition(dfn, uniquePlurals);
    }
  });
}

function getPluralizer() {
  /** @type {Set<string>} */
  const links = new Set();
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const reflessAnchors = document.querySelectorAll("a:not([href])");
  reflessAnchors.forEach(el => {
    const normText = normalize(el.textContent).toLowerCase();
    links.add(normText);
    if (el.dataset.lt) {
      links.add(el.dataset.lt);
    }
  });

  /** @type {Set<string>} */
  const dfnTexts = new Set();
  /** @type {NodeListOf<HTMLElement>} */
  const dfns = document.querySelectorAll("dfn:not([data-lt-noDefault])");
  dfns.forEach(dfn => {
    const normText = normalize(dfn.textContent).toLowerCase();
    dfnTexts.add(normText);
    if (dfn.dataset.lt) {
      dfn.dataset.lt.split("|").forEach(lt => dfnTexts.add(lt));
    }
    if (dfn.dataset.localLt) {
      dfn.dataset.localLt.split("|").forEach(lt => dfnTexts.add(lt));
    }
  });

  // returns pluralized/singularized term if `text` needs pluralization/singularization, "" otherwise
  return function pluralizeDfn(/** @type {string} */ text) {
    const normText = normalize(text).toLowerCase();
    const plural = pluralize.isSingular(normText)
      ? pluralize.plural(normText)
      : pluralize.singular(normText);
    return links.has(plural) && !dfnTexts.has(plural) ? plural : "";
  };
}
