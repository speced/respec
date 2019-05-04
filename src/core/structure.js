// @ts-check
// Module core/structure
//  Handles producing the ToC and numbering sections across the document.

// LIMITATION:
//  At this point we don't support having more than 26 appendices.
// CONFIGURATION:
//  - noTOC: if set to true, no TOC is generated and sections are not numbered
//  - tocIntroductory: if set to true, the introductory material is listed in the TOC
//  - lang: can change the generated text (supported: en, fr)
//  - maxTocLevel: only generate a TOC so many levels deep

import { addId, children, parents, renameElement } from "./utils.js";
import { lang as defaultLang } from "../core/l10n.js";
import hyperHTML from "hyperhtml";

const lowerHeaderTags = ["h2", "h3", "h4", "h5", "h6"];
const headerTags = ["h1", ...lowerHeaderTags];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const name = "core/structure";

const localizationStrings = {
  en: {
    toc: "Table of Contents",
  },
  nl: {
    toc: "Inhoudsopgave",
  },
  es: {
    toc: "Tabla de Contenidos",
  },
};

const lang = defaultLang in localizationStrings ? defaultLang : "en";

const l10n = localizationStrings[lang];

/**
 * @typedef {{ secno: string, title: string }} SectionInfo
 *
 * Scans sections and generate ordered list element + ID-to-anchor-content dictionary.
 * @param {Section[]} sections the target element to find child sections
 * @param {number} maxTocLevel
 */
function scanSections(sections, maxTocLevel, { prefix = "" } = {}) {
  let appendixMode = false;
  let lastNonAppendix = 0;
  let index = 1;
  if (prefix.length && !prefix.endsWith(".")) {
    prefix += ".";
  }
  if (sections.length === 0) {
    return null;
  }
  /** @type {HTMLElement} */
  const ol = hyperHTML`<ol class='toc'>`;
  for (const section of sections) {
    if (section.isAppendix && !prefix && !appendixMode) {
      lastNonAppendix = index;
      appendixMode = true;
    }
    let secno = section.isIntro
      ? ""
      : appendixMode
      ? alphabet.charAt(index - lastNonAppendix)
      : prefix + index;
    const level = Math.ceil(secno.length / 2);
    if (level === 1) {
      secno += ".";
      // if this is a top level item, insert
      // an OddPage comment so html2ps will correctly
      // paginate the output
      section.header.before(document.createComment("OddPage"));
    }

    if (!section.isIntro) {
      index += 1;
      section.header.prepend(hyperHTML`<bdi class='secno'>${secno} </bdi>`);
    }

    if (level <= maxTocLevel) {
      const item = createTocListItem(section.header, section.element.id);
      const sub = scanSections(section.subsections, maxTocLevel, {
        prefix: secno,
      });
      if (sub) {
        item.append(sub);
      }
      ol.append(item);
    }
  }
  return ol;
}

/**
 * @typedef {{ element: Element, header: Element, title: string, isIntro: boolean, isAppendix: boolean, subsections: Section[] }} Section
 *
 * @param {Element} parent
 */
function getSectionTree(parent, { tocIntroductory = false } = {}) {
  const sectionElements = children(
    parent,
    tocIntroductory ? "section" : "section:not(.introductory)"
  );
  /** @type {Section[]} */
  const sections = [];

  for (const section of sectionElements) {
    const noToc = section.classList.contains("notoc");
    if (!section.children.length || noToc) {
      continue;
    }
    const header = section.children[0];
    if (!lowerHeaderTags.includes(header.localName)) {
      continue;
    }
    const title = header.textContent;
    addId(section, null, title);
    sections.push({
      element: section,
      header,
      title,
      isIntro: section.classList.contains("introductory"),
      isAppendix: section.classList.contains("appendix"),
      subsections: getSectionTree(section, { tocIntroductory }),
    });
  }
  return sections;
}

/**
 * @param {Element} header
 * @param {string} id
 */
function createTocListItem(header, id) {
  const anchor = hyperHTML`<a href="${`#${id}`}" class="tocxref"/>`;
  anchor.append(...header.cloneNode(true).childNodes);
  filterHeader(anchor);
  return hyperHTML`<li class='tocline'>${anchor}</li>`;
}

/**
 * Replaces any child <a> and <dfn> with <span>.
 * @param {HTMLElement} h
 */
function filterHeader(h) {
  h.querySelectorAll("a").forEach(anchor => {
    const span = renameElement(anchor, "span");
    span.className = "formerLink";
    span.removeAttribute("href");
  });
  h.querySelectorAll("dfn").forEach(dfn => {
    const span = renameElement(dfn, "span");
    span.removeAttribute("id");
  });
}

export function run(conf) {
  if ("tocIntroductory" in conf === false) {
    conf.tocIntroductory = false;
  }
  if ("maxTocLevel" in conf === false) {
    conf.maxTocLevel = Infinity;
  }

  renameSectionHeaders();

  // makeTOC
  if (!conf.noTOC) {
    const sectionTree = getSectionTree(document.body, {
      tocIntroductory: conf.tocIntroductory,
    });
    const result = scanSections(sectionTree, conf.maxTocLevel);
    if (result) {
      createTableOfContents(result);
    }
  }
}

function renameSectionHeaders() {
  const headers = getNonintroductorySectionHeaders();
  if (!headers.length) {
    return;
  }
  headers.forEach(header => {
    const depth = Math.min(parents(header, "section").length + 1, 6);
    const h = `h${depth}`;
    if (header.localName !== h) {
      renameElement(header, h);
    }
  });
}

function getNonintroductorySectionHeaders() {
  const headerSelector = headerTags
    .map(h => `section:not(.introductory) ${h}:first-child`)
    .join(",");
  return [...document.querySelectorAll(headerSelector)].filter(
    elem => !elem.closest("section.introductory")
  );
}

/**
 * @param {HTMLElement} ol
 */
function createTableOfContents(ol) {
  if (!ol) {
    return;
  }
  const nav = hyperHTML`<nav id="toc">`;
  const h2 = hyperHTML`<h2 class="introductory">${l10n.toc}</h2>`;
  addId(h2);
  nav.append(h2, ol);
  const ref =
    document.getElementById("toc") ||
    document.getElementById("sotd") ||
    document.getElementById("abstract");
  if (ref) {
    if (ref.id === "toc") {
      ref.replaceWith(nav);
    } else {
      ref.after(nav);
    }
  }

  const link = hyperHTML`<p role='navigation' id='back-to-top'><a href='#title'><abbr title='Back to Top'>&uarr;</abbr></a></p>`;
  document.body.append(link);
}
