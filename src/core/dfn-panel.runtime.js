// @ts-check
if (document.respecIsReady) {
  document.respecIsReady.then(() => dfnPanel());
} else {
  dfnPanel();
}

function dfnPanel() {
  /** @type {HTMLElement} */
  let panel;
  document.body.addEventListener("click", event => {
    const el = /** @type {HTMLElement} */ (event.target);

    const action = deriveAction(el);
    switch (action) {
      case "show": {
        if (panel) panel.remove();
        /** @type {HTMLElement} */
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
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const links = document.querySelectorAll(`a[href="${href}"]:not(.index-term)`);

  const tempNode = document.createElement("div");
  tempNode.innerHTML = `
    <aside class="dfn-panel" id="dfn-panel">
      <b><a class="self-link" href="${href}">Permalink</a></b>
      <b>Referenced in:</b>
      ${referencesToHTML(id, links)}
    </aside>
  `;
  return tempNode.querySelector("aside");
}

/**
 * @param {string} id dfn id
 * @param {NodeListOf<HTMLAnchorElement>} links
 * @returns {string}
 */
function referencesToHTML(id, links) {
  if (!links.length) {
    return `<ul><li>Not referenced in this document.</li></ul>`;
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
   * @returns {string}
   */
  const listItemToHTML = entry =>
    `<li>${toLinkProps(entry)
      .map(link => `<a href="#${link.id}">${link.title}</a>${" "}`)
      .join("")}</li>`;

  const listItems = [...titleToIDs].map(listItemToHTML);
  return `<ul>${listItems.join("")}</ul>`;
}

/** @param {HTMLAnchorElement} link */
function getReferenceTitle(link) {
  const section = link.closest("section");
  if (!section) return null;
  /** @type {HTMLElement} */
  const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
  if (!heading) return null;
  return heading.innerText.trim();
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
