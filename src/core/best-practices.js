// @ts-check
// Module core/best-practices
// Handles the marking up of best practices, and can generate a summary of all of them.
// The summary is generated if there is a section in the document with ID bp-summary.
// Best practices are marked up with span.practicelab.
import { addId, getIntlData, makeSafeCopy, showWarning } from "./utils.js";
import { lang as defaultLang } from "../core/l10n.js";
import { html } from "./import-maps.js";

export const name = "core/best-practices";

const localizationStrings = {
  en: {
    best_practice: "Best Practice ",
    best_practice_summary: "Best Practices Summary",
  },
  ja: {
    best_practice: "最良実施例 ",
  },
  de: {
    best_practice: "Musterbeispiel ",
  },
  zh: {
    best_practice: "最佳实践 ",
  },
  fr: {
    best_practice: "Bonne pratique ",
    best_practice_summary: "Résumé des bonnes pratiques",
  },
};
const l10n = getIntlData(localizationStrings);
const lang = defaultLang in localizationStrings ? defaultLang : "en";

export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const bps = document.querySelectorAll(".practicelab");
  const bpSummary = document.getElementById("bp-summary");
  const summaryItems = bpSummary ? document.createElement("ul") : null;
  [...bps].forEach((bp, num) => {
    const id = addId(bp, "bp");
    const rawLabel = bp.dataset.label || l10n.best_practice;
    const label = `${rawLabel.trimEnd()} `;
    const bdi = html`<bdi>${label}${num + 1}</bdi>`;
    // Only set lang when using the built-in localized label, not a custom one
    if (!bp.dataset.label) bdi.lang = lang;
    const localizedBpName = html`<a class="marker self-link" href="${`#${id}`}"
      >${bdi}</a
    >`;

    // Make the summary items, if we have a summary
    if (summaryItems) {
      const li = html`<li>${localizedBpName}: ${makeSafeCopy(bp)}</li>`;
      summaryItems.appendChild(li);
    }

    const container = bp.closest("div");
    if (!container) {
      // This is just an inline best practice...
      bp.classList.add("advisement");
      return;
    }

    // Make the advisement box
    container.classList.add("advisement");
    const title = html`${localizedBpName.cloneNode(true)}: ${bp}`;
    container.prepend(...title.childNodes);
  });
  if (bps.length) {
    if (bpSummary) {
      const summaryLabel =
        bpSummary.dataset.label || l10n.best_practice_summary;
      bpSummary.appendChild(html`<h1>${summaryLabel}</h1>`);
      if (summaryItems) bpSummary.appendChild(summaryItems);
    }
  } else if (bpSummary) {
    const msg = `Using best practices summary (#bp-summary) but no best practices found.`;
    showWarning(msg, name);
    bpSummary.remove();
  }
}
