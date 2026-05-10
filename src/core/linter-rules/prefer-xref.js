// @ts-check
/**
 * Linter rule "prefer-xref".
 *
 * Warns when an author uses `data-cite="SPEC#fragment"` to link to a term in a
 * specification that is already covered by the configured xref database. In
 * that case the xref shorthand syntax (`[= term =]`, `{{ IDL }}`, etc.) is
 * both shorter and more robust than a hard-coded fragment identifier.
 */
import { docLink, getIntlData, showWarning } from "../utils.js";

const ruleName = "prefer-xref";
export const name = "core/linter-rules/prefer-xref";

/**
 * Named xref profiles and their spec lists.
 * Keep in sync with the `profiles` object in `src/core/xref.js`.
 *
 * @type {Record<string, string[]>}
 */
const PROFILES = {
  "web-platform": ["HTML", "INFRA", "URL", "WEBIDL", "DOM", "FETCH"],
};

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
};
const l10n = getIntlData(localizationStrings);

/**
 * Derive the set of spec shortnames (uppercased) that the author has
 * configured xref to search, based on the raw `conf.xref` value.
 *
 * Returns `null` when xref is enabled but no specific spec list is
 * configured (`conf.xref === true`), meaning we cannot determine coverage
 * without a network call and therefore skip the check.
 *
 * @param {Conf["xref"]} xref
 * @returns {Set<string> | null}
 */
function getXrefSpecSet(xref) {
  if (!xref) return null;

  /** @type {Set<string>} */
  const specs = new Set();

  if (xref === true) {
    // No specific spec list — skip the check to avoid false positives.
    return null;
  }

  if (typeof xref === "string") {
    const profile = xref.toLowerCase();
    if (profile in PROFILES) {
      PROFILES[profile].forEach(s => specs.add(s.toUpperCase()));
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
      if (key in PROFILES) {
        PROFILES[key].forEach(s => specs.add(s.toUpperCase()));
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
 * Extract the spec shortname (the part before `#`, `/`, or any `?`/`!` prefix)
 * from a raw `data-cite` value.
 *
 * Examples:
 *   "HTML#foo"      → "HTML"
 *   "?HTML#foo"     → "HTML"
 *   "HTML/path#foo" → "HTML"
 *
 * @param {string} rawCite
 * @returns {string}
 */
function extractSpecKey(rawCite) {
  return rawCite
    .replace(/^[?!]/, "") // strip leading normative/informative marker
    .split(/[/#]/)[0] // take the part before any "/" or "#"
    .toUpperCase();
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
    // xref is not enabled; data-cite is the only option.
    return;
  }

  const xrefSpecSet = getXrefSpecSet(conf.xref);
  if (!xrefSpecSet) {
    // Either xref===true (no spec list) or an unrecognised config shape.
    // Skip to avoid false positives.
    return;
  }

  // Select elements where the author has written data-cite="SPEC#fragment"
  // (the "#" is in the attribute value itself, not in data-cite-frag).
  // Exclude self-referencing fragments (#only) and already lint-ignored elements.
  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll(
    ":is(a, dfn)[data-cite*='#']:not([data-cite^='#']):not(.lint-ignore)"
  );

  /** @type {Map<string, HTMLElement[]>} key → offending elements */
  const offenders = new Map();

  elems.forEach(elem => {
    const rawCite = elem.dataset.cite ?? "";
    const specKey = extractSpecKey(rawCite);
    if (!specKey || !xrefSpecSet.has(specKey)) return;

    if (!offenders.has(specKey)) {
      offenders.set(specKey, []);
    }
    offenders.get(specKey)?.push(elem);
  });

  offenders.forEach((elements, specKey) => {
    showWarning(l10n.msg(specKey), name, {
      hint: l10n.hint,
      elements,
    });
  });
}
