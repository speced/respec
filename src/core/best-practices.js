// @ts-check
// Module core/best-practices
// Handles the marking up of best practices, and can generate a summary of all of them.
// The summary is generated if there is a section in the document with ID bp-summary.
// Best practices are marked up with span.practicelab.
import { addId } from "./utils";
import css from "text!../../assets/bp.css";
import hyperHTML from "hyperhtml";
import { pub } from "./pubsubhub";

export const name = "core/best-practices";

export function run() {
  let num = 0;
  const bps = document.querySelectorAll("span.practicelab");
  const ul = document.createElement("ul");
  for (const bp of bps) {
    num++;
    const id = addId(bp, "bp");
    const li = hyperHTML`<li><a href="${`#${id}`}">Best Practice ${num}</a>: ${
      bp.textContent
    }</li>`;
    ul.appendChild(li);
    ul.classList.add("practicebox");
    const title = hyperHTML`<span class="practicetitle">Best Practice ${num}</span>: `;
    bp.prepend(...title.childNodes);
  }
  const bpSummary = document.getElementById("bp-summary");
  if (bps.length) {
    document.head.insertBefore(
      hyperHTML`<style>${[css]}</style>`,
      document.head.querySelector("link")
    );
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
