// @ts-check
// Module core/tables
// Handles tables in the document.
// Generates a List of Tables wherever there is a #list-of-tables element.

import {
  addId,
  getIntlData,
  getPreviousSections,
  renameElement,
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
  const listOfTablesElement = document.querySelector("section#list-of-tables");
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
  /** @type {HTMLLIElement[]} */
  const listOfTables = [];
  /** @type {NodeListOf<HTMLTableElement>} */
  const tables = document.querySelectorAll("table.numbered");
  [...tables]
    // there is a separate linter rule to catch numbered tables without captions
    .filter(table => !!table.querySelector("caption"))
    .forEach((table, i) => {
      const caption = table.querySelector("caption");
      decorateTable(table, caption, i);
      listOfTables.push(getListOfTablesListItem(table.id, caption));
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
  caption.prepend(
    html`<a class="self-link" href="#${table.id}"
      >${l10n.table}<bdi class="tableno">${i + 1}</bdi></a
    >`,
    " "
  );
}

/**
 * @param {string} tableId
 * @param {HTMLTableCaptionElement} caption
 * @return {HTMLLIElement}
 */
function getListOfTablesListItem(tableId, caption) {
  const listOfTablesCaption = caption.cloneNode(true);
  for (const anchor of listOfTablesCaption.querySelectorAll("a")) {
    renameElement(anchor, "span", { copyAttributes: false });
  }
  return html`<li>
    <a class="tocxref" href="${`#${tableId}`}"
      >${listOfTablesCaption.childNodes}</a
    >
  </li>`;
}

/**
 * if it has a parent section, don't touch it
 * if it has a class of appendix or introductory, don't touch it
 * if all the preceding section siblings are introductory, make it introductory
 * if there is a preceding section sibling which is an appendix, make it appendix
 * @param {Element} listOfTablesElement
 */
function decorateListOfTables(listOfTablesElement) {
  if (
    listOfTablesElement.matches(".appendix, .introductory") ||
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
