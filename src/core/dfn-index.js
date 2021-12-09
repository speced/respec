// @ts-check
/**
 * If a `<section id="index">` exists, it is filled by a list of terms defined
 * (locally) by current document and a list of terms referenced (external) by
 * current document.
 */

import { addId, getIntlData, norm } from "./utils.js";
import css from "../styles/dfn-index.css.js";
import { getTermFromElement } from "./xref.js";
import { html } from "./import-maps.js";
import { renderInlineCitation } from "./render-biblio.js";
import { sub } from "./pubsubhub.js";
import { toCiteDetails } from "./data-cite.js";

export const name = "core/dfn-index";

const localizationStrings = {
  en: {
    heading: "Index",
    headingExternal: "Terms defined by reference",
    headlingLocal: "Terms defined by this specification",
    dfnOf: "definition of",
  },
};
const l10n = getIntlData(localizationStrings);

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

/**
 * @typedef {{ term: string, type: string, linkFor: string, elem: HTMLAnchorElement }} Entry
 */

export function run() {
  const index = document.querySelector("section#index");
  if (!index) {
    // See below...
    sub("toc", () => {}, { once: true });
    return;
  }

  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  index.classList.add("appendix");
  if (!index.querySelector("h2")) {
    index.prepend(html`<h2>${l10n.heading}</h2>`);
  }

  const localTermIndex = html`<section id="index-defined-here">
    <h3>${l10n.headlingLocal}</h3>
    ${createLocalTermIndex()}
  </section>`;
  index.append(localTermIndex);

  const externalTermIndex = html`<section id="index-defined-elsewhere">
    <h3>${l10n.headingExternal}</h3>
    ${createExternalTermIndex()}
  </section>`;
  index.append(externalTermIndex);
  for (const el of externalTermIndex.querySelectorAll(".index-term")) {
    addId(el, "index-term");
  }

  // XXX: This event is used to overcome an edge case with core/structure,
  // related to a circular dependency in plugin run order. We want
  // core/structure to run after dfn-index so the #index can be listed in the
  // TOC, but we also want section numbers in dfn-index. So, we "split"
  // core/dfn-index in two parts, one that runs before core/structure (using
  // plugin order in profile) and the other (following) after section numbers
  // are generated in core/structure (this event).
  sub("toc", appendSectionNumbers, { once: true });

  sub("beforesave", cleanup);
}

function createLocalTermIndex() {
  const dataSortedByTerm = collectLocalTerms();
  return html`<ul class="index">
    ${dataSortedByTerm.map(([term, dfns]) => renderLocalTerm(term, dfns))}
  </ul>`;
}

function collectLocalTerms() {
  /** @type {Map<string, HTMLElement[]>} */
  const data = new Map();
  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll("dfn:not([data-cite])");
  for (const elem of elems) {
    if (!elem.id) continue;
    const text = norm(elem.textContent);
    const elemsByTerm = data.get(text) || data.set(text, []).get(text);
    elemsByTerm.push(elem);
  }

  const dataSortedByTerm = [...data].sort(([a], [b]) =>
    a.slice(a.search(/\w/)).localeCompare(b.slice(b.search(/\w/)))
  );

  return dataSortedByTerm;
}

/**
 * @param {string} term
 * @param {HTMLElement[]} dfns
 * @returns {HTMLLIElement}
 */
function renderLocalTerm(term, dfns) {
  const renderItem = (dfn, text, suffix) => {
    const href = `#${dfn.id}`;
    return html`<li data-id=${dfn.id}>
      <a class="index-term" href="${href}">${{ html: text }}</a> ${suffix
        ? { html: suffix }
        : ""}
    </li>`;
  };

  if (dfns.length === 1) {
    const dfn = dfns[0];
    const type = getLocalTermType(dfn);
    const text = getLocalTermText(dfn, type, term);
    const suffix = getLocalTermSuffix(dfn, type, term);
    return renderItem(dfn, text, suffix);
  }
  return html`<li>
    ${term}
    <ul>
      ${dfns.map(dfn => {
        const type = getLocalTermType(dfn);
        const text = getLocalTermSuffix(dfn, type, term) || l10n.dfnOf;
        return renderItem(dfn, text);
      })}
    </ul>
  </li>`;
}

/** @param {HTMLElement} dfn */
function getLocalTermType(dfn) {
  const ds = dfn.dataset;
  const type = ds.dfnType || ds.idl || ds.linkType || "";
  switch (type) {
    case "":
    case "dfn":
      return "";
    default:
      return type;
  }
}

/** @param {HTMLElement} dfn */
function getLocalTermParentContext(dfn) {
  /** @type {HTMLElement} */
  const dfnFor = dfn.closest("[data-dfn-for]:not([data-dfn-for=''])");
  return dfnFor ? dfnFor.dataset.dfnFor : "";
}

/**
 * @param {HTMLElement} dfn
 * @param {string} type
 * @param {string} term
 */
function getLocalTermText(dfn, type, term) {
  let text = term;
  if (type === "enum-value") {
    text = `"${text}"`;
  }
  if (CODE_TYPES.has(type) || dfn.dataset.idl || dfn.closest("code")) {
    text = `<code>${text}</code>`;
  }
  return text;
}

/**
 * @param {HTMLElement} dfn
 * @param {string} type
 * @param {string} [term=""]
 */
function getLocalTermSuffix(dfn, type, term = "") {
  if (term.startsWith("[[")) {
    const parent = getLocalTermParentContext(dfn);
    return `internal slot for <code>${parent}</code>`;
  }

  switch (type) {
    case "dict-member":
    case "method":
    case "attribute":
    case "enum-value": {
      const typeText =
        type === "dict-member" ? "member" : type.replace("-", " ");
      const parent = getLocalTermParentContext(dfn);
      return `${typeText} for <code>${parent}</code>`;
    }
    case "interface":
    case "dictionary":
    case "enum": {
      return type;
    }
    case "constructor": {
      const parent = getLocalTermParentContext(dfn);
      return `for <code>${parent}</code>`;
    }
    default:
      return "";
  }
}

function appendSectionNumbers() {
  const getSectionNumber = id => {
    const dfn = document.getElementById(id);
    const sectionNumberEl = dfn.closest("section").querySelector(".secno");
    const secNum = `§${sectionNumberEl.textContent.trim()}`;
    return html`<span class="print-only">${secNum}</span>`;
  };

  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll("#index-defined-here li[data-id]");
  elems.forEach(el => el.append(getSectionNumber(el.dataset.id)));
}

function createExternalTermIndex() {
  const data = collectExternalTerms();
  const dataSortedBySpec = [...data.entries()].sort(([specA], [specB]) =>
    specA.localeCompare(specB)
  );
  return html`<ul class="index">
    ${dataSortedBySpec.map(
      ([spec, entries]) => html`<li data-spec="${spec}">
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

function collectExternalTerms() {
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
  return el;
}

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
  "undefined",
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

/** @param {Document} doc */
function cleanup(doc) {
  doc
    .querySelectorAll("#index-defined-elsewhere li[data-spec]")
    .forEach(el => el.removeAttribute("data-spec"));

  doc
    .querySelectorAll("#index-defined-here li[data-id]")
    .forEach(el => el.removeAttribute("data-id"));
}
