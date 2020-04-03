// @ts-check
// Module core/data-include
// Support for the data-include attribute. Causes external content to be included inside an
// element that has data-include='some URI'. There is also a data-oninclude attribute that
// features a white space separated list of global methods that will be called with the
// module object, the content, and the included URI.
//
// IMPORTANT:
//  This module only really works when you are in an HTTP context, and will most likely
//  fail if you are editing your documents on your local drive. That is due to security
//  restrictions in the browser.
import { getElementIndentation, runTransforms } from "./utils.js";
import { pub } from "./pubsubhub.js";

export const name = "core/data-include";

/**
 * @param {string} text
 * @param {string} indent
 */
function indentTextWithoutFirstLine(text, indent) {
  const lines = text.split("\n");
  const firstLine = lines.shift();
  return `${firstLine}\n${lines.map(line => indent + line).join("\n")}`;
}

/**
 * @param {HTMLElement} el
 * @param {string} data
 * @param {object} options
 * @param {boolean} options.replace
 */
function fillWithText(el, data, { replace }) {
  const { includeFormat } = el.dataset;
  let fill = data;
  if (includeFormat === "markdown") {
    const indentation = getElementIndentation(el);
    const indented = indentTextWithoutFirstLine(data, indentation);
    fill = replace
      ? indented // use element indentation
      : `\n\n${indentation}${indented}\n\n${indentation}`;
  }

  if (includeFormat === "text") {
    el.textContent = fill;
  } else {
    el.innerHTML = fill;
  }

  if (replace) {
    el.replaceWith(...el.childNodes);
  }
}

/**
 * @param {string} rawData
 * @param {string} id
 * @param {string} url
 */
function processResponse(rawData, id, url) {
  /** @type {HTMLElement} */
  const el = document.querySelector(`[data-include-id=${id}]`);
  const data = runTransforms(rawData, el.dataset.oninclude, url);
  const replace = typeof el.dataset.includeReplace === "string";
  fillWithText(el, data, { replace });
  // If still in the dom tree, clean up
  if (!replace) {
    removeIncludeAttributes(el);
  }
}
/**
 * Removes attributes after they are used for inclusion, if present.
 *
 * @param {Element} el The element to clean up.
 */
function removeIncludeAttributes(el) {
  [
    "data-include",
    "data-include-format",
    "data-include-replace",
    "data-include-id",
    "oninclude",
  ].forEach(attr => el.removeAttribute(attr));
}

export async function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const includables = document.querySelectorAll("[data-include]");

  const promisesToInclude = Array.from(includables).map(async el => {
    const url = el.dataset.include;
    if (!url) {
      return; // just skip it
    }
    const id = `include-${String(Math.random()).substr(2)}`;
    el.dataset.includeId = id;
    try {
      const response = await fetch(url);
      const text = await response.text();
      processResponse(text, id, url);
    } catch (err) {
      const msg = `\`data-include\` failed: \`${url}\` (${err.message}). See console for details.`;
      console.error("data-include failed for element: ", el, err);
      pub("error", msg);
    }
  });
  await Promise.all(promisesToInclude);
}
