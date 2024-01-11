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

import { getElementIndentation, reindent } from "./utils.js";
import { marked } from "./import-maps.js";

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

    const html = super
      .code(code, language, isEscaped)
      .replace(`class="language-`, `class="`);

    const { example, illegalExample } = metaData;
    if (!example && !illegalExample) return html;

    const title = example || illegalExample;
    const className = `${language} ${example ? "example" : "illegal-example"}`;
    return html.replace("<pre>", `<pre title="${title}" class="${className}">`);
  }

  image(href, title, text) {
    if (!title) {
      return super.image(href, title, text);
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

  heading(text, level, raw) {
    const headingWithIdRegex = /(.+)\s+{#([\w-]+)}$/;
    if (headingWithIdRegex.test(text)) {
      const [, textContent, id] = text.match(headingWithIdRegex);
      return `<h${level} id="${id}">${textContent}</h${level}>`;
    }
    return super.heading(text, level, raw);
  }
}

/** @type {import('marked').MarkedOptions} */
const config = {
  gfm: true,
  renderer: new Renderer(),
};

/**
 * @param {string} text
 * @param {object} options
 * @param {boolean} options.inline
 */
export function markdownToHtml(text, options = { inline: false }) {
  const normalizedLeftPad = reindent(text);
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
