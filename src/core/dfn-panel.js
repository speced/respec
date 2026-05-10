// @ts-check
// Constructs "dfn panels" which show all the local references to a dfn and a
// self link to the selected dfn. Based on Bikeshed's dfn panels at
// https://github.com/tabatkins/bikeshed/blob/ef44162c2e/bikeshed/dfnpanels.py
import css from "../styles/dfn-panel.css.js";
import { fetchBase } from "./text-loader.js";
import { html } from "./import-maps.js";
import { norm } from "./utils.js";

export const name = "core/dfn-panel";

const IDL_TYPES = new Set([
  "attribute",
  "callback",
  "callback interface",
  "constructor",
  "dict-member",
  "dictionary",
  "enum-value",
  "enum",
  "exception",
  "extended-attribute",
  "interface",
  "interface mixin",
  "method",
  "namespace",
  "typedef",
]);

const CDDL_TYPES = new Set(["cddl-type", "cddl-key", "cddl-value"]);

const ELEMENT_TYPES = new Set(["element", "element-attr", "attr-value"]);

export async function run() {
  document.head.insertBefore(
    html`<style>
      ${css}
    </style>`,
    document.querySelector("link")
  );

  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll(
    "dfn[id]:not([data-cite]), #index-defined-elsewhere .index-term"
  );
  const panels = document.createDocumentFragment();
  for (const el of elems) {
    panels.append(createPanel(el));
    // Make it possible to reach el by tabbing,
    // allowing keyboard action as needed.
    el.tabIndex = 0;
    el.setAttribute("aria-haspopup", "dialog");
  }
  const firstScript = document.body.querySelector("script");
  if (firstScript) {
    firstScript.before(panels);
  } else {
    document.body.append(panels);
  }

  const script = document.createElement("script");
  script.id = "respec-dfn-panel";
  script.textContent = await loadScript();
  document.body.append(script);
}

/** @param {HTMLElement} dfn */
function createPanel(dfn) {
  const { id } = dfn;
  const href = dfn.dataset.href || `#${id}`;
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const links = document.querySelectorAll(`a[href="${href}"]:not(.index-term)`);

  const panelId = `dfn-panel-for-${dfn.id}`;
  const definition = dfn.getAttribute("aria-label") || norm(dfn.textContent);
  /** @type {HTMLElement} */
  const panel = html`
    <div
      class="dfn-panel"
      id="${panelId}"
      hidden
      role="dialog"
      aria-modal="true"
      aria-label="Links in this document to definition: ${definition}"
    >
      <span class="caret"></span>
      <div>
        <a
          class="self-link"
          href="${href}"
          aria-label="Permalink for definition: ${definition}. Activate to close this dialog."
          >Permalink</a
        >
        ${dfnExportedMarker(dfn)} ${idlMarker(dfn, links)}
        ${cddlMarker(dfn, links)}
      </div>
      ${linkingSyntaxesToHTML(dfn)}
      <p><b>Referenced in:</b></p>
      ${referencesToHTML(id, links)}
    </div>
  `;
  return panel;
}

/** @param {HTMLElement} dfn */
function dfnExportedMarker(dfn) {
  if (!dfn.matches("dfn[data-export]")) return null;
  return html`<span
    class="marker dfn-exported"
    title="Definition can be referenced by other specifications"
    >exported</span
  >`;
}

/**
 * @param {HTMLElement} dfn
 * @param {NodeListOf<HTMLAnchorElement>} links
 */
function idlMarker(dfn, links) {
  if (!dfn.hasAttribute("data-idl")) return null;

  for (const anchor of links) {
    if (anchor.dataset.linkType !== dfn.dataset.dfnType) continue;
    const parentIdlBlock = anchor.closest("pre.idl");
    if (parentIdlBlock && parentIdlBlock.id) {
      const href = `#${parentIdlBlock.id}`;
      return html`<a
        href="${href}"
        class="marker idl-block"
        title="Jump to IDL declaration"
        >IDL</a
      >`;
    }
  }
  return null;
}

/**
 * @param {HTMLElement} dfn
 * @param {NodeListOf<HTMLAnchorElement>} links
 */
function cddlMarker(dfn, links) {
  const { dfnType } = dfn.dataset;
  if (!dfnType?.startsWith("cddl-")) return null;

  const cddlBlock = [...links]
    .map(a => a.closest("pre.cddl"))
    .find(pre => pre?.id);

  if (!cddlBlock) return null;

  return html`<a
    href="#${cddlBlock.id}"
    class="marker cddl-block"
    title="Jump to CDDL declaration"
    >CDDL</a
  >`;
}

/**
 * Returns the linking syntax string for a term given its dfn-type and dfn-for.
 * @param {string} term
 * @param {string} dfnType
 * @param {string | null} dfnFor
 * @returns {string}
 */
