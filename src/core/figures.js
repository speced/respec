// Module core/figure
// Handles figures in the document.
// Adds width and height to images, if they are missing.
// Generates a Table of Figures wherever there is a #tof element.

import { addId, renameElement, showInlineWarning, wrapInner } from "./utils";
import hyperHTML from "../deps/hyperhtml";

export const name = "core/figures";

export function run(conf) {
  normalizeImages(document);
  // process all figures
  const figMap = {};
  const tof = [];
  document.querySelectorAll("figure").forEach((fig, i) => {
    const caption = fig.querySelector("figcaption");

    if (caption) {
      decorateFigure(fig, caption, i, conf);
      figMap[fig.id] = caption.childNodes;
    } else {
      showInlineWarning(fig, "Found a `<figure>` without a `<figcaption>`");
    }

    tof.push(getTableOfFiguresListItem(fig.id, caption));
  });

  updateEmptyAnchors(figMap);

  // Create a Table of Figures if a section with id 'tof' exists.
  const $tof = $("#tof");
  if (tof.length && $tof.length) {
    decorateTableOfFigures($tof[0]);
    $tof.append($("<h2>" + conf.l10n.table_of_fig + "</h2>"));
    $tof.append($("<ul class='tof'/>"));
    const $ul = $tof.find("ul");
    while (tof.length) $ul.append(tof.shift());
  }
}

/**
 * @param {HTMLElement} figure
 * @param {HTMLElement} caption
 * @param {number} i
 * @param {*} conf
 */
function decorateFigure(figure, caption, i, conf) {
  const title = caption.textContent;
  addId(figure, "fig", title);
  // set proper caption title
  wrapInner(caption, hyperHTML`<span class='fig-title'>`);
  caption.prepend(
    conf.l10n.fig,
    hyperHTML`<span class='figno'>${i + 1}</span>`,
    " "
  );
}

/**
 * @param {string} figureId
 * @param {HTMLElement} caption
 * @return {HTMLElement}
 */
function getTableOfFiguresListItem(figureId, caption) {
  const tofCaption = caption.cloneNode(true);
  tofCaption.querySelectorAll("a").forEach(anchor => {
    renameElement(anchor, "span").removeAttribute("href");
  });
  return hyperHTML`<li class='tofline'>
    <a class='tocxref' href='${`#${figureId}`}'>${tofCaption}</a>
  </li>`;
}

function normalizeImages(doc) {
  doc
    .querySelectorAll(
      ":not(picture)>img:not([width]):not([height]):not([srcset])"
    )
    .forEach(img => {
      if (img.naturalHeight === 0 || img.naturalWidth === 0) return;
      img.height = img.naturalHeight;
      img.width = img.naturalWidth;
    });
}

/**
 * Update all anchors with empty content that reference a figure ID
 * @param {Record<string, NodeList>} figMap
 */
function updateEmptyAnchors(figMap) {
  document.querySelectorAll("a[href]").forEach(anchor => {
    const href = anchor.getAttribute("href");
    if (!href) {
      return;
    }
    const nodes = figMap[href.slice(1)];
    if (!nodes) {
      return;
    }
    anchor.classList.add("fig-ref");
    if (anchor.innerHTML !== "") {
      return;
    }
    const shortFigDescriptor = nodeListToFragment(nodes, 0, 2);
    anchor.append(shortFigDescriptor);
    if (!anchor.hasAttribute("title")) {
      const longFigDescriptor = nodeListToFragment(nodes, 2).textContent;
      anchor.title = longFigDescriptor.trim();
    }
  });
}

/**
 * Clones nodes into a fragment
 * @param {NodeList} nodeList
 * @param {number=} rangeStart
 * @param {number=} rangeEnd
 */
function nodeListToFragment(nodeList, rangeStart = 0, rangeEnd) {
  const fragment = document.createDocumentFragment();
  const end = rangeEnd !== undefined ? rangeEnd : nodeList.length;
  for (let i = rangeStart; i < end; i++) {
    fragment.appendChild(nodeList[i].cloneNode(true));
  }
  return fragment;
}

/**
 * if it has a parent section, don't touch it
 * if it has a class of appendix or introductory, don't touch it
 * if all the preceding section siblings are introductory, make it introductory
 * if there is a preceding section sibling which is an appendix, make it appendix
 * @param {Element} tofElement
 */
function decorateTableOfFigures(tofElement) {
  if (
    tofElement.classList.contains("appendix") ||
    tofElement.classList.contains("introductory") ||
    tofElement.closest("section")
  ) {
    return;
  }

  const previousSections = getPreviousSections(tofElement);
  if (previousSections.every(sec => sec.classList.has("introductory"))) {
    tofElement.classList.add("introductory");
  } else if (previousSections.some(sec => sec.classList.has("appendix"))) {
    tofElement.classList.add("appendix");
  }
}

/**
 * @param {Element} element
 */
function getPreviousSections(element) {
  /** @type {Element[]} */
  const sections = [];
  for (const previous of iteratePreviousElements(element)) {
    if (previous.localName === "section") {
      sections.push(previous);
    }
  }
  return sections;
}

/**
 * @param {Element} element
 */
function* iteratePreviousElements(element) {
  let previous = element;
  while (previous.previousElementSibling) {
    previous = previous.previousElementSibling;
    yield previous;
  }
}
