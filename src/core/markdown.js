// @ts-check
/**
 * Module core/markdown
 * Handles the optional markdown processing.
 *
 * Markdown support is optional. It is enabled by setting the `format`
 * property of the configuration object to "markdown."
 *
 * We use marked for parsing Markdown:
 * https://github.com/markedjs/marked
 *
 */

import { getElementIndentation } from "./utils.js";
import { marked } from "./import-maps.js";

export const name = "core/markdown";

const gtEntity = /&gt;/gm;
const ampEntity = /&amp;/gm;

class Renderer extends marked.Renderer {
  code({ text, lang, escaped }) {
    const { language, ...metaData } = Renderer.parseInfoString(lang || "");

    // regex to check whether the language is webidl
    if (/(^webidl$)/i.test(language)) {
      return `<pre class="idl">${text}</pre>`;
    }

    const html = super
      .code({ text, lang: language, escaped })
      .replace(`class="language-`, `class="`);

    const { example, illegalExample } = metaData;
    if (!example && !illegalExample) return html;

    const title = example || illegalExample;
    const className = `${language} ${example ? "example" : "illegal-example"}`;
    return html.replace("<pre>", `<pre title="${title}" class="${className}">`);
  }

  image({ href, title, text, tokens }) {
    if (!title) {
      return super.image({ href, title, text, tokens });
    }
    const html = String.raw;
    return html`
      <figure>
        <img src="${href}" alt="${text}" />
        <figcaption>${title}</figcaption>
      </figure>
    `;
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

  heading({ tokens, depth, text }) {
    const headingWithIdRegex = /(.+)\s+{#([\w-]+)}$/;
    if (headingWithIdRegex.test(text)) {
      const [, textContent, id] = text.match(headingWithIdRegex);
      return `<h${depth} id="${id}">${textContent}</h${depth}>`;
    }
    return super.heading({ tokens, depth });
  }
}

/** @type {import('marked').MarkedOptions} */
const config = {
  gfm: true,
  renderer: /** @type {any} */ (new Renderer()),
};

/**
 * Normalize indentation of text by stripping the leading whitespace determined
 * from the first non-empty line. This handles mixed-indentation HTML content
 * where some lines (e.g., from rendered markdown inside sections) may have less
 * indentation than the outer HTML structure.
 * @param {string} text
 */
function normalizeIndent(text) {
  if (!text) return text;
  const lines = text.trimEnd().split("\n");
  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }
  if (!lines.length) return "";
  // After the while loop, lines[0] is guaranteed to have non-whitespace content,
  // so search() will return a non-negative index (0 means no leading whitespace).
  const firstIndent = lines[0].search(/[^\s]/);
  if (firstIndent < 1) return lines.join("\n");
  const prefix = " ".repeat(firstIndent);
  return lines
    .map(s => (s.startsWith(prefix) ? s.slice(firstIndent) : s))
    .join("\n");
}

/**
 * @param {string} text
 * @param {object} options
 * @param {boolean} options.inline
 */
export function markdownToHtml(text, options = { inline: false }) {
  const normalizedLeftPad = normalizeIndent(text);
  // As markdown is pulled from HTML, > and & are already escaped and
  // so blockquotes aren't picked up by the parser. This fixes it.
  const potentialMarkdown = normalizedLeftPad
    .replace(gtEntity, ">")
    .replace(ampEntity, "&");

  const result = options.inline
    ? marked.parseInline(potentialMarkdown, config)
    : marked.parse(potentialMarkdown, config);
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
    processMDSections(document.body);
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
  // Frankenstein the whole thing back together
  newBody.append(rsUI);
  document.body.replaceWith(newBody);
}
