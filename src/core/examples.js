// @ts-check
// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

import { addId, getIntlData } from "./utils.js";
import css from "../styles/examples.css.js";
import { html } from "./import-maps.js";

export const name = "core/examples";

const localizationStrings = {
  en: {
    example: "Example",
  },
  nl: {
    example: "Voorbeeld",
  },
  es: {
    example: "Ejemplo",
  },
  ko: {
    example: "예시",
  },
  ja: {
    example: "例",
  },
  de: {
    example: "Beispiel",
  },
  zh: {
    example: "例",
  },
};

const l10n = getIntlData(localizationStrings);

/**
 * @typedef {object} Report
 * @property {number} number
 * @property {boolean} illegal
 * @property {string} [title]
 * @property {string} [content]
 *
 * @param {HTMLElement} elem
 * @param {number} num
 * @param {Report} report
 */
function makeTitle(elem, num, report) {
  report.title = elem.title;
  if (report.title) elem.removeAttribute("title");
  const number = num > 0 ? ` ${num}` : "";
  const title = report.title
    ? html`<span class="example-title">: ${report.title}</span>`
    : "";
  return html`<div class="marker">
    <a class="self-link">${l10n.example}<bdi>${number}</bdi></a
    >${title}
  </div>`;
}

export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const examples = document.querySelectorAll(
    "pre.example, pre.illegal-example, aside.example"
  );
  if (!examples.length) return;

  document.head.insertBefore(
    html`<style>
      ${css}
    </style>`,
    document.querySelector("link")
  );

  let number = 0;
  examples.forEach(example => {
    const illegal = example.classList.contains("illegal-example");
    /** @type {Report} */
    const report = {
      number,
      illegal,
    };
    const { title } = example;
    if (example.localName === "aside") {
      ++number;
      const div = makeTitle(example, number, report);
      example.prepend(div);
      const id = addId(example, "example", title || String(number));
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${id}`;
    } else {
      const inAside = !!example.closest("aside");
      if (!inAside) ++number;

      report.content = example.innerHTML;

      // wrap
      example.classList.remove("example", "illegal-example");
      // relocate the id to the div
      const id = example.id ? example.id : null;
      if (id) example.removeAttribute("id");
      const exampleTitle = makeTitle(example, inAside ? 0 : number, report);
      const div = html`<div class="example" id="${id}">
        ${exampleTitle} ${example.cloneNode(true)}
      </div>`;
      addId(div, "example", title || String(number));
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${div.id}`;
      example.replaceWith(div);
    }
  });
}
