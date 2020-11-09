// @ts-check
if (document.respec) {
  document.respec.ready.then(dfnPanel);
} else {
  dfnPanel();
}

function dfnPanel() {
  /** @type {HTMLElement} */
  let panel;
  document.body.addEventListener("click", event => {
    if (!(event.target instanceof HTMLElement)) return;

    /** @type {HTMLElement} */
    const el = event.target;

    const action = deriveAction(el);
    switch (action) {
      case "show": {
        if (panel) hidePanel(panel);
        /** @type {HTMLElement} */
        const dfn = el.closest("dfn, .index-term");
        panel = document.getElementById(`dfn-panel-for-${dfn.id}`);
        displayPanel(dfn, panel, { x: event.clientX, y: event.clientY });
        break;
      }
      case "dock": {
        panel.style.left = null;
        panel.style.top = null;
        panel.classList.add("docked");
        break;
      }
      case "hide": {
        hidePanel(panel);
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
  if (clickTarget.closest(".dfn-panel")) {
    if (hitALink) {
      const clickedSelfLink = clickTarget.classList.contains("self-link");
      return clickedSelfLink ? "hide" : "dock";
    }
    const panel = clickTarget.closest(".dfn-panel");
    return panel.classList.contains("docked") ? "hide" : null;
  }
  if (document.querySelector(".dfn-panel:not([hidden])")) {
    return "hide";
  }
  return null;
}

/**
 * @param {HTMLElement} dfn
 * @param {HTMLElement} panel
 * @param {{ x: number, y: number }} clickPosition
 */
function displayPanel(dfn, panel, { x, y }) {
  panel.hidden = false;
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
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;

  // Find if the panel is flowing out of the window
  const panelRect = panel.getBoundingClientRect();
  const SCREEN_WIDTH = Math.min(window.innerWidth, window.screen.width);
  if (panelRect.right > SCREEN_WIDTH) {
    const newLeft = Math.max(MARGIN, x + MARGIN - panelRect.width);
    const newCaretOffset = left - newLeft;
    panel.style.left = `${newLeft}px`;
    /** @type {HTMLElement} */
    const caret = panel.querySelector(".caret");
    caret.style.left = `${newCaretOffset}px`;
  }
}

/** @param {HTMLElement} panel */
function hidePanel(panel) {
  panel.hidden = true;
  panel.classList.remove("docked");
}
