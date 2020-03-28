// @ts-check
import {
  humanDate,
  showInlineError,
  toShortIsoDate,
} from "../../core/utils.js";
import { lang as defaultLang } from "../../core/l10n.js";
import { html } from "../../core/import-maps.js";

const localizationStrings = {
  en: {
    until(date) {
      return html` Until ${date} `;
    },
  },
  es: {
    until(date) {
      return html` Hasta ${date} `;
    },
  },
  ko: {
    until(date) {
      return html` ${date} 이전 `;
    },
  },
  ja: {
    until(date) {
      return html` ${date} 以前 `;
    },
  },
  de: {
    until(date) {
      return html` bis ${date} `;
    },
  },
};

const lang = defaultLang in localizationStrings ? defaultLang : "en";

export default (items = []) => {
  const l10n = localizationStrings[lang];
  return items.map(getItem);

  function getItem(p) {
    const personName = [p.name]; // treated as opt-in HTML by hyperHTML
    const company = [p.company];
    /** @type {HTMLElement} */
    const dd = html`<dd class="p-author h-card vcard"></dd>`;
    const span = document.createDocumentFragment();
    const contents = [];
    if (p.mailto) {
      contents.push(html`<a
        class="ed_mailto u-email email p-name"
        href="${`mailto:${p.mailto}`}"
        >${personName}</a
      >`);
    } else if (p.url) {
      contents.push(
        html`<a class="u-url url p-name fn" href="${p.url}">${personName}</a>`
      );
    } else {
      contents.push(html`<span class="p-name fn">${personName}</span>`);
    }
    if (p.orcid) {
      contents.push(
        html`<a class="p-name orcid" href="${p.orcid}"
          ><svg
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          >
            <style>
              .st1 {
                fill: #fff;
              }
            </style>
            <path
              d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"
              fill="#a6ce39"
            />
            <path
              class="st1"
              d="M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 148 93h-23.7v79.4zM88.7 56.8c0 5.5-4.5 10.1-10.1 10.1s-10.1-4.6-10.1-10.1c0-5.6 4.5-10.1 10.1-10.1s10.1 4.6 10.1 10.1z"
            />
          </svg>
        </a>`
      );
    }
    if (p.company) {
      if (p.companyURL) {
        contents.push(
          html`
            (<a class="p-org org h-org h-card" href="${p.companyURL}"
              >${company}</a
            >)
          `
        );
      } else {
        contents.push(html` (${company}) `);
      }
    }
    if (p.note) contents.push(document.createTextNode(` (${p.note})`));
    if (p.extras) {
      const results = p.extras
        // Remove empty names
        .filter(extra => extra.name && extra.name.trim())
        // Convert to HTML
        .map(getExtra);
      for (const result of results) {
        contents.push(document.createTextNode(", "), result);
      }
    }
    if (p.retiredDate) {
      const retiredDate = new Date(p.retiredDate);
      const isValidDate = retiredDate.toString() !== "Invalid Date";
      const timeElem = document.createElement("time");
      timeElem.textContent = isValidDate
        ? humanDate(retiredDate)
        : "Invalid Date"; // todo: Localise invalid date
      if (!isValidDate) {
        showInlineError(
          timeElem,
          "The date is invalid. The expected format is YYYY-MM-DD.",
          "Invalid date"
        );
      }
      timeElem.dateTime = toShortIsoDate(retiredDate);
      contents.push(html` - ${l10n.until(timeElem)} `);
    }

    // @ts-ignore: hyperhtml types only support Element but we use a DocumentFragment here
    html.bind(span)`${contents}`;
    dd.appendChild(span);
    return dd;
  }

  function getExtra(extra) {
    const span = html`<span class="${extra.class || null}"></span>`;
    let textContainer = span;
    if (extra.href) {
      textContainer = html`<a href="${extra.href}"></a>`;
      span.appendChild(textContainer);
    }
    textContainer.textContent = extra.name;
    return span;
  }
};
