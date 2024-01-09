/**
 * Module w3c/abstract
 *
 * This module handles the abstract section properly by adding necessary elements and
 * performing validations.
 *
 * @module w3c/abstract
 */

import { getIntlData, norm, renameElement, showError } from "../core/utils.js";
import { lang as docLang } from "../core/l10n.js";
import { html } from "../core/import-maps.js";

export const name = "w3c/abstract";

/** @type {LocalizationStrings} */
const localizationStrings = {
  en: { abstract: "Abstract" },
  ko: { abstract: "요약" },
  zh: { abstract: "摘要" },
  ja: { abstract: "要約" },
  nl: { abstract: "Samenvatting" },
  es: { abstract: "Resumen" },
  de: { abstract: "Zusammenfassung" },
};
const l10n = getIntlData(localizationStrings);

/**
 * Handles the abstract section of the document.
 */
export async function run() {
  const abstract = findAbstract();
  if (!abstract) {
    showError('Document must have one `<section id="abstract">`.', name);
    return;
  }

  abstract.classList.add("introductory");
  abstract.id = "abstract";
  if (!abstract.querySelector("h2")) {
    abstract.prepend(html`<h2>${l10n.abstract}</h2>`);
  }
}

/**
 * Finds the abstract section in the document.
 *
 * @returns {HTMLElement | null} The abstract section element.
 */
function findAbstract() {
  const abstract = document.getElementById("abstract");
  if (abstract) {
    switch (abstract.localName) {
      case "section":
        return abstract;
      case "div":
        return renameElement(abstract, "section");
      default:
        showError("The abstract should be a `<section>` element.", name, {
          elements: [abstract],
        });
        return abstract;
    }
  }

  const searchString = l10n.abstract.toLocaleLowerCase(docLang);
  for (const header of document.querySelectorAll("h2, h3, h4, h5, h6")) {
    if (norm(header.textContent).toLocaleLowerCase(docLang) === searchString) {
      return header.closest("section");
    }
  }

  return abstract;
}
