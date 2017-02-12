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

import marked from "deps/marked";
import { normalizePadding } from "core/utils";
import beautify from "deps/beautify-html";
import beautifyOps from "core/beautify-options";

marked.setOptions({
  sanitize: false,
  gfm: true,
});

function toHTML(text) {
  const normalizedLeftPad = normalizePadding(text);
  // As markdown is pulled from HTML, > is already escaped and
  // so blockquotes aren't picked up by the parser. This fixes it.
  const potentialMarkdown = normalizedLeftPad.replace(/&gt;/gm, ">");
  const html = marked(potentialMarkdown);
  return html;
}

function processElements(selector) {
  return element => {
    const elementsToProcess = Array.from(element.querySelectorAll(selector));
    elementsToProcess
      .reverse()
      .map(
        element => ({ element, html: toHTML(element.innerHTML) })
      )
      .reduce((div, { element, html }) => {
        let node = div;
        div.innerHTML = html;
        // Same element, don't nest
        if (div.firstChild && element.localName === div.firstChild.localName) {
          node = div.firstChild;
        }
        element.innerHTML = "";
        while (node.firstChild) {
          element.appendChild(node.firstChild);
        }
        return div;
      }, element.ownerDocument.createElement("div"));
    return elementsToProcess;
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
  Array
    .from(elements)
    .forEach(element => {
      const textNode = element.ownerDocument.createTextNode(element.textContent);
      element.parentElement.replaceChild(textNode, element);
    });
}

const processBlockLevelElements = processElements("section section, body > section, .issue, .note, .req");

export function run(conf, doc, cb) {
  if (conf.format !== "markdown") {
    return cb();
  }
  // We transplant the UI to do the markdown processing
  const rsUI = doc.getElementById("respec-ui");
  rsUI.remove();
  // The new body will replace the old body
  const newBody = doc.createElement("body");
  newBody.innerHTML = doc.body.innerHTML;
  // Marked expects markdown be flush against the left margin
  // so we need to normalize the inner text of some block
  // elements.
  const processedElements = processBlockLevelElements(newBody);
  // Process the rest
  Array
    .from(newBody.childNodes)
    .filter(node => node.textContent.trim() && !processedElements.includes(node))
    .forEach(node => {
      const frag = node.ownerDocument.createDocumentFragment();
      const div = node.ownerDocument.createElement("div");
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          div.innerHTML = toHTML(node.outerHTML);
          break;
        case Node.TEXT_NODE:
          div.innerHTML = toHTML(node.textContent);
          break;
        default:
          div.appendChild(node);
      } 
      while (div.firstChild) {
        frag.appendChild(div.firstChild);
      }
      node.parentNode.replaceChild(frag, node);
    });
  const dirtyHTML = newBody.innerHTML;
  const cleanHTML = dirtyHTML
    // Markdown parsing sometimes inserts empty p tags
    .replace(/<p>\s*<\/p>/gm, "");
  const beautifulHTML = beautify
    .html_beautify(cleanHTML, beautifyOps)
    // beautifer has a bad time with "\n&quot;<element"
    // https://github.com/beautify-web/js-beautify/issues/943
    .replace(/\"\n\s+\</gm, "\"<")
  
  newBody.innerHTML = beautifulHTML;
  // Remove links where class .nolinks
  substituteWithTextNodes(newBody.querySelectorAll(".nolinks a[href]"));
  // Restructure the document properly
  var fragment = structure(newBody, doc);
  // Frankenstein the whole thing back together
  newBody.appendChild(fragment);
  newBody.appendChild(rsUI);
  doc.body.parentNode.replaceChild(newBody, doc.body);
  cb();
};
