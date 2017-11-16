import { pub } from "core/pubsubhub";
export const name = "core/list-sorter";

function makeSorter(direction) {
  return ({ textContent: a }, { textContent: b }) => {
    return direction === "ascending" ? a.localeCompare(b) : b.localeCompare(a);
  };
}

function sortDefinitionTerms(dl) {
  const dir = dl.dataset.sort || "ascending";
  const sortedElements = Array.from(dl.querySelectorAll("dt"))
    .sort(makeSorter(dir))
    .reduce((frag, elem) => {
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

export function run(conf, doc, cb) {
  const thingsToSort = Array.from(document.querySelectorAll("[data-sort]"));
  for (const parent of thingsToSort) {
    let sortedElems;
    switch (parent.localName) {
      case "dl":
        sortedElems = sortDefinitionTerms(parent);
        break;
      default:
        pub("warning", `ReSpec can't sort ${parent.localName} elements.`);
    }
    if (sortedElems) {
      const range = document.createRange();
      range.selectNodeContents(parent);
      range.deleteContents();
      parent.appendChild(sortedElems);
    }
  }
  cb();
}
