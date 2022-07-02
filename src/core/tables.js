// @ts-check
// Module core/tables
// Handles tables in the document.
// Generates a Table of Tables wherever there is a #tot element.

import {
  addId,
  getIntlData,
  renameElement,
  showWarning,
  wrapInner,
} from "./utils.js";
import { html } from "./import-maps.js";

export const name = "core/tables";

const localizationStrings = {
  en: {
    list_of_tables: "List of Tables",
    table: "Table ",
  },
  ja: {
    table: "図 ",
    list_of_tables: "図のリスト",
  },
  ko: {
    table: "그림 ",
    list_of_tables: "그림 목록",
  },
  nl: {
    table: "Figuur ",
    list_of_tables: "Lijst met figuren",
  },
  es: {
    table: "Figura ",
    list_of_tables: "Lista de Figuras",
  },
  zh: {
    table: "图 ",
    list_of_tables: "规范中包含的图",
  },
  de: {
    table: "Abbildung",
    list_of_tables: "Abbildungsverzeichnis",
  },
};

const l10n = getIntlData(localizationStrings);

export function run() {
  const tot = collectTables();

  // Create a Table of Tables if a section with id 'tot' exists.
  const totElement = document.getElementById("tot");
  if (tot.length && totElement) {
    decorateTableOfTables(totElement);
    totElement.append(
      html`<h1>${l10n.list_of_tables}</h1>`,
      html`<ul class="tot">
        ${tot}
      </ul>`
    );
  }
}

/**
 * process all tables
 */
function collectTables() {
  /** @type {HTMLElement[]} */
  const tot = [];
  document.querySelectorAll("table").forEach((table, i) => {
    const caption = table.querySelector("caption");

    if (caption) {
      decorateTable(table, caption, i);
      tot.push(getTableOfTablesListItem(table.id, caption));
    } else {
      const msg = "Found a `<table>` without a `<caption>`.";
      showWarning(msg, name, { elements: [table] });
    }
  });
  return tot;
}

/**
 * @param {HTMLElement} table
 * @param {HTMLElement} caption
 * @param {number} i
 */
function decorateTable(table, caption, i) {
  const title = caption.textContent;
  addId(table, "table", title);
  // set proper caption title
  wrapInner(caption, html`<span class="table-title"></span>`);
  if (table.classList.contains("numbered")) {
    caption.prepend(l10n.table, html`<bdi class="tableno">${i + 1}</bdi>`, " ");
  }
}

/**
 * @param {string} tableId
 * @param {HTMLElement} caption
 * @return {HTMLElement}
 */
function getTableOfTablesListItem(tableId, caption) {
  const totCaption = caption.cloneNode(true);
  totCaption.querySelectorAll("a").forEach(anchor => {
    renameElement(anchor, "span").removeAttribute("href");
  });
  return html`<li class="totline">
    <a class="tocxref" href="${`#${tableId}`}">${totCaption.childNodes}</a>
  </li>`;
}

/**
 * if it has a parent section, don't touch it
 * if it has a class of appendix or introductory, don't touch it
 * if all the preceding section siblings are introductory, make it introductory
 * if there is a preceding section sibling which is an appendix, make it appendix
 * @param {Element} totElement
 */
function decorateTableOfTables(totElement) {
  if (
    totElement.classList.contains("appendix") ||
    totElement.classList.contains("introductory") ||
    totElement.closest("section")
  ) {
    return;
  }

  const previousSections = getPreviousSections(totElement);
  if (previousSections.every(sec => sec.classList.contains("introductory"))) {
    totElement.classList.add("introductory");
  } else if (previousSections.some(sec => sec.classList.contains("appendix"))) {
    totElement.classList.add("appendix");
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
