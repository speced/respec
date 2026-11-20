// @ts-check
/**
 * Module core/clipboard
 *
 * Shared clipboard copy button for code blocks (WebIDL, CDDL). Other modules
 * create the buttons with createCopyButton. This module then adds their style
 * sheet, their icons and the script that serves every click, in the live
 * document and in a saved copy of it. The script's live region takes its hiding
 * style from the respec-visually-hidden rule in dfn-panel.css.js, so a profile
 * that loads this module must also load core/dfn-panel.
 */
import css from "../styles/clipboard.css.js";
import { fetchBase } from "./text-loader.js";
import { getIntlData } from "./utils.js";
import { html } from "./import-maps.js";
import { insertStyle } from "./insert-style.js";
import { sub } from "./pubsubhub.js";

export const name = "core/clipboard";

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

const COPY_PATH =
  "M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z";
const CHECK_PATH =
  "M55 17a3 3 0 0 1 0 4L26 50a3 3 0 0 1-4 0L9 37a3 3 0 1 1 4-4l11 11 27-27a3 3 0 0 1 4 0z";

// TODO: dfn-panel builds its own icon sprite from this SVG. Share ICON_SPRITE with it.
export const COPY_SVG = `<svg aria-hidden="true" height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="${COPY_PATH}"/></svg>`;

// Every button points at these two symbols instead of repeating their paths.
const ICON_SPRITE = `<svg class="respec-copy-sprite" aria-hidden="true"><symbol id="respec-copy-icon" viewBox="0 0 14 16"><path fill-rule="evenodd" d="${COPY_PATH}"/></symbol><symbol id="respec-copy-check" viewBox="0 0 64 64"><path d="${CHECK_PATH}"/></symbol></svg>`;

// A function, because the nodes it returns can sit in only one button.
const createButtonIcons = () =>
  html`<svg aria-hidden="true" height="16" width="14">
      <use href="#respec-copy-icon" /></svg
    ><svg class="respec-copy-check" aria-hidden="true" height="16" width="16">
      <use href="#respec-copy-check" />
    </svg>`;

/**
 * Create a copy-to-clipboard button for a code block. The script that serves
 * every button handles its clicks, so the button carries what that script needs.
 *
 * @param {string} ignoreSelector - Selector for the part of the code block that is not copied, such as its header
 * @param {string} [title] - Accessible label and tooltip, "Copy to clipboard" in the
 *   document's language by default
 * @param {string} [containerSelector] - Ancestor whose `data-diagram-source`
 *   is copied instead of the code block around the button
 * @returns {HTMLButtonElement}
 */
export function createCopyButton(
  ignoreSelector,
  title = l10n.copy,
  containerSelector
) {
  /** @type {HTMLButtonElement} */
  const button = html`<button
    type="button"
    class="respec-button-copy-paste"
    title="${title}"
    aria-label="${title}"
    data-copy-ignore="${ignoreSelector}"
    data-copy-container="${containerSelector}"
    data-copied-label="${l10n.copied}"
    data-failed-label="${l10n.failed}"
  >
    ${createButtonIcons()}
  </button>`;
  return button;
}

/**
 * Add the style sheet, the icons and the script for the copy buttons that other
 * modules created. The script is part of the page, so a saved copy keeps it.
 */
export async function run() {
  if (!document.querySelector(".respec-button-copy-paste")) return;
  insertStyle(css, { before: document.querySelector("link") });
  document.body.insertAdjacentHTML("beforeend", ICON_SPRITE);
  sub("beforesave", resetCopyState);
  const script = document.createElement("script");
  script.id = "respec-copy-paste";
  script.textContent = await loadScript();
  document.body.append(script);
}

async function loadScript() {
  try {
    return (await import("text!./clipboard.runtime.js")).default;
  } catch {
    return fetchBase("./src/core/clipboard.runtime.js");
  }
}

/**
 * Remove what the live page added: a confirmation or failure message still
 * showing.
 * @param {HTMLElement} documentElement the clone being saved
 */
function resetCopyState(documentElement) {
  documentElement
    .querySelectorAll(".respec-button-copy-paste")
    .forEach(button => {
      button.removeAttribute("data-copy-state");
      button.removeAttribute("data-label");
    });
}
