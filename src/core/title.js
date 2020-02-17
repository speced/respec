import { getIntlData, norm, showInlineError } from "./utils.js";
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
  updateSpecTitleElem(conf);
}


function updateSpecTitleElem(conf) {
  /** @type {HTMLElement} */
  const specTitleElem =
    document.querySelector("h1#title") || document.createElement("h1");

  if (specTitleElem.isConnected && specTitleElem.textContent.trim() === "") {
    const msg =
      'The document is missing a title, so using a default title. To fix this, please give your document a `<title>`. If you need special markup in the document\'s title, please use a `<h1 id="title">`.';
    const msgTitle = "Document is missing a title";
    showInlineError(specTitleElem, msg, msgTitle);
  }

  setDocumentTitle(conf, specTitleElem);
  document.body.prepend(specTitleElem);
  specTitleElem.id = "title";
  specTitleElem.classList.add("title");
}

function setDocumentTitle(conf, specTitleElem) {
  // if the original html has a h1#title element with whitespace or "" content, we keep that content
  // the new h1 element created will not an id yet and its textContent is "" by default
  // for the new h1 element, we want to use document.title or the default title
  if (specTitleElem.id != "title" && specTitleElem.textContent.trim() === "") {
    specTitleElem.textContent = document.title || `${l10n.default_title}`;
  }

  let documentTitle = norm(specTitleElem.textContent);

  if (conf.isPreview && conf.prNumber) {
    const prUrl = conf.prUrl || `${conf.github.repoURL}pull/${conf.prNumber}`;
    const { childNodes } = hyperHTML`
      Preview of PR <a href="${prUrl}">#${conf.prNumber}</a>:
    `;
    specTitleElem.prepend(...childNodes);
    documentTitle = `Preview of PR #${conf.prNumber}: ${documentTitle}`;
  }

  document.title = documentTitle;
}
