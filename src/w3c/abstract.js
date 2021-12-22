// @ts-check
// Module w3c/abstract
// Handle the abstract section properly.
import { getIntlData, norm, showError } from "../core/utils.js";
import { html } from "../core/import-maps.js";
export const name = "w3c/abstract";

const localizationStrings = {
  en: {
    abstract: "Abstract",
  },
  ko: {
    abstract: "요약",
  },
  zh: {
    abstract: "摘要",
  },
  ja: {
    abstract: "要約",
  },
  nl: {
    abstract: "Samenvatting",
  },
  es: {
    abstract: "Resumen",
  },
  de: {
    abstract: "Zusammenfassung",
  },
};
const l10n = getIntlData(localizationStrings);

export async function run() {
  const abstract = findAbstract();
  if (!abstract) {
    const msg = 'Document must have one `<section id="abstract">`.';
    showError(msg, name);
    return;
  }
  abstract.classList.add("introductory");
  abstract.id = "abstract";
  if (!abstract.querySelector("h2")) {
    abstract.prepend(html`<h2>${l10n.abstract}</h2>`);
  }
}

function findAbstract() {
  const abstract = document.querySelector("section#abstract");
  if (abstract) {
    return abstract;
  }
  // Let's try find it by checking the headings.
  // This can happen if the document was generated
  // using markdown.
  const searchString = l10n.abstract.toLowerCase();
  for (const header of document.querySelectorAll("h2, h3, h4, h5, h6")) {
    const contents = norm(header.textContent).toLowerCase();
    if (contents === searchString) {
      return header.closest("section");
    }
  }
  return null;
}
