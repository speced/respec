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

const secMap = {};
let appendixMode = false;
let lastNonAppendix = 0;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const name = "core/structure";

/**
 *
 * @param {HTMLElement} parent the target element to find child sections
 * @param {number[]} current
 * @param {number} level
 * @param {*} conf
 * @return {HTMLElement}
 */
function makeTOCAtLevel(parent, current, level, conf) {
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
    const title = h.textContent;
    const kidsHolder = hyperHTML`<div>${h.cloneNode(true).childNodes}</div>`;
    filterHeader(kidsHolder);
    const id = addId(section, null, title);

    if (!isIntro) {
      current[current.length - 1]++;
    }
    const secnos = current.slice();
    if (
      section.classList.contains("appendix") &&
      current.length === 1 &&
      !appendixMode
    ) {
      lastNonAppendix = current[0];
      appendixMode = true;
    }
    if (appendixMode) {
      secnos[0] = alphabet.charAt(current[0] - lastNonAppendix);
    }
    let secno = secnos.join(".");
    const isTopLevel = secnos.length == 1;
    if (isTopLevel) {
      secno = secno + ".";
      // if this is a top level item, insert
      // an OddPage comment so html2ps will correctly
      // paginate the output
      h.before(document.createComment("OddPage"));
    }
    const span = hyperHTML`<span class='secno'>${secno} </span>`;
    if (!isIntro) {
      h.prepend(span);
    }
    secMap[id] =
      (isIntro ? "" : "<span class='secno'>" + secno + "</span> ") +
      "<span class='sec-title'>" +
      title +
      "</span>";

    const anchor = hyperHTML`<a href="${`#${id}`}" class="tocxref" />`;
    anchor.append(
      isIntro ? "" : span.cloneNode(true),
      ...kidsHolder.childNodes
    );
    const item = hyperHTML`<li class='tocline'>${anchor}</li>`;
    if (level <= conf.maxTocLevel) {
      ol.append(item);
    }
    current.push(0);
    const sub = makeTOCAtLevel(section, current, level + 1, conf);
    if (sub) {
      item.append(sub);
    }
    current.pop();
  }
  return ol;
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
    createTableOfContents(conf);
  }

  updateEmptyAnchors();
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

function createTableOfContents(conf) {
  const ol = makeTOCAtLevel(document.body, [0], 1, conf);
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
 */
function updateEmptyAnchors() {
  document.querySelectorAll("a[href^='#']:not(.tocxref)").forEach(anchor => {
    if (anchor.innerHTML !== "") {
      return;
    }
    const id = anchor.getAttribute("href").slice(1);
    if (secMap[id]) {
      anchor.classList.add("sec-ref");
      const prefix = anchor.classList.contains("sectionRef") ? "section " : "";
      anchor.innerHTML = prefix + secMap[id];
    }
  });
}
