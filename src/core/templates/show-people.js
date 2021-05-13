// @ts-check
/**
 * @typedef {object} Person
 * @property {string} [Person.name]
 * @property {string|number} [Person.w3cid]
 * @property {string} [Person.mailto]
 * @property {string} [Person.url]
 * @property {string} [Person.orcid]
 * @property {string} [Person.company]
 * @property {string} [Person.companyURL]
 * @property {string} [Person.note]
 * @property {string} [Person.retiredDate]
 * @property {PersonExtras} [Person.extras]
 *
 * @typedef {object} PersonExtras
 * @property {string} PersonExtras.name
 * @property {string} [PersonExtras.class]
 * @property {string} [PersonExtras.href]
 */

const name = "core/templates/show-people";

import { humanDate, showError, showWarning } from "../../core/utils.js";
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
  zh: {
    until(date) {
      return html` 直到 ${date} `;
    },
  },
};

const lang = defaultLang in localizationStrings ? defaultLang : "en";

const orcidIcon = () => html`<svg
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
</svg>`;

/**
 * @param {Person[]} persons
 */
export default function showPeople(persons = []) {
  return persons.filter(validatePerson).map(personToHTML);
}

function personToHTML(person) {
  const l10n = localizationStrings[lang];
  const personName = [person.name]; // treated as opt-in HTML by hyperHTML
  const company = [person.company];
  const editorId = person.w3cid ? parseInt(person.w3cid, 10) : null;
  const contents = [];
  if (person.mailto) {
    contents.push(html`<a
      class="ed_mailto u-email email p-name"
      href="${`mailto:${person.mailto}`}"
      >${personName}</a
    >`);
  } else if (person.url) {
    contents.push(
      html`<a class="u-url url p-name fn" href="${person.url}"
        >${personName}</a
      >`
    );
  } else {
    contents.push(html`<span class="p-name fn">${personName}</span>`);
  }
  if (person.orcid) {
    contents.push(
      html`<a class="p-name orcid" href="${person.orcid}">${orcidIcon()}</a>`
    );
  }
  if (person.company) {
    const hCard = "p-org org h-org";
    const companyElem = person.companyURL
      ? html`<a class="${hCard}" href="${person.companyURL}">${company}</a>`
      : html`<span class="${hCard}">${company}</span>`;
    contents.push(html` (${companyElem})`);
  }
  if (person.note) contents.push(document.createTextNode(` (${person.note})`));
  if (person.extras) {
    person.extras
      .map(extra => html`, ${renderExtra(extra)}`)
      .reduce((contents, html) => {
        contents.push(html);
        return contents;
      }, contents);
  }
  if (person.retiredDate) {
    const { retiredDate } = person;
    const time = html`<time datetime="${retiredDate}"
      >${humanDate(retiredDate)}</time
    >`;
    contents.push(html` - ${l10n.until(time)} `);
  }
  const dd = html`<dd
    class="editor p-author h-card vcard"
    data-editor-id="${editorId}"
  >
    ${contents}
  </dd>`;
  return dd;
}

function renderExtra(extra) {
  const classVal = extra.class || null;
  const { name, href } = extra;
  return href
    ? html`<a href="${href}" class="${classVal}">${name}</a>`
    : html`<span class="${classVal}">${name}</span>`;
}

/**
 * @param {Person} person
 * @param {Number} index
 * @returns
 */
function validatePerson(person, index) {
  const hint =
    "See [Person](https://respec.org/docs/#person) configuration for available options.";
  if (!person.name) {
    const msg = `Person object at index ${index} is missing required member "name"`;
    showError(msg, name, { hint });
    return false;
  }

  if (person.orcid && !validateAndCanonicalizeOrcid(person, index)) {
    return false;
  }

  if (
    person.retiredDate &&
    !validateDateMember("retiredDate", person.retiredDate, index, hint)
  ) {
    return false;
  }

  if (person.hasOwnProperty("extras") && !validateExtras(person.extras, hint)) {
    return false;
  }

  if (person.companyURL && !person.company) {
    const msg = `Person object at index ${index} has a "companyURL" member but no "company" member.`;
    showWarning(msg, name, { hint: `Please add a "company" member. ${hint}` });
  }
  return true;
}

/**
 *
 * @param {PersonExtras} extras
 * @param {string} hint
 */
function validateExtras(extras, hint) {
  if (!Array.isArray(extras)) {
    showError(`A person's "extras" member must be an array.`, name, { hint });
    return false;
  }
  return extras.every((extra, index) => {
    switch (true) {
      case typeof extra !== "object":
        showError(`"extra" index ${index} is not an object.`, name, {
          hint,
        });
        return false;
      case !extra.hasOwnProperty("name"):
        showError(
          `\`PersonExtra\` object at index ${index} is missing required "name" member.`,
          name,
          { hint }
        );
        return false;
      case typeof extra.name === "string" && extra.name.trim() === "":
        showError(
          `\`PersonExtra\` object at index ${index} "name" can't be empty.`,
          name,
          { hint }
        );
        return false;
    }
    return true;
  });
}

/**
 * @param {string} member
 * @param {string} rawDate
 * @param {number} index
 * @param {string} hint
 * @returns
 */
function validateDateMember(member, rawDate, index, hint) {
  const date = new Date(rawDate);
  const isValidDate = date.toString() !== "Invalid Date";
  if (!isValidDate) {
    const msg = `"${member}" of person at index ${index} is invalid.`;
    showError(msg, name, {
      hint: `The expected format is YYYY-MM-DD. ${hint}`,
    });
    return false;
  }
  return true;
}

/**
 *
 * @param {Person} person
 * @param {number} index
 * @returns {boolean}
 */
function validateAndCanonicalizeOrcid(person, index) {
  const { orcid } = person;
  const orcidUrl = new URL(orcid, "https://orcid.org/");
  const msg = `"${person.orcid}" at index ${index} has an invalid ORCID`;

  if (orcidUrl.origin !== "https://orcid.org") {
    const hint = `The origin should be "https://orcid.org", not "${orcidUrl.origin}"`;
    showError(msg, name, { hint });
    return false;
  }

  // trailing slash would mess up checksum
  const orcidId = orcidUrl.pathname.slice(1).replace(/\/$/, "");
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(orcidId)) {
    const hint = `ORCIDs have the format "1234-1234-1234-1234", not "${orcidId}"`;
    showError(msg, name, { hint });
    return false;
  }

  // calculate checksum as per https://support.orcid.org/hc/en-us/articles/360006897674-Structure-of-the-ORCID-Identifier
  const lastDigit = orcidId[orcidId.length - 1];
  const remainder = orcidId
    .split("")
    .slice(0, -1)
    .filter(c => /\d/.test(c))
    .map(Number)
    .reduce((acc, c) => (acc + c) * 2, 0);
  const lastDigitInt = (12 - (remainder % 11)) % 11;
  const lastDigitShould = lastDigitInt === 10 ? "X" : String(lastDigitInt);
  if (lastDigit !== lastDigitShould) {
    const hint = `orcid "${orcidId}" has an invalid checksum`;
    showError(msg, name, { hint });
    return false;
  }
  person.orcid = orcidUrl.href;
  return true;
}
