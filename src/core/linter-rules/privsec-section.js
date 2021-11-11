// @ts-check
/**
 * Checks that there is a section that has at least privacy and/or
 * security and considerations.
 *
 * The rule is "privacy" or "security", and "considerations", in any order,
 * case-insensitive, multi-line check.
 *
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "privsec-section";
export const name = "core/linter-rules/privsec-section";

const localizationStrings = {
  en: {
    msg: "Document must have a 'Privacy and/or Security' Considerations section.",
    hint:
      "Add a privacy and/or security considerations section. " +
      "See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).",
  },
};
const l10n = getIntlData(localizationStrings);

function hasPriSecConsiderations(doc) {
  return Array.from(doc.querySelectorAll("h2, h3, h4, h5, h6")).some(
    ({ textContent: text }) => {
      const saysPrivOrSec = /(privacy|security)/im.test(text);
      const saysConsiderations = /(considerations)/im.test(text);
      return (saysPrivOrSec && saysConsiderations) || saysPrivOrSec;
    }
  );
}

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  if (conf.isRecTrack && !hasPriSecConsiderations(document)) {
    showWarning(l10n.msg, name, { hint: l10n.hint });
  }
}
