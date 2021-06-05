// @ts-check
if (document.respec) {
  document.respec.ready.then(setupPanel);
} else {
  setupPanel();
}

function setupPanel() {
  const listener = panelListener();
  document.body.addEventListener("keydown", listener);
  document.body.addEventListener("click", listener);
}

function panelListener() {
  /** @type {HTMLElement} */
  let panel = null;
  return event => {
    const { target, type } = event;

    if (!(target instanceof HTMLElement)) return;

    // For keys, we only care about Enter key to activate the panel
    // otherwise it's activated via a click.
    if (type === "keydown" && event.key !== "Enter") return;

    const action = deriveAction(event);

    switch (action) {
      case "show": {
        hidePanel(panel);
        /** @type {HTMLElement} */
        const dfn = target.closest("dfn, .index-term");
        panel = document.getElementById(`dfn-panel-for-${dfn.id}`);
        const coords = deriveCoordinates(event);
        displayPanel(dfn, panel, coords);
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

/**
 * @param {MouseEvent|KeyboardEvent} event
 */
function deriveCoordinates(event) {
  const target = /** @type HTMLElement */ (event.target);

  // We prevent synthetic AT clicks from putting
  // the dialog in a weird place. The AT events sometimes
  // lack coordinates, so they have clientX/Y = 0
  const rect = target.getBoundingClientRect();
  if (
    event instanceof MouseEvent &&
    event.clientX >= rect.left &&
    event.clientY >= rect.top
  ) {
    // The event probably happened inside the bounding rect...
    return { x: event.clientX, y: event.clientY };
  }

  // Offset to the middle of the element
  const x = rect.x + rect.width / 2;
  // Placed at the bottom of the element
  const y = rect.y + rect.height;
  return { x, y };
}

/**
 * @param {Event} event
 */
function deriveAction(event) {
  const target = /** @type {HTMLElement} */ (event.target);
  const hitALink = !!target.closest("a");
  if (target.closest("dfn:not([data-cite]), .index-term")) {
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

  // As it's a dialog, we trap focus.
  // TODO: when <dialog> becomes a implemented, we should really
  // use that.
  trapFocus(panel, dfn);
}

/**
 * @param {HTMLElement} panel
 * @param {HTMLElement} dfn
 * @returns
 */
function trapFocus(panel, dfn) {
  /** @type NodeListOf<HTMLAnchorElement> elements */
  const anchors = panel.querySelectorAll("a[href]");
  // No need to trap focus
  if (!anchors.length) return;

  // Move focus to first anchor element
  const first = anchors.item(0);
  first.focus();

  const trapListener = createTrapListener(anchors, panel, dfn);
  panel.addEventListener("keydown", trapListener);

  // Hiding the panel releases the trap
  const mo = new MutationObserver(records => {
    const [record] = records;
    const target = /** @type HTMLElement */ (record.target);
    if (target.hidden) {
      panel.removeEventListener("keydown", trapListener);
      mo.disconnect();
    }
  });
  mo.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
}

/**
 *
 * @param {NodeListOf<HTMLAnchorElement>} anchors
 * @param {HTMLElement} panel
 * @param {HTMLElement} dfn
 * @returns
 */
function createTrapListener(anchors, panel, dfn) {
  const lastIndex = anchors.length - 1;
  let currentIndex = 0;
  return event => {
    switch (event.key) {
      // Hitting "Tab" traps us in a nice loop around elements.
      case "Tab": {
        event.preventDefault();
        currentIndex += event.shiftKey ? -1 : +1;
        if (currentIndex < 0) {
          currentIndex = lastIndex;
        } else if (currentIndex > lastIndex) {
          currentIndex = 0;
        }
        anchors.item(currentIndex).focus();
        break;
      }

      // Hitting "Enter" on an anchor releases the trap.
      case "Enter":
        hidePanel(panel);
        break;

      // Hitting "Escape" returns focus to dfn.
      case "Escape":
        hidePanel(panel);
        dfn.focus();
        return;
    }
  };
}

/** @param {HTMLElement} panel */
function hidePanel(panel) {
  if (!panel) return;
  panel.hidden = true;
  panel.classList.remove("docked");
}
