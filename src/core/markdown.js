/**
 * Module core/markdown
 * Handles the optional markdown processing.
 *
 * Markdown support is optional. It is enabled by setting the `format`
 * property of the configuration object to "markdown."
 *
 * We use marked for parsing Markdown:
 * https://github.com/chjj/marked
 *
 * Note that the content of SECTION elements, and elements with a
 * class name of "note", "issue" or "req" are also parsed.
 *
 * The HTML created by the Markdown parser is turned into a nested
 * structure of SECTION elements, following the structure given by
 * the headings. For example, the following markup:
 *
 *     Title
 *     -----
 *
 *     ### Subtitle ###
 *
 *     Here's some text.
 *
 *     ### Another subtitle ###
 *
 *     More text.
 *
 * will be transformed into:
 *
 *     <section>
 *       <h2>Title</h2>
 *       <section>
 *         <h3>Subtitle</h3>
 *         <p>Here's some text.</p>
 *       </section>
 *       <section>
 *         <h3>Another subtitle</h3>
 *         <p>More text.</p>
 *       </section>
 *     </section>
 *
 * The whitespace of pre elements are left alone.
 **/

import { markdownToHtml } from "./utils";
export const name = "core/markdown";

function processElements(selector) {
  return element => {
    const elements = Array.from(element.querySelectorAll(selector));
    elements.reverse().forEach(element => {
      element.innerHTML = markdownToHtml(element.innerHTML);
    });
    return elements;
  };
}

class Builder {
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

  addSection(node, process) {
    const header = this.findHeader(node);
    const position = header ? this.findPosition(header) : 1;
    const parent = this.findParent(position);

    if (header) {
      node.removeChild(header);
    }

    node.appendChild(process(node));

    if (header) {
      node.insertBefore(header, node.firstChild);
    }

    parent.appendChild(node);
    this.current = parent;
  }

  addElement(node) {
    this.current.appendChild(node);
  }
}

function structure(fragment, doc) {
  function process(root) {
    const stack = new Builder(doc);
    while (root.firstChild) {
      const node = root.firstChild;
      if (node.nodeType !== Node.ELEMENT_NODE) {
        root.removeChild(node);
        continue;
      }
      switch (node.localName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          stack.addHeader(node);
          break;
        case "section":
          stack.addSection(node, process);
          break;
        default:
          stack.addElement(node);
      }
    }
    return stack.root;
  }
  return process(fragment);
}

function substituteWithTextNodes(elements) {
  Array.from(elements).forEach(element => {
    const textNode = element.ownerDocument.createTextNode(element.textContent);
    element.parentElement.replaceChild(textNode, element);
  });
}

const processMDSections = processElements("[data-format='markdown']:not(body)");
const processBlockLevelElements = processElements(
  "[data-format=markdown]:not(body), section, div, address, article, aside, figure, header, main, body"
);

export function run(conf) {
  const hasMDSections = !!document.querySelector(
    "[data-format=markdown]:not(body)"
  );
  const isMDFormat = conf.format === "markdown";
  if (!isMDFormat && !hasMDSections) {
    return; // Nothing to be done
  }
  // Only has markdown-format sections
  if (!isMDFormat) {
    processMDSections(document.body)
      .map(elem => {
        const structuredInternals = structure(elem, elem.ownerDocument);
        return {
          structuredInternals,
          elem,
        };
      })
      .forEach(({ elem, structuredInternals }) => {
        elem.setAttribute("aria-busy", "true");
        if (
          structuredInternals.firstElementChild.localName === "section" &&
          elem.localName === "section"
        ) {
          const section = structuredInternals.firstElementChild;
          section.remove();
          elem.append(...section.childNodes);
        } else {
          elem.innerHTML = "";
        }
        elem.appendChild(structuredInternals);
        elem.setAttribute("aria-busy", "false");
      });
    return;
  }
  // We transplant the UI to do the markdown processing
  const rsUI = document.getElementById("respec-ui");
  rsUI.remove();
  // The new body will replace the old body
  const newHTML = document.createElement("html");
  const newBody = document.createElement("body");
  newBody.innerHTML = document.body.innerHTML;
  // Marked expects markdown be flush against the left margin
  // so we need to normalize the inner text of some block
  // elements.
  newHTML.appendChild(newBody);
  processBlockLevelElements(newHTML);
  // Process root level text nodes
  const cleanHTML = newBody.innerHTML
    // Markdown parsing sometimes inserts empty p tags
    .replace(/<p>\s*<\/p>/gm, "");
  newBody.innerHTML = cleanHTML;
  // Remove links where class .nolinks
  substituteWithTextNodes(newBody.querySelectorAll(".nolinks a[href]"));
  // Restructure the document properly
  const fragment = structure(newBody, document);
  // Frankenstein the whole thing back together
  newBody.appendChild(fragment);
  newBody.prepend(rsUI);
  document.body.parentNode.replaceChild(newBody, document.body);
}
