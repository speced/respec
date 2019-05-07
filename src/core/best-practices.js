// @ts-check
// Module core/best-practices
// Handles the marking up of best practices, and can generate a summary of all of them.
// The summary is generated if there is a section in the document with ID bp-summary.
// Best practices are marked up with span.practicelab.
import { addId, makeSafeCopy } from "./utils.js";
import hyperHTML from "hyperhtml";
import { pub } from "./pubsubhub.js";

export const name = "core/best-practices";

export function run() {
  let num = 0;
  const ul = document.createElement("ul");
  /** @type {NodeListOf<HTMLElement>} */
  const bps = document.querySelectorAll("span.practicelab");
  for (const bp of bps) {
    num++;
    const id = addId(bp, "bp");
    const li = hyperHTML`<li><a href="${`#${id}`}">Best Practice ${num}</a>: ${makeSafeCopy(
      bp
    )}</li>`;
    ul.appendChild(li);
    const container = bp.closest("div");
    if (!container) {
      bp.classList.add("advisement");
      continue;
    }
    container.classList.add("advisement");
    const title = hyperHTML`<a href="${`#${id}`}"
      class="self-link"><span class="marker">Best Practice ${num}</span></a>: ${bp}`;
    container.prepend(...title.childNodes);
  }
  const bpSummary = document.getElementById("bp-summary");
  if (bps.length) {
    if (bpSummary) {
      bpSummary.appendChild(hyperHTML`<h2>Best Practices Summary</h2>`);
      bpSummary.appendChild(ul);
    }
  } else if (bpSummary) {
    pub(
      "warn",
      "Using best practices summary (#bp-summary) but no best practices found."
    );
    bpSummary.remove();
  }
}
