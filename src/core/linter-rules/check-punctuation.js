// @ts-check
/**
 * Linter rule "check-punctuation". Makes sure the there are no punctuations missing at the end of a <p>.
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "check-punctuation";
export const name = "core/linter-rules/check-punctuation";

const punctuationMarks = [".", ":", "!", "?"];
const humanMarks = punctuationMarks.map(mark => `"${mark}"`).join(", ");

const localizationStrings = {
  en: {
    msg: "`p` elements should end with a punctuation mark.",
    hint: `Please make sure \`p\` elements end with one of: ${humanMarks}.`,
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  // Check string ends with one of ., !, ?, :, ], or is empty.
  const punctuatingRegExp = new RegExp(
    `[${punctuationMarks.join("")}\\]]$|^ *$`,
    "m"
  );

  /** @type {NodeListOf<HTMLParagraphElement>} */
  const elems = document.querySelectorAll("p:not(#back-to-top,#w3c-state)");
  const offendingElements = [...elems].filter(
    elem => !punctuatingRegExp.test(elem.textContent.trim())
  );

  if (!offendingElements.length) {
    return;
  }
  showWarning(l10n.msg, name, { hint: l10n.hint, elements: offendingElements });
}
