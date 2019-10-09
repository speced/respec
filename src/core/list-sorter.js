// @ts-check
import { children } from "./utils.js";
import { pub } from "./pubsubhub.js";
export const name = "core/list-sorter";

function makeSorter(direction) {
  return ({ textContent: a }, { textContent: b }) => {
    return direction === "ascending" ? a.localeCompare(b) : b.localeCompare(a);
  };
}
/**
 * Shallow sort list items in OL, and UL elements.
 *
 * @param {HTMLUListElement} elem
 * @returns {DocumentFragment}
 */
export function sortListItems(elem, dir) {
  const elements = [...children(elem, "li")];
  const sortedElements = elements.sort(makeSorter(dir)).reduce((frag, elem) => {
    frag.appendChild(elem);
    return frag;
  }, document.createDocumentFragment());
  return sortedElements;
}

/**
 * Shallow sort a definition list based on its definition terms (dt) elements.
 *
 * @param {HTMLDListElement} dl
 * @returns {DocumentFragment}
 */
export function sortDefinitionTerms(dl, dir) {
  const elements = [...children(dl, "dt")];
  const sortedElements = elements.sort(makeSorter(dir)).reduce((frag, elem) => {
    const { nodeType, nodeName } = elem;
    const children = document.createDocumentFragment();
    let { nextSibling: next } = elem;
    while (next) {
      if (!next.nextSibling) {
        break;
      }
      children.appendChild(next.cloneNode(true));
      const { nodeType: nextType, nodeName: nextName } = next.nextSibling;
      const isSameType = nextType === nodeType && nextName === nodeName;
      if (isSameType) {
        break;
      }
      next = next.nextSibling;
    }
    children.prepend(elem.cloneNode(true));
    frag.appendChild(children);
    return frag;
  }, document.createDocumentFragment());
  return sortedElements;
}

export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const sortables = document.querySelectorAll("[data-sort]");
  for (const elem of sortables) {
    let sortedElems;
    const dir = elem.dataset.sort || "ascending";
    switch (elem.localName) {
      case "dl": {
        const definition = /** @type {HTMLDListElement} */ (elem);
        sortedElems = sortDefinitionTerms(definition, dir);
        break;
      }
      case "ol":
      case "ul": {
        const list = /** @type {HTMLUListElement} */ (elem);
        sortedElems = sortListItems(list, dir);
        break;
      }
      default:
        pub("warning", `ReSpec can't sort ${elem.localName} elements.`);
    }
    if (sortedElems) {
      const range = document.createRange();
      range.selectNodeContents(elem);
      range.deleteContents();
      elem.appendChild(sortedElems);
    }
  }
}
