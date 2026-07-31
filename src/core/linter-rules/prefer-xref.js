// @ts-check
import { docLink, getIntlData, showError, showWarning } from "../utils.js";
import { profiles } from "../xref.js";

const ruleName = "prefer-xref";
export const name = "core/linter-rules/prefer-xref";

/** @satisfies {Record<string, { msg(specKey: string): string; readonly hint: string }>} */
const localizationStrings = {
  en: {
    msg(specKey) {
      return `Spec \`${specKey}\` is available in xref. Consider using shorthand syntax (e.g. \`[= term =]\`) instead of \`data-cite="${specKey}#…"\`.`;
    },
    get hint() {
      return docLink`Using ${"[xref]"} shorthand syntax is shorter, spec-version-agnostic, and lets ReSpec verify the term exists. To silence this warning for a specific element, add \`class="lint-ignore"\`. To disable this rule entirely, set \`lint: { "${ruleName}": false }\` in your \`respecConfig\`.`;
    },
  },
  cs: {
    msg(specKey) {
      return `Specifikace \`${specKey}\` je dostupná v xref. Zvažte použití zkráceného zápisu (např. \`[= pojem =]\`) místo \`data-cite="${specKey}#…"\`.`;
    },
    get hint() {
      return docLink`Zkrácený zápis ${"[xref]"} je kratší, nezávislý na verzi specifikace a umožňuje ReSpecu ověřit existenci pojmu. Pro potlačení tohoto varování u konkrétního prvku přidejte \`class="lint-ignore"\`. Pro úplné vypnutí pravidla nastavte \`lint: { "${ruleName}": false }\` ve vašem \`respecConfig\`.`;
    },
  },
};
const l10n = getIntlData(localizationStrings);

/**
 * @param {Conf["xref"]} xref
 * @returns {Set<string> | null}
 */
function getXrefSpecSet(xref) {
  if (!xref || xref === true) return null;

  /** @type {Set<string>} */
  const specs = new Set();

  if (typeof xref === "string") {
    const profile = xref.toLowerCase();
    if (profile in profiles) {
      /** @type {Record<string, string[]>} */ (profiles)[profile].forEach(
        (/** @type {string} */ s) => specs.add(s.toUpperCase())
      );
    }
    return specs.size ? specs : null;
  }

  if (Array.isArray(xref)) {
    xref.forEach(s => specs.add(s.toUpperCase()));
    return specs.size ? specs : null;
  }

  if (typeof xref === "object") {
    const { profile, specs: specList } =
      /** @type {{ profile?: string; specs?: string[] }} */ (xref);
    if (profile) {
      const key = profile.toLowerCase();
      if (key in profiles) {
        /** @type {Record<string, string[]>} */ (profiles)[key].forEach(
          (/** @type {string} */ s) => specs.add(s.toUpperCase())
        );
      }
    }
    if (specList) {
      specList.forEach(s => specs.add(s.toUpperCase()));
    }
    return specs.size ? specs : null;
  }

  return null;
}

/**
 * @param {string} rawCite
 * @returns {string}
 */
function extractSpecKey(rawCite) {
  return rawCite.replace(/^[?!]/, "").split(/[/#]/)[0].toUpperCase();
}

/**
 * @param {Conf} conf
 */
export function run(conf) {
  // @ts-expect-error -- LintConfig can be false; ?. only short-circuits null/undefined in TS
  if (!conf.lint?.[ruleName]) {
    return;
  }

  if (!conf.xref) {
    return;
  }

  const xrefSpecSet = getXrefSpecSet(conf.xref);
  if (!xrefSpecSet) {
    return;
  }

  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll(
    ":is(a, dfn)[data-cite*='#']:not([data-cite^='#']):not(.lint-ignore)"
  );

  /** @type {Map<string, HTMLElement[]>} */
  const offenders = new Map();

  elems.forEach(elem => {
    const rawCite = /** @type {string} */ (elem.dataset.cite);
    const specKey = extractSpecKey(rawCite);
    if (!specKey || !xrefSpecSet.has(specKey)) return;

    if (!offenders.has(specKey)) {
      offenders.set(specKey, []);
    }
    /** @type {HTMLElement[]} */ (offenders.get(specKey)).push(elem);
  });

  // @ts-expect-error -- ruleName is a string literal but LintConfig index signature doesn't cover it
  const logger = conf.lint?.[ruleName] === "error" ? showError : showWarning;
  offenders.forEach((elements, specKey) => {
    logger(l10n.msg(specKey), name, {
      hint: l10n.hint,
      elements,
    });
  });
}
