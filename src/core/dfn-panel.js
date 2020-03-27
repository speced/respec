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
        const dfn = el.closest("dfn, .index-term");
        panel = createPanel(dfn);
        displayPanel(dfn, panel, { x: event.clientX, y: event.clientY });
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
  if (clickTarget.closest("dfn, .index-term")) {
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
  const href = dfn.dataset.href || `#${id}`;
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

  const listItems = [...titleToIDs].map(listItemToHTML);
  return hyperHTML`<ul>${listItems}</ul>`;
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
 * @param {{ x: number, y: number }} clickPosition
 */
function displayPanel(dfn, panel, { x, y }) {
  document.body.appendChild(panel);
  // distance (px) between edge of panel and the pointing triangle (caret)
  const MARGIN = 20;

  const dfnRects = dfn.getClientRects();
  // Find the `top` offset when the `dfn` can be spread across multiple lines
  let closestTop = 0;
  let minDiff = Infinity;
  for (const rect of dfnRects) {
    const { top, bottom } = rect;
    const diffFromClickY = Math.abs((top + bottom) / 2 - y);
    if (diffFromClickY < minDiff) {
      minDiff = diffFromClickY;
      closestTop = top;
    }
  }

  const top = window.scrollY + closestTop + dfnRects[0].height;
  const left = x - MARGIN;
  panel.style.setProperty("--left", `${left}px`);
  panel.style.setProperty("--top", `${top}px`);

  // Find if the panel is flowing out of the window
  const panelRect = panel.getBoundingClientRect();
  const SCREEN_WIDTH = Math.min(window.innerWidth, window.screen.width);
  if (panelRect.right > SCREEN_WIDTH) {
    const newLeft = Math.max(MARGIN, x + MARGIN - panelRect.width);
    const newCaretOffset = left - newLeft;
    panel.style.setProperty("--left", `${newLeft}px`);
    panel.style.setProperty("--caret-offset", `${newCaretOffset}px`);
  }
}

async function loadStyle() {
  try {
    return (await import("text!../../assets/dfn-panel.css")).default;
  } catch {
    return fetchAsset("dfn-panel.css");
  }
}
