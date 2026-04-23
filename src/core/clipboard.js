// @ts-check
/**
 * Module core/clipboard
 *
 * Shared clipboard copy button for code blocks (WebIDL, CDDL, etc.).
 * Buttons survive export: a runtime script re-attaches click handlers.
 */

const COPY_SVG =
  '<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';

/**
 * Create a copy-to-clipboard button for a code block.
 * The button stores the header selector in a data attribute so the
 * runtime script can re-attach the handler in exported documents.
 *
 * @param {string} headerSelector - Selector for the header to exclude from copy
 * @param {string} [title="Copy to clipboard"] - Accessible label and tooltip
 * @returns {HTMLButtonElement}
 */
export function createCopyButton(headerSelector, title = "Copy to clipboard") {
  const button = document.createElement("button");
  button.innerHTML = COPY_SVG;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.classList.add("respec-button-copy-paste", "removeOnSave");
  button.dataset.copyHeader = headerSelector;
  button.addEventListener("click", () => {
    const pre = button.closest("pre");
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
    document.querySelectorAll(".respec-button-copy-paste").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var pre = this.closest("pre");
        if (!pre) return;
        var sel = this.dataset.copyHeader;
        var clone = pre.cloneNode(true);
        if (sel) { var h = clone.querySelector(sel); if (h) h.remove(); }
        navigator.clipboard.writeText(clone.textContent);
      });
    });
  `;
  document.body.append(script);
}
