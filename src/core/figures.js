// @ts-check
// Module core/figure
// Handles figures in the document.
// Adds width and height to images, if they are missing.
// Generates a Table of Figures wherever there is a #tof element.

import { addId, renameElement, showInlineWarning, wrapInner } from "./utils.js";
import { lang as defaultLang } from "../core/l10n.js";
import hyperHTML from "hyperhtml";

export const name = "core/figures";

const localizationStrings = {
  en: {
    table_of_fig: "Table of Figures",
  },
  nl: {
    table_of_fig: "Lijst met figuren",
  },
  es: {
    table_of_fig: "Tabla de Figuras",
  },
};

const lang = defaultLang in localizationStrings ? defaultLang : "en";

const l10n = localizationStrings[lang];

export function run(conf) {
  normalizeImages(document);

  const { tof } = collectFigures(conf);

  // Create a Table of Figures if a section with id 'tof' exists.
  const tofElement = document.getElementById("tof");
  if (tof.length && tofElement) {
    decorateTableOfFigures(tofElement);
    tofElement.append(
      hyperHTML`<h2>${l10n.table_of_fig}</h2>`,
      hyperHTML`<ul class='tof'>${tof}</ul>`
    );
  }
}

/**
 * process all figures
 */
function collectFigures(conf) {
  /** @type {HTMLElement[]} */
  const tof = [];
  document.querySelectorAll("figure").forEach((fig, i) => {
    const caption = fig.querySelector("figcaption");

    if (caption) {
      decorateFigure(fig, caption, i, conf);
    } else {
      showInlineWarning(fig, "Found a `<figure>` without a `<figcaption>`");
    }

    tof.push(getTableOfFiguresListItem(fig.id, caption));
  });
  return tof;
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
    <a class='tocxref' href='${`#${figureId}`}'>${tofCaption.childNodes}</a>
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
  if (previousSections.every(sec => sec.classList.contains("introductory"))) {
    tofElement.classList.add("introductory");
  } else if (previousSections.some(sec => sec.classList.contains("appendix"))) {
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
