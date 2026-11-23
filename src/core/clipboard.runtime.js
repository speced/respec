// @ts-check
if (typeof document.respec?.ready?.then === "function") {
  document.respec.ready.then(setup);
} else {
  setup();
}

function setup() {
  let flip = false;
  const latestWrite = new WeakMap();
  const confirmed = new WeakSet();
  const timers = new WeakMap();

  // Created up front: a live region that is created and filled in the same
  // click is often not announced. It goes first in the body, so a page saved by
  // the browser holds it before this script runs again.
  if (!document.getElementById("respec-copy-status")) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<span id="respec-copy-status" class="respec-copy-status removeOnSave" role="status"></span>'
    );
  }
  const status = /** @type {HTMLElement} */ (
    document.getElementById("respec-copy-status")
  );

  // A page saved by the browser during a confirmation keeps the attributes and
  // the announcement text, but not the timer that would remove them. This
  // script can run before every button is parsed, so clean again once the page
  // has loaded, leaving the buttons this script has confirmed.
  const clearSavedConfirmations = () => {
    document.querySelectorAll(".respec-button-copy-paste").forEach(button => {
      if (confirmed.has(button)) return;
      button.removeAttribute("data-copied");
      button.removeAttribute("data-failed");
      button.removeAttribute("data-label");
    });
  };
  clearSavedConfirmations();
  document.addEventListener("DOMContentLoaded", clearSavedConfirmations);
  status.textContent = "";

  // Capture phase, so an author's container that stops propagation cannot
  // stop the copy.
  document.addEventListener(
    "click",
    event => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = /** @type {HTMLElement | null} */ (
        target.closest(".respec-button-copy-paste")
      );
      if (!button) return;
      const text = sourceFor(button);
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
    },
    true
  );

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

  /**
   * The text a button copies: its code block, minus the part it says to ignore.
   * @param {HTMLElement} button
   * @returns {string | null}
   */
  function sourceFor(button) {
    const pre = button.closest("pre");
    if (!pre) return null;
    const clone = /** @type {HTMLElement} */ (pre.cloneNode(true));
    const ignoreSelector = button.dataset.copyIgnore;
    if (ignoreSelector) clone.querySelector(ignoreSelector)?.remove();
    return clone.textContent ?? "";
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
      flip = !flip;
      status.textContent = flip ? `${label}\u200B` : label;
    }
    // The label stays on the button after the message ends, so the bubble keeps
    // its text while it fades out.
    button.dataset.label = label;
    confirmed.add(button);
    // A new result replaces the one on show and the timer that would end it.
    clearTimeout(timers.get(button));
    delete button.dataset.copied;
    delete button.dataset.failed;
    button.dataset[outcome] = "";
    timers.set(
      button,
      setTimeout(() => {
        delete button.dataset[outcome];
        // The live region is shared, so another button's message may still be showing.
        if (
          !document.querySelector(
            ".respec-button-copy-paste[data-copied], .respec-button-copy-paste[data-failed]"
          )
        ) {
          status.textContent = "";
        }
      }, 1200)
    );
  }
}
