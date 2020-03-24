// @ts-check
/**
 * If a `<section id="index">` exists, it is filled by a list terms defined by
 * reference (external terms).
 */

import { addId } from "./utils.js";
import { citeDetailsConverter } from "./data-cite.js";
import { fetchAsset } from "./text-loader.js";
import { getTermFromElement } from "./xref.js";
import { hyperHTML as html } from "./import-maps.js";
import { renderInlineCitation } from "./render-biblio.js";

export const name = "core/dfn-index";

/**
 * @typedef {{ term: string, type: string, linkFor: string, elem: HTMLAnchorElement }} Entry
 */

export async function run(conf) {
  const index = document.querySelector("section#index");
  if (!index) {
    return;
  }

  const styleEl = document.createElement("style");
  styleEl.textContent = await loadStyle();
  document.head.appendChild(styleEl);

  index.classList.add("appendix");
  if (!index.querySelector("h2")) {
    index.prepend(html`<h2>Index</h2>`);
  }

  const toCiteDetails = citeDetailsConverter(conf);

  const externalTermIndex = html`<section id="index-defined-elsewhere">
    <h3>Terms defined by reference</h3>
    ${createExternalTermIndex(toCiteDetails)}
  </section>`;
  index.append(externalTermIndex);
}

/**
 * @param {ReturnType<typeof citeDetailsConverter>} toCiteDetails
 */
function createExternalTermIndex(toCiteDetails) {
  const data = collectExternalTerms(toCiteDetails);
  const dataSortedBySpec = [...data.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  return html`<ul class="index">
    ${dataSortedBySpec.map(
      ([spec, entries]) => html`<li>
        ${renderInlineCitation(spec)} defines the following:
        <ul>
          ${entries
            .sort((a, b) => a.term.localeCompare(b.term))
            .map(renderExternalTermEntry)}
        </ul>
      </li>`
    )}
  </ul>`;
}

/**
 * @param {ReturnType<typeof citeDetailsConverter>} toCiteDetails
 */
function collectExternalTerms(toCiteDetails) {
  /** @type {Set<string>} */
  const uniqueReferences = new Set();
  /** @type {Map<string, Entry[]>} spec => entry[] */
  const data = new Map();

  /** @type {NodeListOf<HTMLAnchorElement>} */
  const elements = document.querySelectorAll(`a[data-cite]`);
  for (const elem of elements) {
    if (!elem.dataset.cite) {
      continue;
    }
    const uniqueID = elem.href;
    if (uniqueReferences.has(uniqueID)) {
      continue;
    }

    const { type, linkFor } = elem.dataset;
    const term = getTermFromElement(elem);
    if (!term) {
      continue; // <a data-cite="SPEC"></a>
    }
    const spec = toCiteDetails(elem).key.toUpperCase();

    const entriesBySpec = data.get(spec) || data.set(spec, []).get(spec);
    entriesBySpec.push({ term, type, linkFor, elem });
    uniqueReferences.add(uniqueID);
  }

  return data;
}

/**
 * @param {Entry} entry
 * @returns {HTMLLIElement}
 */
function renderExternalTermEntry(entry) {
  const { elem } = entry;
  const text = getTermText(entry);
  const el = html`<li>
    <span class="index-term" data-href="${elem.href}">${{ html: text }}</span>
  </li>`;
  addId(el.querySelector("span"), "index-term");
  return el;
}

// Terms of these _types_ are wrapped in `<code>`.
const CODE_TYPES = new Set([
  "attribute",
  "callback",
  "dict-member",
  "dictionary",
  "element-attr",
  "element",
  "enum-value",
  "enum",
  "exception",
  "extended-attribute",
  "interface",
  "method",
  "typedef",
]);

// Terms of these _types_ are suffixed with their type info.
const TYPED_TYPES = new Map([
  ["attribute", "attribute"],
  ["element-attr", "attribute"],
  ["element", "element"],
  ["enum", "enum"],
  ["exception", "exception"],
  ["extended-attribute", "extended attribute"],
  ["interface", "interface"],
]);

// These _terms_ have type suffix "type".
const TYPE_TERMS = new Set([
  // Following are primitive types as per WebIDL spec:
  "boolean",
  "byte",
  "octet",
  "short",
  "unsigned short",
  "long",
  "unsigned long",
  "long long",
  "unsigned long long",
  "float",
  "unrestricted float",
  "double",
  "unrestricted double",
  // Following are not primitive types, but aren't interfaces either.
  "void",
  "any",
  "object",
  "symbol",
]);

/** @param {Entry} entry */
function getTermText(entry) {
  const { term, type, linkFor } = entry;
  let text = term;

  if (CODE_TYPES.has(type)) {
    if (type === "extended-attribute") {
      text = `[${text}]`;
    }
    text = `<code>${text}</code>`;
  }

  const typeSuffix = TYPE_TERMS.has(term) ? "type" : TYPED_TYPES.get(type);
  if (typeSuffix) {
    text += ` ${typeSuffix}`;
  }

  if (linkFor) {
    let linkForText = linkFor;
    if (!/\s/.test(linkFor)) {
      // If linkFor is a single word, highlight it.
      linkForText = `<code>${linkForText}</code>`;
    }
    if (type === "element-attr") {
      linkForText += " element";
    }
    text += ` (for ${linkForText})`;
  }

  return text;
}

async function loadStyle() {
  try {
    return (await import("text!../../assets/dfn-index.css")).default;
  } catch {
    return fetchAsset("dfn-index.css");
  }
}
