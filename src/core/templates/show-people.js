// @ts-check

const name = "core/templates/show-people";

import {
  humanDate,
  isValidConfDate,
  showError,
  showWarning,
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
 * @param {Conf} conf
 * @param {"editors" | "authors" | "formerEditors"} propName - the name of the property of the people to render.
 */
export default function showPeople(conf, propName) {
  const people = conf[propName];
  if (!Array.isArray(people) || !people.length) return; // nothing to show...

  const validatePerson = personValidator(propName);
  return people.filter(validatePerson).map(personToHTML);
}

/**
 * @param {Person} person
 */
function personToHTML(person) {
  const l10n = localizationStrings[lang];
  // The following are treated as opt-in HTML by hyperHTML
  // we need to deprecate this!
  const personName = [person.name];
  const company = [person.company];
  const editorId = person.w3cid || null;
  const contents = [];
  if (person.mailto) {
    person.url = `mailto:${person.mailto}`;
  }
  if (person.url) {
    const url = new URL(person.url, document.location.href);
    const classList =
      url.protocol === "mailto:"
        ? "ed_mailto u-email email p-name"
        : "u-url url p-name fn";
    contents.push(
      html`<a class="${classList}" href="${person.url}">${personName}</a>`
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
  if (person.note) {
    contents.push(document.createTextNode(` (${person.note})`));
  }
  if (person.extras) {
    contents.push(...person.extras.map(extra => html`, ${renderExtra(extra)}`));
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
 *
 * @param {string} prop
 */
function personValidator(prop) {
  /**
   * @param {Person} person
   * @param {Number} index
   */
  return function validatePerson(person, index) {
    const docsUrl = "https://respec.org/docs/";
    const seePersonHint = `See [person](${docsUrl}#person) configuration for available options.`;
    const preamble =
      `Error processing the [person object](${docsUrl}#person) ` +
      `at index ${index} of the "[\`${prop}\`](${docsUrl}#${prop})" configuration option.`;

    if (!person.name) {
      const msg = `${preamble} Missing required property \`"name"\`.`;
      showError(msg, name, { hint: seePersonHint });
      return false;
    }

    if (person.orcid) {
      const { orcid } = person;
      const orcidUrl = new URL(orcid, "https://orcid.org/");

      if (orcidUrl.origin !== "https://orcid.org") {
        const msg = `${preamble} ORCID "${person.orcid}" at index ${index} is invalid.`;
        const hint = `The origin should be "https://orcid.org", not "${orcidUrl.origin}".`;
        showError(msg, name, { hint });
        return false;
      }

      // trailing slash would mess up checksum
      const orcidId = orcidUrl.pathname.slice(1).replace(/\/$/, "");
      if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(orcidId)) {
        const msg = `${preamble} ORCID "${orcidId}" has wrong format.`;
        const hint = `ORCIDs have the format "1234-1234-1234-1234."`;
        showError(msg, name, { hint });
        return false;
      }

      if (!checkOrcidChecksum(orcid)) {
        const msg = `${preamble} ORCID "${orcid}" failed checksum check.`;
        const hint = "Please check that the ORCID is valid.";
        showError(msg, name, { hint });
        return false;
      }

      // canonical form
      person.orcid = orcidUrl.href;
    }

    if (person.retiredDate && !isValidConfDate(person.retiredDate)) {
      const msg = `${preamble} The property "\`retiredDate\`" is not a valid date.`;
      showError(msg, name, {
        hint: `The expected format is YYYY-MM-DD. ${seePersonHint}`,
      });
      return false;
    }

    if (
      person.hasOwnProperty("extras") &&
      !validateExtras(person.extras, seePersonHint, preamble)
    ) {
      return false;
    }

    if (person.url && person.mailto) {
      const msg = `${preamble} Has both "url" and "mailto" property.`;
      showWarning(msg, name, {
        hint: `Please choose either "url" or "mailto" ("url" is preferred). ${seePersonHint}`,
      });
    }

    if (person.companyURL && !person.company) {
      const msg = `${preamble} Has a "\`companyURL\`" property but no "\`company\`" property.`;
      showWarning(msg, name, {
        hint: `Please add a "\`company\`" property. ${seePersonHint}.`,
      });
    }
    return true;
  };
}

/**
 *
 * @param {PersonExtras[]} extras
 * @param {string} hint
 * @param {string} preamble
 */
function validateExtras(extras, hint, preamble) {
  if (!Array.isArray(extras)) {
    showError(
      `${preamble}. A person's "extras" member must be an array.`,
      name,
      { hint }
    );
    return false;
  }
  return extras.every((extra, index) => {
    switch (true) {
      case typeof extra !== "object":
        showError(
          `${preamble}. Member "extra" at index ${index} is not an object.`,
          name,
          {
            hint,
          }
        );
        return false;
      case !extra.hasOwnProperty("name"):
        showError(
          `${preamble} \`PersonExtra\` object at index ${index} is missing required "name" member.`,
          name,
          { hint }
        );
        return false;
      case typeof extra.name === "string" && extra.name.trim() === "":
        showError(
          `${preamble} \`PersonExtra\` object at index ${index} "name" can't be empty.`,
          name,
          { hint }
        );
        return false;
    }
    return true;
  });
}

/**
 * @param {string} orcid
 * @returns {boolean}
 */
function checkOrcidChecksum(orcid) {
  // calculate checksum as per https://support.orcid.org/hc/en-us/articles/360006897674-Structure-of-the-ORCID-Identifier
  const lastDigit = orcid[orcid.length - 1];
  const remainder = orcid
    .split("")
    .slice(0, -1)
    .filter(c => /\d/.test(c))
    .map(Number)
    .reduce((acc, c) => (acc + c) * 2, 0);
  const lastDigitInt = (12 - (remainder % 11)) % 11;
  const lastDigitShould = lastDigitInt === 10 ? "X" : String(lastDigitInt);
  return lastDigit === lastDigitShould;
}
