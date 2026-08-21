// @ts-check
/**
 * Module core/clipboard
 *
 * Shared clipboard copy button for code blocks (WebIDL, CDDL, etc.).
 * Buttons survive export: a runtime script re-attaches click handlers.
 */

import { getIntlData } from "./utils.js";

// Callers that already have a localized label pass it in (core/diagrams does);
// this is the label for callers that do not.
const localizationStrings = {
  en: {
    copy_to_clipboard: "Copy to clipboard",
  },
  cs: {
    copy_to_clipboard: "Kopírovat do schránky",
  },
  de: {
    copy_to_clipboard: "In Zwischenablage kopieren",
  },
  es: {
    copy_to_clipboard: "Copiar al portapapeles",
  },
  fr: {
    copy_to_clipboard: "Copier dans le presse-papiers",
  },
  ja: {
    copy_to_clipboard: "クリップボードにコピー",
  },
  ko: {
    copy_to_clipboard: "클립보드에 복사",
  },
  nl: {
    copy_to_clipboard: "Kopiëren naar klembord",
  },
  zh: {
    copy_to_clipboard: "复制到剪贴板",
  },
};

const l10n = getIntlData(localizationStrings);

const COPY_SVG =
  '<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';

/**
 * Find the copy target <pre> for a button.
 * If the button has a data-copy-container attribute, searches within that
 * ancestor. Otherwise falls back to closest("pre").
 * @param {HTMLElement} button
 * @returns {HTMLElement | null}
 */
function findCopyTarget(button) {
  const containerSelector = button.dataset.copyContainer;
  if (containerSelector) {
    const container = button.closest(containerSelector);
    return /** @type {HTMLElement | null} */ (
      container?.querySelector("pre") ?? null
    );
  }
  return /** @type {HTMLElement | null} */ (button.closest("pre"));
}

/**
 * Create a copy-to-clipboard button for a code block.
 * The button stores the header selector in a data attribute so the
 * runtime script can re-attach the handler in exported documents.
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
  button.innerHTML = COPY_SVG;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.classList.add("respec-button-copy-paste", "removeOnSave");
  button.dataset.copyHeader = headerSelector;
  if (containerSelector) {
    button.dataset.copyContainer = containerSelector;
  }
  button.addEventListener("click", () => {
    const copyContainerSelector = button.dataset.copyContainer;
    if (copyContainerSelector) {
      const container = /** @type {HTMLElement | null} */ (
        button.closest(copyContainerSelector)
      );
      const source = container?.dataset.diagramSource;
      if (source) {
        navigator.clipboard.writeText(source);
        return;
      }
    }
    const pre = findCopyTarget(button);
    if (!pre) return;
    const clone = /** @type {HTMLElement} */ (pre.cloneNode(true));
    clone.querySelector(headerSelector)?.remove();
    navigator.clipboard.writeText(clone.textContent ?? "");
  });
  return button;
}

/**
 * Inject a runtime script that re-attaches copy handlers in exported docs.
 * Call this once after all copy buttons are created.
 */
export function injectCopyScript() {
  if (document.getElementById("respec-copy-paste")) return;
  const script = document.createElement("script");
  script.id = "respec-copy-paste";
  script.textContent = `
    document.querySelectorAll(".respec-button-copy-paste").forEach(function(button) {
      // Not an arrow function: the handler relies on \`this\` being the button.
      button.addEventListener("click", function() {
        const containerSelector = this.dataset.copyContainer;
        let pre = null;
        if (containerSelector) {
          const container = this.closest(containerSelector);
          if (container && container.dataset.diagramSource) {
            navigator.clipboard.writeText(container.dataset.diagramSource);
            return;
          }
          pre = container ? container.querySelector("pre") : null;
        } else {
          pre = this.closest("pre");
        }
        if (!pre) return;
        const headerSelector = this.dataset.copyHeader;
        const clone = pre.cloneNode(true);
        if (headerSelector) {
          const header = clone.querySelector(headerSelector);
          if (header) header.remove();
        }
        navigator.clipboard.writeText(clone.textContent);
      });
    });
  `;
  document.body.append(script);
}
