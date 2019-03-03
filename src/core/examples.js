// @ts-check
// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

import { addId } from "./utils";
import css from "text!../../assets/examples.css";
import { lang as defaultLang } from "../core/l10n";
import html from "hyperhtml";
import { pub } from "./pubsubhub";

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
};

const lang = defaultLang in localizationStrings ? defaultLang : "en";

const l10n = localizationStrings[lang];

/**
 * @typedef {object} Report
 * @property {number} number
 * @property {boolean} illegal
 * @property {string} [title]
 * @property {string} [content]
 *
 * @param {*} conf
 * @param {HTMLElement} elem
 * @param {number} num
 * @param {Report} report
 */
function makeTitle(conf, elem, num, report) {
  report.title = elem.title;
  if (report.title) elem.removeAttribute("title");
  const number = num > 0 ? ` ${num}` : "";
  const title = report.title
    ? html`
        <span class="example-title">: ${report.title}</span>
      `
    : "";
  return html`
    <div class="marker">
      <a class="self-link">${l10n.example}${number}</a>${title}
    </div>
  `;
}

export function run(conf) {
  /** @type {NodeListOf<HTMLElement>} */
  const examples = document.querySelectorAll(
    "pre.example, pre.illegal-example, aside.example"
  );
  if (!examples.length) return;

  document.head.insertBefore(
    html`
      <style>
        ${css}
      </style>
    `,
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
      const div = makeTitle(conf, example, number, report);
      example.prepend(div);
      if (title) {
        addId(example, `example-${number}`, title); // title gets used
      } else {
        // use the number as the title... so, e.g., "example-5"
        addId(example, `example`, String(number));
      }
      const { id } = example;
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${id}`;
      pub("example", report);
    } else {
      const inAside = !!example.closest("aside");
      if (!inAside) ++number;

      report.content = example.innerHTML;

      // wrap
      example.classList.remove("example", "illegal-example");
      // relocate the id to the div
      const id = example.id ? example.id : null;
      if (id) example.removeAttribute("id");
      const div = html`
        <div class="example" id="${id}">
          ${makeTitle(conf, example, inAside ? 0 : number, report)}
          ${example.cloneNode(true)}
        </div>
      `;
      if (title) {
        addId(div, `example-${number}`, title);
      }
      addId(div, `example`, String(number));
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${div.id}`;
      example.parentElement.replaceChild(div, example);
      if (!inAside) pub("example", report);
    }
  });
}
