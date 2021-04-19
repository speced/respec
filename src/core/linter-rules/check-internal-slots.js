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
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  /** @type {NodeListOf<HTMLAnchorElement>} */
  const elems = document.querySelectorAll("var+a");
  const offendingElements = [...elems].filter(
    ({ previousSibling: { nodeName } }) => {
      const isPrevVar = nodeName && nodeName === "VAR";
      return isPrevVar;
    }
  );

  if (!offendingElements.length) {
    return;
  }

  showWarning(l10n.msg, name, { hint: l10n.hint, elements: offendingElements });
}
