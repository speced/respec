// Constructs "dfn panels" which show all the local references to a dfn and a
// self link to the selected dfn. Based on Bikeshed's dfn panels at
// https://github.com/tabatkins/bikeshed/blob/ef44162c2e/bikeshed/dfnpanels.py
import { fetchAsset } from "./text-loader.js";
import { hyperHTML } from "./import-maps.js";
import { norm } from "./utils.js";

export const name = "core/dfn-panel";

export async function run() {
  const css = await loadStyle();
  document.head.insertBefore(
    hyperHTML`<style>${css}</style>`,
    document.querySelector("link")
  );

  /** @type {HTMLElement} */
  let panel;
  document.body.addEventListener("click", event => {
    /** @type {HTMLElement} */
    const el = event.target;

    const action = deriveAction(el);
    switch (action) {
      case "show": {
        if (panel) panel.remove();
        const dfn = el.closest("dfn");
        panel = createPanel(dfn);
        displayPanel(dfn, panel);
        break;
      }
      case "dock": {
        panel.classList.add("docked");
        break;
      }
      case "hide": {
        panel.remove();
        break;
      }
    }
  });
}

/** @param {HTMLElement} clickTarget */
function deriveAction(clickTarget) {
  const hitALink = !!clickTarget.closest("a");
  if (clickTarget.closest("dfn")) {
    return hitALink ? null : "show";
  }
  if (clickTarget.closest("#dfn-panel")) {
    if (hitALink) {
      const clickedSelfLink = clickTarget.classList.contains("self-link");
      return clickedSelfLink ? "hide" : "dock";
    }
    const panel = clickTarget.closest("#dfn-panel");
    return panel.classList.contains("docked") ? "hide" : null;
  }
  if (document.getElementById("dfn-panel")) {
    return "hide";
  }
  return null;
}

/** @param {HTMLElement} dfn */
function createPanel(dfn) {
  const { id } = dfn;
  const href = `#${id}`;
  const links = document.querySelectorAll(`a[href="${href}"]`);

  /** @type {HTMLElement} */
  const panel = hyperHTML`
    <aside class="dfn-panel" id="dfn-panel">
      <b><a class="self-link" href="${href}">Permalink</a></b>
      <b>Referenced in:</b>
      ${referencesToHTML(id, links)}
    </aside>
  `;
  return panel;
}

/**
 * @param {string} id dfn id
 * @param {NodeListOf<HTMLLinkElement>} links
 * @returns {HTMLUListElement}
 */
function referencesToHTML(id, links) {
  if (!links.length) {
    return hyperHTML`<ul><li>Not referenced in this document.</li></ul>`;
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
  const listItemToHTML = entry =>
    hyperHTML`<li>${toLinkProps(entry).map(
      link => hyperHTML`<a href="#${link.id}">${link.title}</a>${" "}`
    )}</li>`;

  return hyperHTML`<ul>${[...titleToIDs.entries()].map(listItemToHTML)}</ul>`;
}

/** @param {HTMLAnchorElement} link */
function getReferenceTitle(link) {
  const section = link.closest("section");
  if (!section) return null;
  const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
  if (!heading) return null;
  return norm(heading.textContent);
}

/**
 * @param {HTMLElement} dfn
 * @param {HTMLElement} panel
 */
function displayPanel(dfn, panel) {
  document.body.appendChild(panel);

  const dfnRect = dfn.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const panelWidth = panelRect.right - panelRect.left;

  let top = window.scrollY + dfnRect.top;
  let left = dfnRect.left + dfnRect.width + 5;
  if (left + panelWidth > document.body.scrollWidth) {
    // Reposition, because the panel is overflowing
    left = dfnRect.left - (panelWidth + 5);
    if (left < 0) {
      left = dfnRect.left;
      top += dfnRect.height;
    }
  }

  // Allows ".docked" rule to override the position, unlike `style.left = left`.
  panel.style.setProperty("--left", `${left}px`);
  panel.style.setProperty("--top", `${top}px`);
}

async function loadStyle() {
  try {
    return (await import("text!../../assets/dfn-panel.css")).default;
  } catch {
    return fetchAsset("dfn-panel.css");
  }
}
