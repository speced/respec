// @ts-check
// Module core/structure
//  Handles producing the ToC and numbering sections across the document.

// CONFIGURATION:
//  - noTOC: if set to true, no TOC is generated and sections are not numbered
//  - lang: can change the generated text (supported: en, fr)
//  - maxTocLevel: only generate a TOC so many levels deep

import {
  addId,
  getIntlData,
  parents,
  renameElement,
  showError,
} from "./utils.js";
import { html } from "./import-maps.js";
import { pub } from "./pubsubhub.js";

const lowerHeaderTags = ["h2", "h3", "h4", "h5", "h6"];

export const name = "core/structure";

const localizationStrings = {
  en: {
    toc: "Table of Contents",
  },
  zh: {
    toc: "内容大纲",
  },
  ko: {
    toc: "목차",
  },
  ja: {
    toc: "目次",
  },
  nl: {
    toc: "Inhoudsopgave",
  },
  es: {
    toc: "Tabla de Contenidos",
  },
  de: {
    toc: "Inhaltsverzeichnis",
  },
};

const l10n = getIntlData(localizationStrings);

/**
 * @typedef {object} SectionInfo
 * @property {string} secno
 * @property {string} title
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
  const ol = html`<ol class="toc"></ol>`;
  for (const section of sections) {
    if (section.isAppendix && !prefix && !appendixMode) {
      lastNonAppendix = index;
      appendixMode = true;
    }
    let secno = section.isIntro
      ? ""
      : appendixMode
      ? appendixNumber(index - lastNonAppendix + 1)
      : prefix + index;
    const level = secno.split(".").length;
    if (level === 1) {
      secno += ".";
      // if this is a top level item, insert
      // an OddPage comment so html2ps will correctly
      // paginate the output
      section.header.before(document.createComment("OddPage"));
    }

    if (!section.isIntro) {
      index += 1;
      section.header.prepend(html`<bdi class="secno">${secno} </bdi>`);
    }

    if (level <= maxTocLevel) {
      const id = section.header.id || section.element.id;
      const item = createTocListItem(section.header, id);
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
 * Convert a number to spreadsheet like column name.
 * For example, 1=A, 26=Z, 27=AA, 28=AB and so on..
 * @param {number} num
 */
function appendixNumber(num) {
  let s = "";
  while (num > 0) {
    num -= 1;
    s = String.fromCharCode(65 + (num % 26)) + s;
    num = Math.floor(num / 26);
  }
  return s;
}

/**
 * @typedef {object} Section
 * @property {Element} element
 * @property {Element} header
 * @property {string} title
 * @property {boolean} isIntro
 * @property {boolean} isAppendix
 * @property {Section[]} subsections
 *
 * @param {Element} parent
 */
function getSectionTree(parent) {
  /** @type {NodeListOf<HTMLElement>} */
  const sectionElements = parent.querySelectorAll(":scope > section");
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
      isIntro: Boolean(section.closest(".introductory")),
      isAppendix: section.classList.contains("appendix"),
      subsections: getSectionTree(section),
    });
  }
  return sections;
}

/**
 * @param {Element} header
 * @param {string} id
 */
function createTocListItem(header, id) {
  const anchor = html`<a href="${`#${id}`}" class="tocxref" />`;
  anchor.append(...header.cloneNode(true).childNodes);
  filterHeader(anchor);
  return html`<li class="tocline">${anchor}</li>`;
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
  if ("maxTocLevel" in conf === false) {
    conf.maxTocLevel = Infinity;
  }

  renameSectionHeaders();

  // makeTOC
  if (!conf.noTOC) {
    skipFromToC();
    const sectionTree = getSectionTree(document.body);
    const result = scanSections(sectionTree, conf.maxTocLevel);
    if (result) {
      createTableOfContents(result);
    }
  }

  // See core/dfn-index
  pub("toc");
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
  return [
    ...document.querySelectorAll(
      "section:not(.introductory) :is(h1,h2,h3,h4,h5,h6):first-child"
    ),
  ].filter(elem => !elem.closest("section.introductory"));
}

/**
 * Skip descendent sections from appearing in ToC using data-max-toc.
 */
function skipFromToC() {
  /** @type {NodeListOf<HTMLElement>} */
  const sections = document.querySelectorAll("section[data-max-toc]");
  for (const section of sections) {
    const maxToc = parseInt(section.dataset.maxToc, 10);
    if (maxToc < 0 || maxToc > 6 || Number.isNaN(maxToc)) {
      const msg = "`data-max-toc` must have a value between 0-6 (inclusive).";
      showError(msg, name, { elements: [section] });
      continue;
    }

    // `data-max-toc=0` is equivalent to adding a ".notoc" to current section.
    if (maxToc === 0) {
      section.classList.add("notoc");
      continue;
    }

    // When `data-max-toc=2`, we skip all ":scope > section > section" from ToC
    // i.e., at §1, we will keep §1.1 but not §1.1.1
    // Similarly, `data-max-toc=1` will keep §1, but not §1.1
    const sectionToSkipFromToC = section.querySelectorAll(
      `:scope > ${Array.from({ length: maxToc }, () => "section").join(" > ")}`
    );
    for (const el of sectionToSkipFromToC) {
      el.classList.add("notoc");
    }
  }
}

/**
 * @param {HTMLElement} ol
 */
function createTableOfContents(ol) {
  if (!ol) {
    return;
  }
  const nav = html`<nav id="toc"></nav>`;
  const h2 = html`<h2 class="introductory">${l10n.toc}</h2>`;
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

  const link = html`<p role="navigation" id="back-to-top">
    <a href="#title"><abbr title="Back to Top">&uarr;</abbr></a>
  </p>`;
  document.body.append(link);
}
