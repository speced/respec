// @ts-check
/**
 * Module core/clipboard
 *
 * Shared clipboard copy button for code blocks (WebIDL, CDDL, diagrams).
 * One delegated listener handles every button. The same runtime is also inlined
 * into the page for saved copies of the document, though the buttons themselves
 * are currently marked removeOnSave and stripped by core/exporter.
 */

import { getIntlData } from "./utils.js";

// Callers that already have a localized label pass it in (core/diagrams does);
// this is the label for callers that do not.
const localizationStrings = {
  en: {
    copy_to_clipboard: "Copy to clipboard",
    copied: "Copied!",
  },
  cs: {
    copy_to_clipboard: "Kopírovat do schránky",
    copied: "Zkopírováno!",
  },
  de: {
    copy_to_clipboard: "In Zwischenablage kopieren",
    copied: "Kopiert!",
  },
  es: {
    copy_to_clipboard: "Copiar al portapapeles",
    copied: "¡Copiado!",
  },
  fr: {
    copy_to_clipboard: "Copier dans le presse-papiers",
    copied: "Copié !",
  },
  ja: {
    copy_to_clipboard: "クリップボードにコピー",
    copied: "コピーしました",
  },
  ko: {
    copy_to_clipboard: "클립보드에 복사",
    copied: "복사됨",
  },
  nl: {
    copy_to_clipboard: "Kopiëren naar klembord",
    copied: "Gekopieerd!",
  },
  zh: {
    copy_to_clipboard: "复制到剪贴板",
    copied: "已复制",
  },
};

const l10n = getIntlData(localizationStrings);

// currentColor, so the icon follows the button's own color. Hard black is
// invisible on the diagram toolbar in dark mode, where the button is #2d2d2d.
const COPY_SVG =
  '<svg height="16" viewBox="0 0 14 16" width="14"><path fill="currentColor" fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';

// Shown instead of COPY_SVG while the button is in its copied state. Both live
// in the button so the export-time runtime script only has to toggle a class.
// The check's color comes from CSS, not from the button's inherited color.
const CHECK_SVG =
  '<svg class="respec-copy-check" height="16" viewBox="0 0 16 16" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>';

/** How long the check and the "Copied!" popover stay up. */
const COPIED_MS = 2000;

/** Anchor name the popover positions itself against. */
const ANCHOR = "--respec-copy-anchor";

/** Invisible and unspoken: alternated so a repeat copy is announced again. */
const ZWSP = "\u200B";

/**
 * Everything that happens on a copy click, in one self-contained function so it
 * can run here and be serialized verbatim into exported documents. It takes its
 * constants as arguments and touches nothing outside its own scope, because the
 * serialized copy has no module around it. One delegated listener, so buttons
 * created at any point in the run are covered and order never matters.
 *
 * @param {{ copiedMs: number, anchor: string, zwsp: string }} config
 */
