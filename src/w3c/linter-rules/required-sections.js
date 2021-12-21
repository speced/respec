// @ts-check
/**
 * Checks that there is a section that has at least privacy and/or
 * security and considerations.
 *
 * The rule is "privacy" or "security", and "considerations", in any order,
 * case-insensitive, multi-line check.
 *
 */

import {
  InsensitiveStringSet,
  getIntlData,
  norm,
  showError,
} from "../../core/utils.js";
import { recTrackStatus } from "../headers.js";

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
        "See the [Horizontal review guidelines](https://www.w3.org/Guide/documentreview/#how_to_get_horizontal_review)."
      );
    },
  },
};

const l10n = getIntlData(localizationStrings);

const requiredSections = new InsensitiveStringSet([
  "Privacy Considerations",
  "Security Considerations",
]);

export const requiresPrivSecStatus = new Set([...recTrackStatus, "ED"]);
requiresPrivSecStatus.delete("DISC"); // "Discontinued Draft"

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  if (!requiresPrivSecStatus.has(conf.specStatus)) {
    return;
  }

  /** @type {NodeListOf<HTMLElement>} */
  const headers = document.querySelectorAll("h2, h3, h4, h5, h6");
  const foundMap = new Map([...requiredSections].map(entry => [entry, false]));
  for (const header of headers) {
    const clone = header.cloneNode(true);
    // section number
    clone.querySelector("bdi")?.remove();
    // self linking anchor
    clone.querySelector("self-link")?.remove();
    const text = norm(clone.textContent);
    if (requiredSections.has(text)) {
      foundMap.set(requiredSections.getCanonicalKey(text), true);
    }
  }
  // Did we find them all?
  if ([...foundMap.values()].every(Boolean)) {
    return;
  }

  // Show the ones we didn't find
  const missingSections = [...foundMap.entries()]
    .filter(([, found]) => !found)
    .map(([section]) => section);

  // Show them as errors individually
  for (const title of missingSections) {
    showError(l10n.msg(title), name, {
      hint: l10n.hint(title),
    });
  }
}
