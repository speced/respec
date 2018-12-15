// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

import { addId, reindent } from "./utils";
import css from "../deps/text!core/css/examples.css";
import hyperHTML from "../deps/hyperhtml";
import { pub } from "./pubsubhub";

export const name = "core/examples";

function makeTitle(conf, elem, num, report) {
  report.title = elem.title;
  if (report.title) elem.removeAttribute("title");
  const number = num > 0 ? " " + num : "";

  return hyperHTML`
  <div class="marker"><a class="self-link">${conf.l10n.example}${number}</a>${
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
    const report = {
      number,
      illegal,
    };
    const title = example.title;
    if (example.localName === "aside") {
      ++number;
      const div = makeTitle(conf, example, number, report);
      example.insertBefore(div, example.firstChild);
      const id = addId(example, "ex-" + number, title);
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${id}`;
      pub("example", report);
    } else {
      const inAside = !!example.closest("aside");
      if (!inAside) ++number;

      const reindentedHtml = reindent(example.innerHTML);
      example.innerHTML = report.content = reindentedHtml;

      // wrap
      example.classList.remove("example", "illegal-example");
      // relocate the id to the div
      const id = example.id ? example.id : null;
      if (id) example.removeAttribute("id");
      const div = hyperHTML`
        <div class='example' id="${id}">
          ${makeTitle(conf, example, inAside ? 0 : number, report)}
          ${example.cloneNode(true)}
        </div>
      `;
      addId(div, "ex-" + number, title);
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${div.id}`;
      example.parentElement.replaceChild(div, example);
      if (!inAside) pub("example", report);
    }
  });
}