function copyRuntime({ copiedMs, anchor, zwsp }) {
  // Popover without anchor positioning would land mid-viewport, so an older
  // browser opening a saved spec gets the check on its own. Computed once.
  const canAnchor =
    "showPopover" in HTMLElement.prototype &&
    CSS.supports(`position-anchor: ${anchor}`);
  /** @type {HTMLElement | null} */
  let current = null;
  let flip = false;

  /** @param {string} label Empty clears it, so it is not read out of context. */
  function announce(label) {
    let announcer = document.getElementById("respec-copy-status");
    if (!announcer) {
      if (!label) return;
      announcer = document.createElement("span");
      announcer.id = "respec-copy-status";
      announcer.setAttribute("role", "status");
      announcer.setAttribute("aria-live", "polite");
      announcer.className = "respec-copy-status removeOnSave";
      document.body.append(announcer);
    }
    // A live region ignores an unchanged string, so alternate an invisible,
    // unspoken zero-width space; otherwise a repeat copy is never announced.
    flip = !flip;
    announcer.textContent = label && flip ? label + zwsp : label;
  }

  /**
   * @param {HTMLElement} button
   * @param {string} label
   */
  function showToast(button, label) {
    if (!canAnchor) return;
    let toast = document.getElementById("respec-copy-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "respec-copy-toast";
      toast.className = "respec-copy-toast removeOnSave";
      toast.setAttribute("popover", "manual");
      // The live region does the announcing; this is the visible half.
      toast.setAttribute("aria-hidden", "true");
      document.body.append(toast);
    }
    toast.textContent = label;
    button.style.setProperty("anchor-name", anchor);
    if (!toast.matches(":popover-open")) toast.showPopover();
  }

  function hideToast() {
    const toast = document.getElementById("respec-copy-toast");
    if (!toast) return;
    if (toast.matches(":popover-open")) toast.hidePopover();
    toast.textContent = "";
  }

  /**
   * Swap in the check, show the popover beside the button, announce it. The
   * popover is in the top layer, so no ancestor's overflow, border radius or 3D
   * transform can clip it, and anchor positioning needs no coordinate maths.
   * @param {HTMLElement} button
   */
  function ack(button) {
    const label = button.dataset.copiedLabel || "";
    // Only one acknowledgement is on screen at a time.
    if (current) current.style.removeProperty("anchor-name");
    current = button;
    announce(label);
    button.classList.add("respec-copied");
    showToast(button, label);
    clearTimeout(Number(button.dataset.copiedTimer));
    button.dataset.copiedTimer = String(
      setTimeout(() => {
        button.classList.remove("respec-copied");
        // A later copy owns the popover and the announcement now: leave them.
        if (current !== button) return;
        current = null;
        button.style.removeProperty("anchor-name");
        announce("");
        hideToast();
      }, copiedMs)
    );
  }

  /**
   * The text a button copies: a diagram's stashed source, or the code block
   * minus its header.
   * @param {HTMLElement} button
   * @returns {string | null}
   */
  function sourceFor(button) {
    const containerSelector = button.dataset.copyContainer;
    const container = containerSelector
      ? button.closest(containerSelector)
      : null;
    if (container instanceof HTMLElement && container.dataset.diagramSource) {
      return container.dataset.diagramSource;
    }
    const pre = container
      ? container.querySelector("pre")
      : button.closest("pre");
    if (!pre) return null;
    const clone = /** @type {HTMLElement} */ (pre.cloneNode(true));
    const headerSelector = button.dataset.copyHeader;
    if (headerSelector) clone.querySelector(headerSelector)?.remove();
    return clone.textContent || "";
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = /** @type {HTMLElement | null} */ (
      target.closest(".respec-button-copy-paste")
    );
    if (!button) return;
    const text = sourceFor(button);
    if (text === null) return;
    // Only acknowledge once the clipboard has actually taken the text: writes
    // are refused in a cross-origin frame or with the permission denied, and
    // claiming a copy that did not happen is worse than silence.
    navigator.clipboard.writeText(text).then(
      () => {
        ack(button);
      },
      error => {
        console.warn("Could not write to the clipboard.", error);
      }
    );
  });
}

/**
 * Create a copy-to-clipboard button for a code block. Clicks are handled by the
 * delegated runtime, in both the live document and a saved export, so the
 * button carries what that runtime needs in data attributes.
 *
 * @param {string} headerSelector - Selector for the header to exclude from copy
 * @param {string} [title] - Accessible label and tooltip
 * @param {string} [containerSelector] - Ancestor selector to find the <pre> within
 * @returns {HTMLButtonElement}
 */
export function createCopyButton(
  headerSelector,
  title = l10n.copy_to_clipboard,
  containerSelector
) {
  const button = document.createElement("button");
  button.innerHTML = `${COPY_SVG}${CHECK_SVG}`;
  button.title = title;
  button.setAttribute("aria-label", title);
  // Deliberately not removeOnSave: a saved spec keeps its copy buttons, and the
  // inlined runtime is what makes them work there.
  button.classList.add("respec-button-copy-paste");
  button.dataset.copyHeader = headerSelector;
  button.dataset.copiedLabel = l10n.copied;
  if (containerSelector) {
    button.dataset.copyContainer = containerSelector;
  }
  return button;
}

/**
 * Install the copy runtime for this document, and inline the very same function
 * so a saved copy of the document keeps working. Idempotent; call it whenever
 * copy buttons have been added.
 */
export function injectCopyScript() {
  if (document.getElementById("respec-copy-paste")) return;
  const config = JSON.stringify({
    copiedMs: COPIED_MS,
    anchor: ANCHOR,
    zwsp: ZWSP,
  });
  copyRuntime(JSON.parse(config));
  const script = document.createElement("script");
  script.id = "respec-copy-paste";
  // document.respec only exists while ReSpec is running the document, where the
  // call above already installed the runtime. Without this the saved script
  // would install a second copy here and every click would be handled twice.
  script.textContent = `if (!document.respec) (${copyRuntime})(${config});`;
  document.body.append(script);
}
