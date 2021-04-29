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
    const localizedBpName = html`<a class="marker self-link" href="${`#${id}`}"
      ><bdi lang="${lang}">${l10n.best_practice}${num + 1}</bdi></a
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
      bpSummary.appendChild(html`<h2>Best Practices Summary</h2>`);
      bpSummary.appendChild(summaryItems);
    }
  } else if (bpSummary) {
    const msg = `Using best practices summary (#bp-summary) but no best practices found.`;
    showWarning(msg, name);
    bpSummary.remove();
  }
}
