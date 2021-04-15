// @ts-check
if (document.respec) {
  document.respec.ready.then(setupPanel);
} else {
  setupPanel();
}

function panelListener() {
  /** @type {HTMLElement} */
  let panel = null;
  return event => {
    const { target: el, type } = event;

    if (!(el instanceof HTMLElement)) return;

    // For keys, we only care about Enter key to activate the panel
    if (type === "keydown" && event.key !== "Enter") return;

    const action =
      type === "keydown"
        ? derivePressAction(event, panel)
        : deriveClickAction(event);

    const coords = deriveCoordinates(event);

    switch (action) {
      case "show": {
        hidePanel(panel);
        /** @type {HTMLElement} */
        const dfn = el.closest("dfn, .index-term");
        panel = document.getElementById(`dfn-panel-for-${dfn.id}`);
        displayPanel(dfn, panel, coords, type);
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
        panel = null;
        break;
      }
    }
  };
}

function deriveCoordinates(event) {
  switch (event.type) {
    case "click":
      return { x: event.clientX, y: event.clientY };
    case "keydown": {
      const rect = event.target.getBoundingClientRect();
      // Offset to the middle of the element
      const x = rect.x + rect.width / 2;
      // Placed at the bottom of the element
      const y = rect.y + rect.height;
      return { x, y };
    }
  }
}

function setupPanel() {
  const listener = panelListener();
  document.body.addEventListener("click", listener);
  document.body.addEventListener("keydown", listener);
}

/**
 *
 * @param {HTMLElement} panel
 * @returns string
 */
function derivePressAction(event, panel) {
  const hitALink = !!event.target.closest("a");
  if (hitALink) return "none";
  if (!panel || panel.hidden) return "show";
  return "hide";
}

function deriveClickAction(event) {
  /** @type {HTMLElement} */
  const target = event.target;
  const hitALink = !!target.closest("a");
  if (target.closest("dfn, .index-term")) {
    return hitALink ? "none" : "show";
  }
  if (target.closest(".dfn-panel")) {
    if (hitALink) {
      return target.classList.contains("self-link") ? "hide" : "dock";
    }
    const panel = target.closest(".dfn-panel");
    return panel.classList.contains("docked") ? "hide" : "none";
  }
  if (document.querySelector(".dfn-panel:not([hidden])")) {
    return "hide";
  }
  return "none";
}

/**
 * @param {HTMLElement} dfn
 * @param {HTMLElement} panel
 * @param {{ x: number, y: number }} clickPosition
 * @param {string} eventType
 */
function displayPanel(dfn, panel, { x, y }, eventType) {
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

  // If we are displaying because of a keydown,
  // we want to trap focus
  if (eventType === "keydown") {
    trapFocus(panel, dfn);
  }
}
/**
 * @param {HTMLElement} panel
 * @param {HTMLElement} dfn
 * @returns
 */
function trapFocus(panel, dfn) {
  /** @type NodeListOf<HTMLAnchorElement> elements */
  const elements = panel.querySelectorAll("a[href]");
  if (!elements.length) return;
  const lastIndex = elements.length - 1;

  let currentIndex = 0;
  const trapListener = function trapListener(event) {
    switch (event.key) {
      // Hitting "Tab" traps us in a nice loop around elements.
      case "Tab": {
        event.preventDefault();
        let nextIndex = currentIndex + (event.shiftKey ? -1 : +1);
        if (nextIndex < 0) {
          nextIndex = lastIndex;
        } else if (nextIndex > lastIndex) {
          nextIndex = 0;
        }
        currentIndex = nextIndex;
        break;
      }

      // Hitting "Enter" on an anchor releases the trap.
      case "Enter":
        if (event.target instanceof HTMLAnchorElement) {
          event.preventDefault();
          panel.removeEventListener("keydown", trapListener);
          window.location = event.target.href;
          hidePanel(panel);
        }
        break;

      // Hitting "Escape" releases the trap and returns focus
      case "Escape":
        panel.removeEventListener("keydown", trapListener);
        hidePanel(panel);
        dfn.focus();
        break;
    }
    elements.item(currentIndex).focus();
  };
  panel.addEventListener("keydown", trapListener);
  const first = elements.item(0);
  first.focus();
}

/** @param {HTMLElement} panel */
function hidePanel(panel) {
  if (!panel) return;
  panel.hidden = true;
  panel.classList.remove("docked");
}
