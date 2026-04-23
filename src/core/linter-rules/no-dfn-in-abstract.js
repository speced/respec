// @ts-check
/**
 * Linter rule "no-dfn-in-abstract".
 *
 * Warns when a <dfn> appears in <section id="abstract">,
 * <section id="sotd">, or any other unnumbered section.
 *
 * Defining terms in the abstract is semantically questionable —
 * the abstract is a summary, not a definitions section. Exported
 * definitions in unnumbered sections also appear in the terms index
 * without section numbers (see https://github.com/speced/respec/issues/5133).
 *
 * This rule is opt-in: set `lint: { "no-dfn-in-abstract": true }`.
 *
 * Best practice: define terms in a numbered section such as
 * "Terminology" or "Definitions".
 */
import { docLink, getIntlData, norm, showWarning } from "../utils.js";

const ruleName = "no-dfn-in-abstract";
export const name = `core/linter-rules/${ruleName}`;

/** @satisfies {Record<string, { msg(text: string): string; readonly hint: string }>} */
const localizationStrings = {
  en: {
    msg(text) {
      return `Definition \`${text}\` is in an unnumbered section (e.g. abstract or SotD).`;
    },
    get hint() {
      return docLink`Definitions in unnumbered sections (abstract, SotD) are semantically out of place and appear in the terms index without a section number. Move this definition to a numbered section such as "Terminology". See ${"[export|#data-export]"}.`;
    },
  },
};
const l10n = getIntlData(localizationStrings);

/** Selectors for sections that are never numbered */
const UNNUMBERED_SECTION_SELECTOR = [
  "section#abstract",
  "section#sotd",
  "section.introductory",
].join(", ");

/**
 * @param {Conf} conf
 */
export function run(conf) {
  // @ts-expect-error -- LintConfig can be false; ?. only short-circuits null/undefined in TS
  if (!conf.lint?.[ruleName]) return;

  /** @type {NodeListOf<HTMLElement>} */
  const dfns = document.querySelectorAll("dfn");

  const offenders = [...dfns].filter(dfn =>
    dfn.closest(UNNUMBERED_SECTION_SELECTOR)
  );

  offenders.forEach(dfn => {
    const text = norm(dfn.textContent);
    showWarning(l10n.msg(text), name, {
      hint: l10n.hint,
      elements: [dfn],
    });
  });
}
