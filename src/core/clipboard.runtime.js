// @ts-check
if (typeof document.respec?.ready?.then === "function") {
  document.respec.ready.then(setupClipboard);
} else {
  setupClipboard();
}

function setupClipboard() {
  const latestWrite = new WeakMap();
  const timers = new WeakMap();

  // Created up front: a live region that is created and filled in the same
  // click is often not announced. It goes first in the body, so a page the
  // browser saves holds it before this script runs again. ReSpec's own save
  // drops it (removeOnSave), and the saved page's script makes a new one.
  /** @type {HTMLElement} */
  const status =
    document.getElementById("respec-copy-status") ?? createStatus();

  // A page saved by the browser during a confirmation keeps the attributes and
  // the announcement text, but not the timer that would remove them. In a saved
  // page this script runs while the page is still loading, before every button
  // is parsed, so clean again once the page has loaded, leaving the buttons
  // this script has confirmed.
  const clearSavedConfirmations = () => {
    document.querySelectorAll(".respec-button-copy-paste").forEach(button => {
      if (timers.has(button)) return;
      button.removeAttribute("data-copy-state");
      button.removeAttribute("data-label");
    });
  };
  clearSavedConfirmations();
  document.addEventListener("DOMContentLoaded", clearSavedConfirmations);
  status.textContent = "";

  // Capture phase, so an author's container that stops propagation cannot
  // stop the copy.
  document.addEventListener("click", onClick, true);

  // Last, so the buttons show only once the listener is in place, and only on
  // a page with the clipboard API (a saved file served over plain http has
  // none). An adopted style sheet is not saved with the page, so a saved copy
  // shows its buttons only while its own script runs. A browser without
  // adopted style sheets gets a style element that ReSpec drops when it saves.
  if (navigator.clipboard) {
    const rule =
      "@media not print { .respec-button-copy-paste { display: grid; } }";
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(rule);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    } catch {
      const style = document.createElement("style");
      style.className = "removeOnSave";
      document.head.append(style);
      // Inserted through the style sheet, so the rule is not in the markup that
      // a browser saves.
      style.sheet?.insertRule(rule);
    }
  }

  /** The span is written with its role before it enters the page, so it is announced. */
  function createStatus() {
    const span = document.createElement("span");
    span.id = "respec-copy-status";
    span.className = "respec-visually-hidden removeOnSave";
    span.setAttribute("role", "status");
    document.body.prepend(span);
    return span;
  }

  /** @param {MouseEvent} event */
  function onClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = /** @type {HTMLElement | null} */ (
      target.closest(".respec-button-copy-paste")
    );
    if (!button) return;
    const text = getCopyText(button);
    if (text === null) return;
    if (!navigator.clipboard) {
      console.warn(
        "Copying needs a secure page, such as one served over https."
      );
      return;
    }
    // Claim a copy only once the clipboard has taken the text. A write is
    // refused in a cross-origin frame or with the permission denied. Two
    // clicks can leave writes pending together, and only the newest reports.
    const write = (latestWrite.get(button) ?? 0) + 1;
    latestWrite.set(button, write);
    navigator.clipboard.writeText(text).then(
      () => {
        if (latestWrite.get(button) === write) acknowledge(button, "copied");
      },
      error => {
        console.warn("Could not write to the clipboard.", error);
        if (latestWrite.get(button) === write) acknowledge(button, "failed");
      }
    );
  }

  /**
   * The text a button copies: the source stored on its container when it has
   * one, otherwise its code block minus the part it says to ignore.
   * @param {HTMLElement} button
   * @returns {string | null}
   */
  function getCopyText(button) {
    const containerSelector = button.dataset.copyContainer;
    const container = containerSelector
      ? button.closest(containerSelector)
      : null;
    if (container instanceof HTMLElement && container.dataset.diagramSource) {
      return container.dataset.diagramSource;
    }
    const pre = button.closest("pre");
    if (!pre) return null;
    const clone = /** @type {HTMLElement} */ (pre.cloneNode(true));
    const ignoreSelector = button.dataset.copyIgnore;
    if (ignoreSelector) clone.querySelector(ignoreSelector)?.remove();
    return clone.textContent;
  }

  /**
   * Announce an outcome and show it on the button for a moment.
   * @param {HTMLElement} button
   * @param {"copied" | "failed"} outcome
   */
  function acknowledge(button, outcome) {
    const label =
      (outcome === "copied"
        ? button.dataset.copiedLabel
        : button.dataset.failedLabel) || "";
    if (typeof button.ariaNotify === "function") {
      button.ariaNotify(label);
    } else {
      // A live region ignores an unchanged string, so alternate a zero-width space.
      status.textContent =
        status.textContent === label ? `${label}\u200B` : label;
    }
    // The label stays on the button after the message ends, so the bubble keeps
    // its text while it fades out.
    button.dataset.label = label;
    // A new result replaces the one on show and the timer that would end it.
    clearTimeout(timers.get(button));
    button.dataset.copyState = outcome;
    timers.set(
      button,
      setTimeout(() => {
        delete button.dataset.copyState;
        // The live region is shared, so another button's message may still be showing.
        if (
          !document.querySelector(".respec-button-copy-paste[data-copy-state]")
        ) {
          status.textContent = "";
        }
      }, 1200)
    );
  }
}
