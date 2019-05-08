// @ts-check
// Module core/best-practices
// Handles the marking up of best practices, and can generate a summary of all of them.
// The summary is generated if there is a section in the document with ID bp-summary.
// Best practices are marked up with span.practicelab.
import { addId, makeSafeCopy } from "./utils.js";
import { lang as defaultLang } from "../core/l10n.js";
import hyperHTML from "hyperhtml";
import { pub } from "./pubsubhub.js";

export const name = "core/best-practices";

const localizationStrings = {
  en: {
    best_practice: "Best Practice ",
  },
};
const lang = defaultLang in localizationStrings ? defaultLang : "en";

export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const bps = document.querySelectorAll(".practicelab");
  const l10n = localizationStrings[lang];
  const bpSummary = document.getElementById("bp-summary");
  const summaryItems = bpSummary ? document.createElement("ul") : null;
  [...bps].forEach((bp, num) => {
    const id = addId(bp, "bp");
    const localizedBpName = hyperHTML`
      <a class="marker self-link" href="${`#${id}`}"><bdi lang="${lang}">${
      l10n.best_practice
    }${num + 1}</bdi></a>`;

    // Make the summary items, if we have a summary
    if (summaryItems) {
      const li = hyperHTML`
        <li>
          ${localizedBpName}: ${makeSafeCopy(bp)}
        </li>
      `;
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
    const title = hyperHTML`${localizedBpName.cloneNode(true)}: ${bp}`;
    container.prepend(...title.childNodes);
  });
  if (bps.length) {
    if (bpSummary) {
      bpSummary.appendChild(hyperHTML`<h2>Best Practices Summary</h2>`);
      bpSummary.appendChild(summaryItems);
    }
  } else if (bpSummary) {
    pub(
      "warn",
      "Using best practices summary (#bp-summary) but no best practices found."
    );
    bpSummary.remove();
  }
}
