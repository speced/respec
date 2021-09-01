// @ts-check
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
 */

import { getElementIndentation } from "./utils.js";
import { marked } from "./import-maps.js";
import { reindent } from "./reindent.js";
export const name = "core/markdown";

const gtEntity = /&gt;/gm;
const ampEntity = /&amp;/gm;

class Renderer extends marked.Renderer {
  code(code, infoString, isEscaped) {
    const { language, ...metaData } = Renderer.parseInfoString(infoString);

    // regex to check whether the language is webidl
    if (/(^webidl$)/i.test(language)) {
      return `<pre class="idl">${code}</pre>`;
    }

    // @ts-expect-error
    const html = super.code(code, language, isEscaped);

    const { example, illegalExample } = metaData;
    if (!example && !illegalExample) return html;

    const title = example || illegalExample;
    const className = `${language} ${example ? "example" : "illegal-example"}`;
    return html.replace("<pre>", `<pre title="${title}" class="${className}">`);
  }

  /**
   * @param {string} infoString
   */
  static parseInfoString(infoString) {
    const firstSpace = infoString.search(/\s/);
    if (firstSpace === -1) {
      return { language: infoString };
    }

    const language = infoString.slice(0, firstSpace);
    const metaDataStr = infoString.slice(firstSpace + 1);
    let metaData;
    if (metaDataStr) {
      try {
        metaData = JSON.parse(`{ ${metaDataStr} }`);
      } catch (error) {
        console.error(error);
      }
    }

    return { language, ...metaData };
  }

  heading(text, level, raw, slugger) {
    const headingWithIdRegex = /(.+)\s+{#([\w-]+)}$/;
    if (headingWithIdRegex.test(text)) {
      const [, textContent, id] = text.match(headingWithIdRegex);
      return `<h${level} id="${id}">${textContent}</h${level}>`;
    }
    // @ts-expect-error
    return super.heading(text, level, raw, slugger);
  }
}

/**
 * @param {string} text
 */
export function markdownToHtml(text) {
  const normalizedLeftPad = reindent(text);
  // As markdown is pulled from HTML, > and & are already escaped and
  // so blockquotes aren't picked up by the parser. This fixes it.
  const potentialMarkdown = normalizedLeftPad
    .replace(gtEntity, ">")
    .replace(ampEntity, "&");
  // @ts-ignore
  const result = marked(potentialMarkdown, {
    sanitize: false,
    gfm: true,
    headerIds: false,
    langPrefix: "",
    renderer: new Renderer(),
  });
  return result;
}

/**
 * @param {string} selector
 * @return {(el: Element) => Element[]}
 */
function convertElements(selector) {
  return element => {
    const elements = element.querySelectorAll(selector);
    elements.forEach(convertElement);
    return Array.from(elements);
  };
}

/**
 * @param {Element} element
 */
function convertElement(element) {
  for (const pre of element.getElementsByTagName("pre")) {
    // HTML parser implicitly removes a newline after <pre>
    // which breaks reindentation algorithm
    pre.prepend("\n");
  }
  element.innerHTML = markdownToHtml(element.innerHTML);
}

/**
 * CommonMark requires additional empty newlines between markdown and HTML lines.
 * This function adds them as a backward compatibility workaround.
 * @param {HTMLElement} element
 * @param {string} selector
 */
function workaroundBlockLevelMarkdown(element, selector) {
  /** @type {NodeListOf<HTMLElement>} */
  const elements = element.querySelectorAll(selector);
  for (const element of elements) {
    const { innerHTML } = element;
    if (/^<\w/.test(innerHTML.trimStart())) {
      // if the block content starts with HTML-like format
      // then assume it doesn't need a workaround
      continue;
    }
    // Double newlines are needed to be parsed as Markdown
    const lines = innerHTML.split("\n");
    const firstTwo = lines.slice(0, 2).join("\n");
    const lastTwo = lines.slice(-2).join("\n");
    if (firstTwo.trim()) {
      element.prepend("\n\n");
    }
    if (lastTwo.trim()) {
      // keep the indentation of the end tag
      const indentation = getElementIndentation(element);
      element.append(`\n\n${indentation}`);
    }
  }
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
      node.prepend(header);
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

/**
 * Re-structure DOM around elem whose markdown has been processed.
 * @param {Element} elem
 */
export function restructure(elem) {
  const structuredInternals = structure(elem, elem.ownerDocument);
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

/**
 * @param {Iterable<Element>} elements
 */
function substituteWithTextNodes(elements) {
  Array.from(elements).forEach(element => {
    element.replaceWith(element.textContent);
  });
}

const processMDSections = convertElements("[data-format='markdown']:not(body)");
const blockLevelElements =
  "[data-format=markdown], section, div, address, article, aside, figure, header, main";

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
    for (const processedElem of processMDSections(document.body)) {
      restructure(processedElem);
    }
    return;
  }
  // We transplant the UI to do the markdown processing
  const rsUI = document.getElementById("respec-ui");
  rsUI.remove();
  // The new body will replace the old body
  const newBody = document.body.cloneNode(true);
  // Marked expects markdown be flush against the left margin
  // so we need to normalize the inner text of some block
  // elements.
  workaroundBlockLevelMarkdown(newBody, blockLevelElements);
  convertElement(newBody);
  // Remove links where class .nolinks
  substituteWithTextNodes(newBody.querySelectorAll(".nolinks a[href]"));
  // Restructure the document properly
  const fragment = structure(newBody, document);
  // Frankenstein the whole thing back together
  newBody.append(rsUI, fragment);
  document.body.replaceWith(newBody);
}
