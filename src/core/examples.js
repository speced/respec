// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

import { pub } from "core/pubsubhub";
import "deps/hyperhtml";
import css from "deps/text!core/css/examples.css";

export const name = "core/examples";
const isEmpty = str => /^\s*$/.test(str);

function makeTitle(conf, elem, num, report) {
  report.title = elem.title;
  if (report.title) elem.removeAttribute("title");
  const number = num > 0 ? " " + num : "";

  return hyperHTML`
  <div class="marker"><span>${conf.l10n.example}${number}</span>${
    report.title
      ? hyperHTML`<span class="example-title">: ${report.title}</span>`
      : ""
  }</div>`;
}

export function run(conf) {
  const examples = document.querySelectorAll(
    "pre.example, pre.illegal-example, aside.example"
  );
  if (!examples.length) return;

  document.head.insertBefore(
    hyperHTML`<style>${css}</style>`,
    document.querySelector("link")
  );

  let number = 0;
  examples.forEach(example => {
    const illegal = example.classList.contains("illegal-example");
    const report = { number, illegal };
    if (example.localName === "aside") {
      ++number;
      const title = makeTitle(conf, example, number, report);
      example.insertBefore(title, example.firstChild);
      pub("example", report);
    } else {
      const inAside = !!example.closest("aside");
      if (!inAside) ++number;

      // reindent
      const lines = example.innerHTML.split("\n");
      // remove empty lines from top and bottom
      while (lines.length && isEmpty(lines[0])) lines.shift();
      while (lines.length && isEmpty(lines[lines.length - 1])) lines.pop();
      const matches = /^(\s+)/.exec(lines[0]);
      if (matches) {
        const rep = new RegExp("^" + matches[1]);
        for (let j = 0; j < lines.length; j++) {
          lines[j] = lines[j].replace(rep, "");
        }
      }
      example.innerHTML = report.content = lines.join("\n");

      // wrap
      example.classList.remove("example", "illegal-example");
      const div = hyperHTML`
        <div class='example'>
          ${makeTitle(conf, example, inAside ? 0 : number, report)}
          ${example.cloneNode(true)}
        </div>
      `;
      example.parentElement.replaceChild(div, example);
      if (!inAside) pub("example", report);
    }
  });
}
