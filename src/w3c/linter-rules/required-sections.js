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
  getIntlDataForKey,
  norm,
  showError,
  showWarning,
} from "../../core/utils.js";
import { W3CNotes, recTrackStatus } from "../headers.js";

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
    privacy_considerations: "Privacy Considerations",
    security_considerations: "Security Considerations",
  },
  es: {
    msg(sectionTitle) {
      return `Documentos que van a ser "W3C Recommendation" requieren una sección "${sectionTitle}" separada.`;
    },
    hint(sectionTitle) {
      return docLink`Agrega una \`<section>\` con título "${sectionTitle}". Ver los [Horizontal review guidelines](https://www.w3.org/Guide/documentreview/#how_to_get_horizontal_review).
        Si el documento no está destinado a ser un W3C Recommendation, puedes poner ${"[noRecTrack]"} a \`true\`
        o apaga la regla de linter ${`[${ruleName}]`}.`;
    },
    privacy_considerations: "Consideraciones de privacidad",
    security_considerations: "Consideraciones de Seguridad",
  },
};
const l10n = getIntlData(localizationStrings);

export const requiresSomeSectionStatus = new Set([...recTrackStatus]);
requiresSomeSectionStatus.delete("DISC"); // "Discontinued Draft"
// W3C notes do not require privacy or security considerations sections.
W3CNotes.forEach(note => requiresSomeSectionStatus.delete(note));

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  // We can't check for headers unless we also have a translation
  if (!getIntlDataForKey(localizationStrings, "privacy_considerations")) {
    // We can't check for headers unless we also have a translation
    const msg = `Cannot check for required sections as translations are not available.`;
    const hint = `File an issue to add translations or use a supported language.`;
    showWarning(msg, name, { hint });
    return;
  }

  if (conf.noRecTrack || !requiresSomeSectionStatus.has(conf.specStatus)) {
    return;
  }

  const logger = conf.lint[ruleName] === "error" ? showError : showWarning;

  const missingRequiredSections = new InsensitiveStringSet([
    l10n.privacy_considerations,
    l10n.security_considerations,
  ]);

  /** @type {NodeListOf<HTMLElement>} */
  const headers = document.querySelectorAll("h2, h3, h4, h5, h6");
  for (const header of headers) {
    const clone = header.cloneNode(true);
    // section number and self-link anchor
    clone.querySelectorAll("bdi")?.forEach(elem => elem.remove());
    const text = norm(clone.textContent);
    if (missingRequiredSections.has(text)) {
      missingRequiredSections.delete(text);
      // Check if we find them all...
      if (missingRequiredSections.size === 0) {
        return; // All present, early return!
      }
    }
  }

  // Show the ones we didn't find individually
  for (const title of missingRequiredSections) {
    logger(l10n.msg(title), name, {
      hint: l10n.hint(title),
    });
  }
}
