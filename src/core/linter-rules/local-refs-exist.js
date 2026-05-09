// @ts-check
/**
 * Linter rule "warn-local-ref".
 * Warns about href's that link to nonexistent id's in a spec
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "local-refs-exist";
export const name = "core/linter-rules/local-refs-exist";

const localizationStrings = {
  en: {
    msg: "Broken local reference found in document.",
    hint: "Please fix the links mentioned.",
  },
  cs: {
    msg: "V dokumentu byla nalezena nefunkční lokální reference.",
    hint: "Opravte prosím uvedené odkazy.",
  },
};
const l10n = getIntlData(localizationStrings);

/**
 * @param {Conf} conf
 */
export function run(conf) {
  // @ts-expect-error -- LintConfig can be false; ?. only short-circuits null/undefined in TS
  if (!conf.lint?.[ruleName]) {
    return;
  }

  /** @type {NodeListOf<HTMLAnchorElement>} */
  const elems = document.querySelectorAll("a[href^='#']");
  const offendingElements = [...elems].filter(isBrokenHyperlink);
  if (offendingElements.length) {
    const links = offendingElements
      .map(el => el.getAttribute("href"))
      .join(", ");
    const hint = `${l10n.hint} Broken links: ${links}`;
    showWarning(l10n.msg, name, {
      hint,
      elements: offendingElements,
    });
  }
}

/**
 * @param {HTMLAnchorElement} elem
 */
function isBrokenHyperlink(elem) {
  const id = elem.getAttribute("href")?.substring(1);
  if (!id) return;
  const doc = elem.ownerDocument;
  return !doc.getElementById(id) && !doc.getElementsByName(id).length;
}
