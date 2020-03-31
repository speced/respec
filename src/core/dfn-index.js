// @ts-check
/**
 * If a `<section id="index">` exists, it is filled by a list of terms defined
 * (locally) by current document and a list of terms referenced (external) by
 * current document.
 */

import { addId, getIntlData, norm } from "./utils.js";
import { citeDetailsConverter } from "./data-cite.js";
import { fetchAsset } from "./text-loader.js";
import { getTermFromElement } from "./xref.js";
import { html } from "./import-maps.js";
import { renderInlineCitation } from "./render-biblio.js";
import { sub } from "./pubsubhub.js";

export const name = "core/dfn-index";

const localizationStrings = {
  en: {
    heading: "Index",
    headingExternal: "Terms defined by reference",
    headlingLocal: "Terms defined by this specification",
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
    index.prepend(html`<h2>${l10n.heading}</h2>`);
  }

  const toCiteDetails = citeDetailsConverter(conf);

  const localTermIndex = html`<section id="index-defined-here">
    <h3>${l10n.headlingLocal}</h3>
    ${createLocalTermIndex()}
  </section>`;
  index.append(localTermIndex);

  const externalTermIndex = html`<section id="index-defined-elsewhere">
    <h3>${l10n.headingExternal}</h3>
    ${createExternalTermIndex(toCiteDetails)}
  </section>`;
  index.append(externalTermIndex);

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

  /** @param {string} a @param {string} b */
  const sortByTerm = (a, b) => {
    a = a.slice(a.search(/\w/));
    b = b.slice(b.search(/\w/));
    return a.localeCompare(b);
  };
  const dataSortedByTerm = [...data].sort(([termA], [termB]) =>
    sortByTerm(termA, termB)
  );

  return dataSortedByTerm;
}

/**
 * @param {string} term
 * @param {HTMLElement[]} dfns
 * @returns {HTMLLIElement}
 */
function renderLocalTerm(term, dfns) {
  // /** @param {HTMLElement`} dfn */
  // const getSectionNumber = dfn => {
  //   const sectionNumberEl = dfn.closest("section").querySelector(".secno");
  //   const sectionNumber = sectionNumberEl.textContent.trim();
  //   return `<span class="print-only">§${sectionNumber}</span>`;
  // };

  const renderItem = (dfn, text, suffix) => {
    const href = `#${dfn.id}`;
    return html`<li>
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
        const text = getLocalTermSuffix(dfn, type, term) || "definition of";
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

/**
 * @param {ReturnType<typeof citeDetailsConverter>} toCiteDetails
 */
function createExternalTermIndex(toCiteDetails) {
  const data = collectExternalTerms(toCiteDetails);
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

/** @param {Document} doc */
function cleanup(doc) {
  doc
    .querySelectorAll("#index-defined-elsewhere li[data-spec]")
    .forEach(el => el.removeAttribute("data-spec"));
}
