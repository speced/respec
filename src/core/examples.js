// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

import { pub } from "core/pubsubhub";
import "deps/hyperhtml";
import css from "deps/text!core/css/examples.css";
import { reindent, addId } from "core/utils";

export const name = "core/examples";

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
      const title = example.title;
      if (!inAside) ++number;

      const reindentedHtml = reindent(example.innerHTML);
      example.innerHTML = report.content = reindentedHtml;

      // wrap
      example.classList.remove("example", "illegal-example");
      const div = hyperHTML`
        <div class='example'>
          ${makeTitle(conf, example, inAside ? 0 : number, report)}
          ${example.cloneNode(true)}
        </div>
      `;
      addId(div, 'ex-' + number, title);
      example.parentElement.replaceChild(div, example);
      if (!inAside) pub("example", report);
    }
  });
}
