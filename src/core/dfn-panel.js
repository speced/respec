// @ts-check
// Constructs "dfn panels" which show all the local references to a dfn and a
// self link to the selected dfn. Based on Bikeshed's dfn panels at
// https://github.com/tabatkins/bikeshed/blob/ef44162c2e/bikeshed/dfnpanels.py
import { fetchAsset, fetchBase } from "./text-loader.js";
import { html } from "./import-maps.js";
import { norm } from "./utils.js";

export const name = "core/dfn-panel";

export async function run() {
  const css = await loadStyle();
  document.head.insertBefore(
    html`<style>
      ${css}
    </style>`,
    document.querySelector("link")
  );

  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll(
    "dfn[id], #index-defined-elsewhere .index-term"
  );
  const panels = document.createDocumentFragment();
  for (const el of elems) {
    panels.append(createPanel(el));
  }
  document.body.append(panels);

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
  /** @type {HTMLElement} */
  const panel = html`
    <aside class="dfn-panel" id="${panelId}" hidden>
      <span class="caret"></span>
      <div>
        <a class="self-link" href="${href}">Permalink</a>
        ${dfnExportedMarker(dfn)} ${idlMarker(dfn, links)}
      </div>
      <b>Referenced in:</b>
      ${referencesToHTML(id, links)}
    </aside>
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
 * @param {string} id dfn id
 * @param {NodeListOf<HTMLAnchorElement>} links
 * @returns {HTMLUListElement}
 */
function referencesToHTML(id, links) {
  if (!links.length) {
    return html`<ul>
      <li>Not referenced in this document.</li>
    </ul>`;
  }

  /** @type {Map<string, string[]>} */
  const titleToIDs = new Map();
  links.forEach((link, i) => {
    const linkID = link.id || `ref-for-${id}-${i + 1}`;
    if (!link.id) link.id = linkID;
    const title = getReferenceTitle(link);
    const ids = titleToIDs.get(title) || titleToIDs.set(title, []).get(title);
    ids.push(linkID);
  });

  /**
   * Returns a list that is easier to render in `listItemToHTML`.
   * @param {[string, string[]]} entry an entry from `titleToIDs`
   * @returns {{ title: string, id: string }[]} The first list item contains
   * title from `getReferenceTitle`, rest of items contain strings like `(2)`,
   * `(3)` as title.
   */
  const toLinkProps = ([title, ids]) => {
    return [{ title, id: ids[0] }].concat(
      ids.slice(1).map((id, i) => ({ title: `(${i + 2})`, id }))
    );
  };

  /**
   * @param {[string, string[]]} entry
   * @returns {HTMLLIElement}
   */
  const listItemToHTML = entry => html`<li>
    ${toLinkProps(entry).map(
      link => html`<a href="#${link.id}">${link.title}</a>${" "}`
    )}
  </li>`;

  return html`<ul>
    ${[...titleToIDs].map(listItemToHTML)}
  </ul>`;
}

/** @param {HTMLAnchorElement} link */
function getReferenceTitle(link) {
  const section = link.closest("section");
  if (!section) return null;
  const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
  if (!heading) return null;
  return norm(heading.textContent);
}

async function loadStyle() {
  try {
    return (await import("text!../../assets/dfn-panel.css")).default;
  } catch {
    return fetchAsset("dfn-panel.css");
  }
}

async function loadScript() {
  try {
    return (await import("text!./dfn-panel.runtime.js")).default;
  } catch {
    return fetchBase("./src/core/dfn-panel.runtime.js");
  }
}
