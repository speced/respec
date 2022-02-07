/**
 * Module core/sections
 *
 * Adds <section>s to the document, based on the heading structure.
 */
export const name = "core/sections";

class DOMBuilder {
  constructor(doc) {
    this.doc = doc;
    this.root = doc.createDocumentFragment();
    this.stack = [this.root];
    this.current = this.root;
  }
  findPosition(header) {
    return parseInt(header.tagName.charAt(1), 10);
  }
  findParent(position) {
    let parent;
    while (position > 0) {
      position--;
      parent = this.stack[position];
      if (parent) return parent;
    }
  }
  findHeader({ firstChild: node }) {
    while (node) {
      if (/H[1-6]/.test(node.tagName)) {
        return node;
      }
      node = node.nextSibling;
    }
    return null;
  }

  addHeader(header) {
    const section = this.doc.createElement("section");
    const position = this.findPosition(header);

    section.appendChild(header);
    this.findParent(position).appendChild(section);
    this.stack[position] = section;
    this.stack.length = position + 1;
    this.current = section;
  }

  addSection(node) {
    const header = this.findHeader(node);
    const position = header ? this.findPosition(header) : 1;
    const parent = this.findParent(position);

    if (header) {
      node.removeChild(header);
    }

    node.appendChild(structure(node));

    if (header) {
      node.prepend(header);
    }

    parent.appendChild(node);
    this.current = parent;
  }

  addElement(node) {
    this.current.appendChild(node);
  }
}
/**
 *
 * @param {Node} fragment
 * @returns
 */
function structure(fragment) {
  const builder = new DOMBuilder(fragment.ownerDocument);
  while (fragment.firstChild) {
    const node = fragment.firstChild;
    switch (node.localName) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        builder.addHeader(node);
        break;
      case "section":
        builder.addSection(node);
        break;
      default:
        builder.addElement(node);
    }
  }
  return builder.root;
}

/**
 * Restructure a container element adding sections if needed.
 * @param {Element} elem
 */
export function restructure(elem) {
  const structuredInternals = structure(elem);
  if (
    structuredInternals.firstElementChild.localName === "section" &&
    elem.localName === "section"
  ) {
    const section = structuredInternals.firstElementChild;
    section.remove();
    elem.append(...section.childNodes);
  } else {
    elem.textContent = "";
  }
  elem.appendChild(structuredInternals);
}

export function run() {
  restructure(document.body);
}
