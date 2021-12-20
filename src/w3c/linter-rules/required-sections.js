// @ts-check
/**
 * Checks that there is a section that has at least privacy and/or
 * security and considerations.
 *
 * The rule is "privacy" or "security", and "considerations", in any order,
 * case-insensitive, multi-line check.
 *
 */

import { getIntlData, norm, showError } from "../../core/utils.js";

const ruleName = "required-sections";
export const name = "w3c/linter-rules/required-sections";

const localizationStrings = {
  en: {
    msg(sectionTitle) {
      return `W3C Recommendation track documents require a separate "${sectionTitle}" section.`;
    },
    hint(sectionTitle) {
      return (
        `Add a \`<section>\` with a "${sectionTitle}" header. ` +
        "See the [Horizontal review guidelines](https://w3c.github.io/documentreview/#how_to_get_horizontal_review)."
      );
    },
  },
};
const l10n = getIntlData(localizationStrings);

function hasSection(headers, expectedText) {
  const regex = new RegExp(expectedText, "im");
  const found = headers.some(({ textContent }) => {
    const text = norm(textContent);
    return regex.test(text);
  });
  return found;
}

const requiredSections = ["Privacy Considerations", "Security Considerations"];

export function run(conf) {
  if (!conf.lint?.[ruleName] || !conf.isRecTrack) {
    return;
  }
  // usually at end of the document
  const headers = [
    ...document.querySelectorAll("h2, h3, h4, h5, h6"),
  ].reverse();
  for (const section of requiredSections) {
    if (!hasSection(headers, section)) {
      const msg = l10n.msg(section);
      const hint = l10n.hint(section);
      showError(msg, name, { hint });
    }
  }
}
