// @ts-check
/**
 * Module core/clipboard
 *
 * Shared clipboard copy button for code blocks (WebIDL, CDDL, etc.).
 * One delegated click listener serves every button, in the live document and,
 * through an inlined script, in a saved copy of it.
 */
import css from "../styles/clipboard.css.js";
import { getIntlData } from "./utils.js";
import { html } from "./import-maps.js";
import { insertStyle } from "./insert-style.js";
import { sub } from "./pubsubhub.js";

const l10n = getIntlData({
  en: {
    copy: "Copy to clipboard",
    copied: "Copied!",
    failed: "Could not copy!",
  },
  cs: {
    copy: "Kopírovat do schránky",
    copied: "Zkopírováno!",
    failed: "Nelze kopírovat!",
  },
  de: {
    copy: "In die Zwischenablage kopieren",
    copied: "Kopiert!",
    failed: "Kopieren fehlgeschlagen!",
  },
  es: {
    copy: "Copiar al portapapeles",
    copied: "¡Copiado!",
    failed: "¡No se pudo copiar!",
  },
  fr: {
    copy: "Copier dans le presse-papiers",
    copied: "Copié !",
    failed: "Impossible de copier !",
  },
  ja: {
    copy: "クリップボードにコピー",
    copied: "コピーしました",
    failed: "コピーできませんでした",
  },
  ko: { copy: "클립보드에 복사", copied: "복사됨", failed: "복사 실패" },
  nl: {
    copy: "Kopiëren naar klembord",
    copied: "Gekopieerd!",
    failed: "Kopiëren mislukt!",
  },
  zh: { copy: "复制到剪贴板", copied: "已复制", failed: "无法复制" },
});

export const COPY_SVG =
  '<svg aria-hidden="true" height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';

/**
 * Create a copy-to-clipboard button for a code block. The delegated runtime
 * handles its clicks, so the button carries what that runtime needs.
 *
 * @param {string} headerSelector - Selector for the header to exclude from copy
 * @param {string} [title] - Accessible label and tooltip, "Copy to clipboard" in the
 *   document's language by default
 * @returns {HTMLButtonElement}
 */
export function createCopyButton(headerSelector, title = l10n.copy) {
  const button = /** @type {HTMLButtonElement} */ (
    html`<button
      type="button"
      class="respec-button-copy-paste"
      title="${title}"
      aria-label="${title}"
      data-copy-header="${headerSelector}"
      data-copied-label="${l10n.copied}"
      data-failed-label="${l10n.failed}"
    >
      ${{ html: COPY_SVG }}<svg
        class="respec-copy-check"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"
        />
      </svg>
    </button>`
  );
  return button;
}

/**
 * Add the button stylesheet and the copy runtime, and inline the runtime so a
 * saved copy of the document keeps working. Call this once after all copy
 * buttons are created.
 */
export function injectCopyScript() {
  if (document.getElementById("respec-copy-paste")) return;
  insertStyle(css, {
    before: document.querySelector("head link, head > *:last-child"),
  });
  sub("beforesave", resetCopyState);
  copyRuntime();
  const script = document.createElement("script");
  script.id = "respec-copy-paste";
  // ReSpec sets document.respec only while it runs the page, where the call
  // above already installed the listener.
  script.textContent = `if (!document.respec) (${copyRuntime})();`;
  document.body.append(script);
}

/**
 * Remove what the live page added: a confirmation or failure message still
 * showing, and the class that shows the buttons. The saved page's own script
 * sets that class again where the clipboard works, so a saved page with no
 * script keeps its buttons hidden.
 * @param {HTMLElement} documentElement the clone being saved
 */
function resetCopyState(documentElement) {
  documentElement.classList.remove("respec-copy-ready");
  documentElement
    .querySelectorAll(".respec-button-copy-paste")
    .forEach(button => {
      button.removeAttribute("data-copied");
      button.removeAttribute("data-failed");
    });
}

/**
 * Handles every copy click. It runs here, and its source is inlined into saved
 * documents, so it must not reference anything outside its own scope.
 */
function copyRuntime() {
  // Buttons stay hidden until this script shows them, and only on a page with
  // the clipboard API (a saved file served over plain http has none). A page
  // saved by the browser may carry the class from another origin, so set it
  // from what this page has.
  document.documentElement.classList.toggle(
    "respec-copy-ready",
    Boolean(navigator.clipboard)
  );
  let flip = false;

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

  // A page saved by the browser during a confirmation keeps the attribute and
  // the announcement text, but not the timer that would remove them.
  document.querySelectorAll(".respec-button-copy-paste").forEach(button => {
    button.removeAttribute("data-copied");
    button.removeAttribute("data-failed");
  });
  status.textContent = "";

  document.addEventListener("click", event => {
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
    // refused in a cross-origin frame or with the permission denied.
    navigator.clipboard.writeText(text).then(
      () => acknowledge(button, "copied"),
      error => {
        console.warn("Could not write to the clipboard.", error);
        acknowledge(button, "failed");
      }
    );
  });

  /**
   * The text a button copies: its code block, minus the header.
   * @param {HTMLElement} button
   * @returns {string | null}
   */
  function sourceFor(button) {
    const pre = button.closest("pre");
    if (!pre) return null;
    const clone = /** @type {HTMLElement} */ (pre.cloneNode(true));
    const headerSelector = button.dataset.copyHeader;
    if (headerSelector) clone.querySelector(headerSelector)?.remove();
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
    // The attribute's value is the timer that removes it, so a new result
    // replaces any timer still running.
    for (const state of ["copied", "failed"]) {
      clearTimeout(Number(button.dataset[state]));
      delete button.dataset[state];
    }
    button.dataset[outcome] = String(
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
