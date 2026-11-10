// @ts-check
// Constructs "dfn panels" which show all the local references to a dfn and a
// self link to the selected dfn. Based on Bikeshed's dfn panels at
// https://github.com/tabatkins/bikeshed/blob/ef44162c2e/bikeshed/dfnpanels.py
import { getDfnTitles, norm } from "./utils.js";
import { COPY_SVG } from "./clipboard.js";
import css from "../styles/dfn-panel.css.js";
import { fetchBase } from "./text-loader.js";
import { html } from "./import-maps.js";
import { insertStyle } from "./insert-style.js";

export const name = "core/dfn-panel";

const COPY_ICON_ID = "respec-dfn-panel-copy-icon";

export async function run() {
  insertStyle(css, { before: document.querySelector("link") });

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
  if (panels.querySelector(".dfn-panel-copy-btn")) {
    panels.append(createCopyIconSprite());
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
      aria-label="Details for definition: ${definition}"
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
      <p><b>Referenced in:</b></p>
      ${referencesToHTML(id, links)} ${linkingSyntaxesToHTML(dfn)}
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
 * Renders the "Possible linking syntaxes:" section for a dfn panel.
 * Returns null if the dfn is not exported, is an index-term (external), or has
 * no syntaxes.
 * @param {HTMLElement} dfn
 */
function linkingSyntaxesToHTML(dfn) {
  // Only exported definitions list syntaxes. Skips external .index-term spans.
  if (!dfn.matches("dfn[data-export]")) return null;
  const syntaxes = getLinkingSyntaxes(dfn);
  if (!syntaxes.length) return null;

  const headingId = `dfn-panel-lt-heading-${dfn.id}`;
  // No wrapper element: `.dfn-panel > div` is a flex row, so a wrapping div
  // would lay the heading and the list out side by side.
  return html`<p><b id="${headingId}">Possible linking syntaxes:</b></p>
    <ul class="dfn-panel-lt" aria-labelledby="${headingId}">
      ${syntaxes.map(
        syntax => html`<li>${createSyntaxCopyButton(syntax)}</li>`
      )}
    </ul>`;
}

/**
 * Returns the list of possible linking syntax strings for a dfn element.
 * Includes its text and its data-lt and data-local-lt aliases.
 * @param {HTMLElement} dfn
 * @returns {string[]}
 */
function getLinkingSyntaxes(dfn) {
  // No inline syntax links to an overload after the first (`!overload-N`).
  if (/!overload-/.test(dfn.dataset.lt ?? "")) return [];
  const dfnType = dfn.dataset.dfnType || "dfn";
  const forNames =
    dfn.dataset.dfnFor
      ?.split(",")
      .map(s => s.trim())
      .filter(Boolean) ?? [];
  const forValues = forNames.length ? forNames : [null];
  // getDfnTitles lists the data-lt aliases first. List the dfn's own text first.
  const text = norm(dfn.textContent);
  return getDfnTitles(dfn)
    .sort((a, b) => Number(b === text) - Number(a === text))
    .flatMap(term =>
      forValues.map(forValue => termToSyntax(term, dfnType, forValue))
    )
    .filter(Boolean);
}

const IDL_TYPES = new Set([
  "attribute",
  "callback",
  "const",
  "constructor",
  "dict-member",
  "dictionary",
  "enum-value",
  "enum",
  "exception",
  "extended-attribute",
  "interface",
  "method",
  "namespace",
  "typedef",
]);

const CDDL_TYPES = new Set(["cddl-type", "cddl-key", "cddl-value"]);

const CONCEPT_TYPES = new Set(["dfn", "abstract-op"]);

/**
 * Returns the linking syntax string for a term given its dfn-type and dfn-for,
 * or an empty string when no inline syntax links to that definition.
 * @param {string} term
 * @param {string} dfnType
 * @param {string | null} dfnFor
 * @returns {string}
 */
function termToSyntax(term, dfnType, dfnFor) {
  const forPrefix = dfnFor ? `${dfnFor}/` : "";
  if (CONCEPT_TYPES.has(dfnType)) {
    return `[=${forPrefix}${term.replaceAll("/", "\\/")}=]`;
  }
  if (CDDL_TYPES.has(dfnType)) {
    // The quotes of a CDDL value keep a "/" from separating a type and a member.
    return term.includes("/") && !term.startsWith('"')
      ? ""
      : `{^${forPrefix}${term}^}`;
  }
  // Only [= =] can escape a "/". The other syntaxes read it as a separator.
  if (term.includes("/")) return "";
  if (IDL_TYPES.has(dfnType)) {
    // ReSpec adds an `Interface.member` alias. After a for, it renders garbled.
    if (dfnFor && term.startsWith(`${dfnFor}.`)) return "";
    // The empty string is already written as "".
    const name = dfnType === "enum-value" && term !== '""' ? `"${term}"` : term;
    return `{{${forPrefix}${name}}}`;
  }
  switch (dfnType) {
    case "element":
      return dfnFor ? "" : `[^${term}^]`;
    case "element-attr":
      // A global attribute has no element: [^/role^]
      return `[^${forPrefix || "/"}${term}^]`;
    case "attr-value":
      return dfnFor ? `[^${forPrefix}${term}^]` : "";
    default:
      // Types like event and http-header have no shorthand.
      return "";
  }
}

/**
 * Creates the button for one row of the syntax list. The button holds the
 * syntax, so its name reads "Copy" plus the syntax. The runtime script copies
 * the text of the `code` inside the clicked button.
 * @param {string} syntax
 */
function createSyntaxCopyButton(syntax) {
  const button = html`<button type="button" class="dfn-panel-copy-btn">
    <span class="visually-hidden">Copy </span><code>${syntax}</code>
  </button>`;
  button.insertAdjacentHTML(
    "beforeend",
    `<svg aria-hidden="true" viewBox="0 0 14 16"><use href="#${COPY_ICON_ID}"></use></svg>`
  );
  return button;
}

/**
 * Puts the copy icon on the page once, as a symbol. Every button points at it
 * with `<use>`, so the icon is not repeated for each row.
 */
function createCopyIconSprite() {
  const template = document.createElement("template");
  template.innerHTML = COPY_SVG;
  const icon = /** @type {SVGElement} */ (template.content.firstElementChild);
  const svgNamespace = "http://www.w3.org/2000/svg";
  const symbol = document.createElementNS(svgNamespace, "symbol");
  symbol.id = COPY_ICON_ID;
  symbol.setAttribute("viewBox", icon.getAttribute("viewBox") ?? "");
  symbol.append(...icon.childNodes);
  const sprite = document.createElementNS(svgNamespace, "svg");
  sprite.setAttribute("class", "dfn-panel-sprite");
  sprite.setAttribute("aria-hidden", "true");
  sprite.setAttribute("focusable", "false");
  sprite.append(symbol);
  return sprite;
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
