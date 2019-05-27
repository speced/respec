// @ts-check
// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

import { addId } from "./utils.js";
import html from "../../js/html-template.js";
import { pub } from "./pubsubhub.js";

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

async function loadStyle() {
  try {
    return (await import("text!../../assets/examples.css")).default;
  } catch {
    const loader = await import("./asset-loader.js");
    return loader.loadAssetOnNode("examples.css");
  }
}

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
 * @param {*} l10n
 * @return {HTMLDivElement}
 */
function makeTitle(elem, num, report, l10n) {
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
      <a class="self-link">${l10n.example}<bdi>${number}</bdi></a
      >${title}
    </div>
  `;
}

/**
 * @param {import("../respec-document").RespecDocument} respecDoc
 */
export default async function({ document, lang }) {
  /** @type {NodeListOf<HTMLElement>} */
  const examples = document.querySelectorAll(
    "pre.example, pre.illegal-example, aside.example"
  );
  if (!examples.length) return;

  const l10n = localizationStrings[lang];

  const css = await loadStyle();
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
      const div = makeTitle(example, number, report, l10n);
      example.prepend(div);
      if (title) {
        addId(example, `example-${number}`, title); // title gets used
      } else {
        // use the number as the title... so, e.g., "example-5"
        addId(example, `example`, String(number));
      }
      const { id } = example;
      /** @type {HTMLAnchorElement} */
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
      const exampleTitle = makeTitle(
        example,
        inAside ? 0 : number,
        report,
        l10n
      );
      /** @type {HTMLDivElement} */
      const div = html`
        <div class="example" id="${id}">
          ${exampleTitle} ${example.cloneNode(true)}
        </div>
      `;
      if (title) {
        addId(div, `example-${number}`, title);
      }
      addId(div, `example`, String(number));
      /** @type {HTMLAnchorElement} */
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${div.id}`;
      example.replaceWith(div);
      if (!inAside) pub("example", report);
    }
  });
}
