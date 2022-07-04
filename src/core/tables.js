// @ts-check
// Module core/tables
// Handles tables in the document.
// Generates a List of Tables wherever there is a #list-of-tables element.

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
};

const l10n = getIntlData(localizationStrings);

export function run() {
  const listOfTables = collectTables();

  // Create a List of Tables if a section with id 'list-of-tables' exists.
  const listOfTablesElement = document.getElementById("list-of-tables");
  if (listOfTables.length && listOfTablesElement) {
    decorateListOfTables(listOfTablesElement);
    listOfTablesElement.append(
      html`<h1>${l10n.list_of_tables}</h1>`,
      html`<ul class="list-of-tables">
        ${listOfTables}
      </ul>`
    );
  }
}

/**
 * process all tables
 */
function collectTables() {
  /** @type {HTMLElement[]} */
  const listOfTables = [];
  document.querySelectorAll("table.numbered").forEach((table, i) => {
    const caption = table.querySelector("caption");

    // there is a linter rule to catch numbered tables without captions
    if (caption) {
      decorateTable(table, caption, i);
      listOfTables.push(getListOfTablesListItem(table.id, caption));
    }
  });
  return listOfTables;
}

/**
 * @param {HTMLTableElement} table
 * @param {HTMLTableCaptionElement} caption
 * @param {number} i
 */
function decorateTable(table, caption, i) {
  const title = caption.textContent;
  addId(table, "table", title);
  // set proper caption title
  wrapInner(caption, html`<span class="table-title"></span>`);
  caption.prepend(l10n.table, html`<bdi class="tableno">${i + 1}</bdi>`, " ");
}

/**
 * @param {string} tableId
 * @param {HTMLElement} caption
 * @return {HTMLElement}
 */
function getListOfTablesListItem(tableId, caption) {
  const listOfTablesCaption = caption.cloneNode(true);
  listOfTablesCaption.querySelectorAll("a").forEach(anchor => {
    let new_anchor = renameElement(anchor, "span");
    new_anchor.removeAttribute("href");
    new_anchor.removeAttribute("id");
  });
  return html`<li>
    <a class="tocxref" href="${`#${tableId}`}">${listOfTablesCaption.childNodes}</a>
  </li>`;
}

/**
 * if it has a parent section, don't touch it
 * if it has a class of appendix or introductory, don't touch it
 * if all the preceding section siblings are introductory, make it introductory
 * if there is a preceding section sibling which is an appendix, make it appendix
 * @param {Element} totElement
 */
function decorateListOfTables(listOfTablesElement) {
  if (
    listOfTablesElement.classList.contains("appendix") ||
    listOfTablesElement.classList.contains("introductory") ||
    listOfTablesElement.closest("section")
  ) {
    return;
  }

  const previousSections = getPreviousSections(listOfTablesElement);
  if (previousSections.every(sec => sec.classList.contains("introductory"))) {
    listOfTablesElement.classList.add("introductory");
  } else if (previousSections.some(sec => sec.classList.contains("appendix"))) {
    listOfTablesElement.classList.add("appendix");
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
