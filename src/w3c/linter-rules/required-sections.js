// @ts-check
/**
 * The W3C Process requires separate Privacy Considerations and Security
 * Considerations sections. This linter checks for the presence of these
 * sections, and reports an error if they are not present.
 */

import {
  InsensitiveStringSet,
  docLink,
  getIntlData,
  norm,
  showError,
  showWarning,
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
      return docLink`Add a \`<section>\` with a "${sectionTitle}" header. See the [Horizontal review guidelines](https://www.w3.org/Guide/documentreview/#how_to_get_horizontal_review).
        If the document is not intended for the W3C Recommendation track, set ${"[noRecTrack]"} to \`true\`
        or turn off the ${`[${ruleName}]`} linter rule.`;
    },
  },
};

const l10n = getIntlData(localizationStrings);

const requiredSections = new InsensitiveStringSet([
  "Privacy Considerations",
  "Security Considerations",
]);

export const requiresSomeSectionStatus = new Set([...recTrackStatus, "ED"]);
requiresSomeSectionStatus.delete("DISC"); // "Discontinued Draft"

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  if (conf.noRecTrack || !requiresSomeSectionStatus.has(conf.specStatus)) {
    return;
  }

  const logger = conf.lint[ruleName] === "error" ? showError : showWarning;

  /** @type {NodeListOf<HTMLElement>} */
  const headers = document.querySelectorAll("h2, h3, h4, h5, h6");
  for (const header of headers) {
    const clone = header.cloneNode(true);
    // section number and self-link anchor
    clone.querySelectorAll("bdi, .self-link")?.forEach(elem => elem.remove());
    const text = norm(clone.textContent);
    if (requiredSections.has(text)) {
      requiredSections.delete(text);
      // Check if we find them all...
      if (requiredSections.size === 0) {
        return; // All present, early return!
      }
    }
  }

  // Show the ones we didn't find individually
  for (const title of requiredSections) {
    logger(l10n.msg(title), name, {
      hint: l10n.hint(title),
    });
  }
}
