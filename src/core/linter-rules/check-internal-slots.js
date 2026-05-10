// @ts-check
/**
 * Linter rule "check-internal-slots".
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "check-internal-slots";
export const name = "core/linter-rules/check-internal-slots";

const localizationStrings = {
  en: {
    msg: "Internal slots should be preceded by a '.'",
    hint: "Add a '.' between the elements mentioned.",
  },
  cs: {
    msg: "Interní sloty by měly být uvedeny s tečkou '.' před názvem",
    hint: "Přidejte tečku '.' mezi uvedené prvky.",
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
  const elems = document.querySelectorAll("var+a");
  const offendingElements = [...elems].filter(elem => {
    const nodeName = elem.previousSibling?.nodeName;
    const isPrevVar = nodeName === "VAR";
    return isPrevVar;
  });

  if (!offendingElements.length) {
    return;
  }

  showWarning(l10n.msg, name, { hint: l10n.hint, elements: offendingElements });
}
