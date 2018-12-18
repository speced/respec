// Module core/structure
//  Handles producing the ToC and numbering sections across the document.

// LIMITATION:
//  At this point we don't support having more than 26 appendices.
// CONFIGURATION:
//  - noTOC: if set to true, no TOC is generated and sections are not numbered
//  - tocIntroductory: if set to true, the introductory material is listed in the TOC
//  - lang: can change the generated text (supported: en, fr)
//  - maxTocLevel: only generate a TOC so many levels deep

import { addId, children, parents, renameElement } from "./utils";
import hyperHTML from "../deps/hyperhtml";

const lowerHeaderTags = ["h2", "h3", "h4", "h5", "h6"];
const headerTags = ["h1", ...lowerHeaderTags];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const name = "core/structure";

/**
 * @typedef {{ secno: string, title: string }} SectionInfo
 *
 * Scans sections and generate ordered list element + ID-to-anchor-content dictionary.
 * @param {HTMLElement} parent the target element to find child sections
 * @param {*} conf
 * @return {{ ol: HTMLElement, secMap: Record<string, SectionInfo> }}
 */
function scanSections(parent, conf, { prefix = "" } = {}) {
  const secMap = {};
  let appendixMode = false;
  let lastNonAppendix = 0;
  let index = 0;
  if (prefix.length && !prefix.endsWith(".")) {
    prefix += ".";
  }
  const sections = children(
    parent,
    conf.tocIntroductory ? "section" : "section:not(.introductory)"
  );
  if (sections.length === 0) {
    return null;
  }
  const ol = hyperHTML`<ol class='toc'>`;
  for (const section of sections) {
    const isIntro = section.classList.contains("introductory");
    const noToc = section.classList.contains("notoc");
    if (!section.children.length || noToc) {
      continue;
    }
    const h = section.children[0];
    if (!lowerHeaderTags.includes(h.localName)) {
      continue;
    }
    if (!isIntro) {
      index += 1;
    }
    if (section.classList.contains("appendix") && !prefix && !appendixMode) {
      lastNonAppendix = index;
      appendixMode = true;
    }
    let secno = appendixMode
      ? alphabet.charAt(index - lastNonAppendix)
      : prefix + index;
    const level = Math.ceil(secno.length / 2);
    if (level === 1) {
      secno = secno + ".";
      // if this is a top level item, insert
      // an OddPage comment so html2ps will correctly
      // paginate the output
      h.before(document.createComment("OddPage"));
    }

    const title = h.textContent;
    const id = addId(section, null, title);
    secMap[id] = { secno: isIntro ? "" : secno, title };

    const sub = scanSections(section, conf, { prefix: secno, appendixMode });
    if (sub) {
      Object.assign(secMap, sub.secMap);
    }

    if (level <= conf.maxTocLevel) {
      const anchor = hyperHTML`<a href="${`#${id}`}" class="tocxref" />`;
      if (!isIntro) {
        const span = hyperHTML`<span class='secno'>${secno} </span>`;
        h.prepend(span);
      }
      anchor.append(...h.cloneNode(true).childNodes);
      filterHeader(anchor);
      const item = hyperHTML`<li class='tocline'>${anchor}</li>`;
      if (sub) {
        item.append(sub.ol);
      }
      ol.append(item);
    }
  }
  return { ol, secMap };
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
    const { ol, secMap } = scanSections(document.body, conf);
    createTableOfContents(ol, conf);
    updateEmptyAnchors(secMap);
  }
}

function renameSectionHeaders() {
  const headers = getNonintroductorySectionHeaders();
  if (!headers.length) {
    return;
  }
  headers.forEach(header => {
    const depth = Math.min(parents(header, "section").length + 1, 6);
    const h = "h" + depth;
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
 * @param {*} conf
 */
function createTableOfContents(ol, conf) {
  if (!ol) {
    return;
  }
  const nav = hyperHTML`<nav id="toc">`;
  const h2 = hyperHTML`<h2 class="introductory">${conf.l10n.toc}</h2>`;
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

/**
 * Update all anchors with empty content that reference a section ID
 * @param {Record<string, SectionInfo>} secMap
 */
function updateEmptyAnchors(secMap) {
  document.querySelectorAll("a[href^='#']:not(.tocxref)").forEach(anchor => {
    if (anchor.innerHTML !== "") {
      return;
    }
    const id = anchor.getAttribute("href").slice(1);
    if (secMap[id]) {
      const { secno, title } = secMap[id];
      anchor.classList.add("sec-ref");
      if (anchor.classList.contains("sectionRef")) {
        anchor.append("section ");
      }
      if (secno) {
        anchor.append(hyperHTML`<span class='secno'>${secno}</span>`, " ");
      }
      anchor.append(hyperHTML`<span class='sec-title'>${title}</span>`);
    }
  });
}
