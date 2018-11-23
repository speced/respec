import { pub } from "./pubsubhub";
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
  const elements = getDirectDescendents(elem, "li");
  const sortedElements = elements.sort(makeSorter(dir)).reduce((frag, elem) => {
    frag.appendChild(elem);
    return frag;
  }, document.createDocumentFragment());
  return sortedElements;
}

function getDirectDescendents(elem, wantedDescendentName) {
  let elements;
  try {
    elements = elem.querySelectorAll(`:scope > ${wantedDescendentName}`);
  } catch (err) {
    let tempId = "";
    // We give a temporary id, to overcome lack of ":scope" support in Edge.
    if (!elem.id) {
      tempId = `temp-${String(Math.random()).substr(2)}`;
      elem.id = tempId;
    }
    const query = `#${elem.id} > ${wantedDescendentName}`;
    elements = elem.parentElement.querySelectorAll(query);
    if (tempId) {
      elem.id = "";
    }
  }
  return [...elements];
}

/**
 * Shallow sort a definition list based on its definition terms (dt) elements.
 *
 * @param {HTMLDListElement} dl
 * @returns {DocumentFragment}
 */
export function sortDefinitionTerms(dl, dir) {
  const elements = getDirectDescendents(dl, "dt");
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
  for (const elem of document.querySelectorAll("[data-sort]")) {
    let sortedElems;
    const dir = elem.dataset.sort || "ascending";
    switch (elem.localName) {
      case "dl":
        sortedElems = sortDefinitionTerms(elem, dir);
        break;
      case "ol":
      case "ul":
        sortedElems = sortListItems(elem, dir);
        break;
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