function termToSyntax(term, dfnType, dfnFor) {
  const forPrefix = dfnFor ? `${dfnFor}/` : "";
  if (IDL_TYPES.has(dfnType)) {
    return `{{${forPrefix}${term}}}`;
  }
  if (CDDL_TYPES.has(dfnType)) {
    return `{^${forPrefix}${term}^}`;
  }
  if (ELEMENT_TYPES.has(dfnType)) {
    if ((dfnType === "element-attr" || dfnType === "attr-value") && dfnFor) {
      return `[^${dfnFor}/${term}^]`;
    }
    return `[^${term}^]`;
  }
  if (dfnFor) {
    return `[=${dfnFor}/${term}=]`;
  }
  return `[=${term}=]`;
}

/**
 * Returns the list of possible linking syntax strings for a dfn element.
 * Includes the primary text and any data-lt aliases.
 * @param {HTMLElement} dfn
 * @returns {string[]}
 */
function getLinkingSyntaxes(dfn) {
  const dfnType = dfn.dataset.dfnType || "dfn";
  const forValues = dfn.dataset.dfnFor
    ? dfn.dataset.dfnFor
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
    : [null];
  const primaryTerm = "ltNodefault" in dfn.dataset ? "" : norm(dfn.textContent);
  const ltTerms = dfn.dataset.lt
    ? dfn.dataset.lt.split("|").map(norm).filter(Boolean)
    : [];
  const allTerms = [primaryTerm, ...ltTerms].filter(
    (t, i, arr) => Boolean(t) && arr.indexOf(t) === i
  );
  return allTerms.flatMap(term =>
    forValues.map(forValue => termToSyntax(term, dfnType, forValue))
  );
}

/**
 * Creates a copy-to-clipboard button for a linking syntax string.
 * @param {string} text
 * @returns {HTMLButtonElement}
 */
function createSyntaxCopyButton(text) {
  const button = document.createElement("button");
  button.className = "dfn-panel-copy-btn removeOnSave";
  button.dataset.copyText = text;
  button.setAttribute("aria-label", `Copy ${text} to clipboard`);
  button.title = "Copy to clipboard";
  button.textContent = "⎘";
  return button;
}

/**
 * Renders the "Possible linking syntaxes:" section for a dfn panel.
 * Returns null if the dfn is an index-term (external) or has no syntaxes.
 * @param {HTMLElement} dfn
 * @returns {HTMLElement | null}
 */
function linkingSyntaxesToHTML(dfn) {
  // Only show for local <dfn> elements, not external .index-term spans
  if (!dfn.matches("dfn")) return null;
  const syntaxes = getLinkingSyntaxes(dfn);
  if (!syntaxes.length) return null;

  const ul = document.createElement("ul");
  ul.className = "dfn-panel-lt";
  for (const syntax of syntaxes) {
    const li = document.createElement("li");
    const code = document.createElement("code");
    code.textContent = syntax;
    const copyBtn = createSyntaxCopyButton(syntax);
    li.append(code, " ", copyBtn);
    ul.append(li);
  }

  const b = document.createElement("b");
  b.textContent = "Possible linking syntaxes:";
  const p = document.createElement("p");
  p.append(b);

  const container = document.createElement("div");
  container.append(p, ul);
  return container;
}

/**
 * @param {string} id dfn id
 * @param {NodeListOf<HTMLAnchorElement>} links
 * @returns {HTMLUListElement}
 */
function referencesToHTML(id, links) {
  if (!links.length) {
    return html`<ul class="dfn-panel-refs">
      <li>Not referenced in this document.</li>
    </ul>`;
  }

  /** @type {Map<string, string[]>} */
  const titleToIDs = new Map();
  links.forEach((link, i) => {
    const linkID = link.id || `ref-for-${id}-${i + 1}`;
    if (!link.id) link.id = linkID;
    const title = getReferenceTitle(link) ?? "";
    const ids =
      titleToIDs.get(title) ?? titleToIDs.set(title, []).get(title) ?? [];
    ids.push(linkID);
  });

  /**
   * Returns a list that is easier to render in `listItemToHTML`.
   * @param {[string, string[]]} entry an entry from `titleToIDs`
   * @returns {{ title: string, text: string, id: string, }[]} The first list item contains
   * title from `getReferenceTitle`, rest of items contain strings like `(2)`,
   * `(3)` as title.
   */
  const toLinkProps = ([title, ids]) => {
    return [{ title, id: ids[0], text: title }].concat(
      ids.slice(1).map((id, i) => ({
        title: `Reference ${i + 2}`,
        text: `(${i + 2})`,
        id,
      }))
    );
  };

  /**
   * @param {[string, string[]]} entry
   * @returns {HTMLLIElement}
   */
  const listItemToHTML = entry => {
    return html`<li>
      ${toLinkProps(entry).map(link => {
        return html`<a href="#${link.id}" title="${link.title}">${link.text}</a
          >${" "}`;
      })}
    </li>`;
  };

  return html`<ul class="dfn-panel-refs">
    ${[...titleToIDs].map(listItemToHTML)}
  </ul>`;
}

/** @param {HTMLAnchorElement} link */
function getReferenceTitle(link) {
  const section = link.closest("section");
  if (!section) return null;
  const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
  if (!heading) return null;
  return `§ ${norm(heading.textContent)}`;
}

async function loadScript() {
  try {
    return (await import("text!./dfn-panel.runtime.js")).default;
  } catch {
    return fetchBase("./src/core/dfn-panel.runtime.js");
  }
}
