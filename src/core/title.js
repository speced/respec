/**
 * This module handles the creation of the h1#title of a spec and
 * makes sure the <title> always matches the h1.
 *
 * If no h1#title is included, then the <title> becomes the h1#title.
 *
 * When a h1#title is included, it always takes precedence over the
 * <title> of a spec. An error will be displayed in case of
 * any mismatch.
 *
 */

import {
  getIntlData,
  norm,
  showInlineError,
  showInlineWarning,
  validLevel,
} from "./utils.js";
import { hyperHTML } from "./import-maps.js";
export const name = "core/title";

const localizationStrings = {
  en: {
    default_title: "No Title",
  },
  de: {
    default_title: "Kein Titel",
  },
};

const l10n = getIntlData(localizationStrings);

export function run(conf) {
  /** @type {HTMLElement} */
  const h1Elem =
    document.querySelector("h1#title") || hyperHTML`<h1 id="title">`;

  // check existing element is ok to use
  if (h1Elem.isConnected && h1Elem.textContent.trim() === "") {
    const msg =
      "The document is missing a title, so using a default title. " +
      "To fix this, please give your document a `<title>`. " +
      "If you need special markup in the document's title, " +
      'please use a `<h1 id="title">`.';
    const msgTitle = "Document is missing a title";
    showInlineError(h1Elem, msg, msgTitle);
  }

  // Decorate the spec title
  if (!h1Elem.id) h1Elem.id = "title";
  h1Elem.classList.add("title");

  setDocumentTitle(conf, h1Elem);

  // This will get relocated by a template later.
  document.body.prepend(h1Elem);
}

function setDocumentTitle(conf, h1Elem) {
  // If the h1 is newly created, it won't be connected. In this case
  // we use the <title> or a localized fallback.
  if (!h1Elem.isConnected) {
    h1Elem.textContent = document.title || `${l10n.default_title}`;
  }

  let documentTitle = norm(h1Elem.textContent);

  if (conf.isPreview && conf.prNumber) {
    const prUrl = conf.prUrl || `${conf.github.repoURL}pull/${conf.prNumber}`;
    const { childNodes } = hyperHTML`
      Preview of PR <a href="${prUrl}">#${conf.prNumber}</a>:
    `;
    h1Elem.prepend(...childNodes);
    documentTitle = `Preview of PR #${conf.prNumber}: ${documentTitle}`;
  }

  if (validLevel(conf.level)) {
    h1Elem.innerHTML = `${h1Elem.innerHTML} Level ${Number(conf.level)}`;
    documentTitle = `${documentTitle} Level ${Number(conf.level)}`;
  }

  document.title = documentTitle;

  // conf.title is deperecated - we are keeping this here just to
  // retain backwards compat as we think the ePub generator
  // relies on it.
  conf.title = documentTitle;
}
