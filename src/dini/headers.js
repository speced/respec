// @ts-check
// Module dini/headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
//  - editors: an array of people editing the document (at least one is required). People
//      are defined using:
//          - name: the person's name (required)
//          - url: URI for the person's home page
//          - company: the person's company
//          - companyURL: the URI for the person's company
//          - mailto: the person's email
//          - note: a note on the person (e.g. former editor)
//  - authors: an array of people who are contributing authors of the document.
//  - formerEditors: an array of people that had earlier edited the document but no longer edit.
//  - subtitle: a subtitle for the specification
//  - publishDate: the date to use for the publication, default to document.lastModified, and
//      failing that to now. The format is YYYY-MM-DD or a Date object.
//  - alternateFormats: a list of alternate formats for the document, each of which being
//      defined by:
//          - uri: the URI to the alternate
//          - label: a label for the alternate
//          - lang: optional language
//          - type: optional MIME type
//  - logos: a list of logos to use instead of the W3C logo, each of which being defined by:
//          - src: the URI to the logo (target of <img src=>)
//          - alt: alternate text for the image (<img alt=>), defaults to "Logo" or "Logo 1", "Logo 2", ...
//            if src is not specified, this is the text of the "logo"
//          - height: optional height of the logo (<img height=>)
//          - width: optional width of the logo (<img width=>)
//          - url: the URI to the organization represented by the logo (target of <a href=>)
//          - id: optional id for the logo, permits custom CSS (wraps logo in <span id=>)
//          - each logo element must specify either src or alt
//  - otherLinks: an array of other links that you might want in the header (e.g., link github, twitter, etc).
//         Example of usage: [{key: "foo", href:"https://b"}, {key: "bar", href:"https://"}].
//         Allowed values are:
//          - key: the key for the <dt> (e.g., "Bug Tracker"). Required.
//          - value: The value that will appear in the <dd> (e.g., "GitHub"). Optional.
//          - href: a URL for the value (e.g., "https://foo.com/issues"). Optional.
//          - class: a string representing CSS classes. Optional.
//  - license: can be one of the following
//      - "cc-by-sa"
//      - "cc-by"
//      - "cc0"
import { ISODate, showError } from "../core/utils.js";
import headersTmpl from "./templates/headers.js";
import { pub } from "../core/pubsubhub.js";

export const name = "dini/headers";

const DINIDate = new Intl.DateTimeFormat(["de-DE"], {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "2-digit",
});

const status2text = {
  unofficial: "Entwurf vom",
  base: "Spezifikation vom",
};

/**
 * @param {*} conf
 * @param {string} prop
 * @param {string | number | Date} fallbackDate
 */
function validateDateAndRecover(conf, prop, fallbackDate = new Date()) {
  const date = conf[prop] ? new Date(conf[prop]) : new Date(fallbackDate);
  // if date is valid
  if (Number.isFinite(date.valueOf())) {
    const formattedDate = ISODate.format(date);
    return new Date(formattedDate);
  }
  const msg =
    `[\`${prop}\`](https://github.com/w3c/respec/wiki/${prop}) ` +
    `is not a valid date: "${conf[prop]}". Expected format 'YYYY-MM-DD'.`;
  showError(msg, name);
  return new Date(ISODate.format(new Date()));
}

export function run(conf) {
  conf.isUnofficial = conf.specStatus === "unofficial";
  conf.isBasic = conf.specStatus === "base";
  if (!conf.specStatus) {
    const msg = "Missing required configuration: `specStatus`";
    showError(msg, name);
  }
  conf.title = document.title || "Kein Titel";
  if (!conf.subtitle) conf.subtitle = "";
  conf.publishDate = validateDateAndRecover(
    conf,
    "publishDate",
    document.lastModified
  );
  conf.publishYear = conf.publishDate.getUTCFullYear();
  conf.publishHumanDate = DINIDate.format(conf.publishDate);
  const peopCheck = function (it) {
    if (!it.name) {
      const msg = "All authors and editors must have a name.";
      showError(msg, name);
    }
    if (it.orcid) {
      try {
        it.orcid = normalizeOrcid(it.orcid);
      } catch (e) {
        const msg = `"${it.orcid}" is not an ORCID. ${e.message}`;
        showError(msg, name);
        // A failed orcid link could link to something outside of orcid,
        // which would be misleading.
        delete it.orcid;
      }
    }
  };
  if (!conf.formerEditors) conf.formerEditors = [];
  if (conf.editors) {
    conf.editors.forEach(peopCheck);
    // Move any editors with retiredDate to formerEditors.
    for (let i = 0; i < conf.editors.length; i++) {
      const editor = conf.editors[i];
      if ("retiredDate" in editor) {
        conf.formerEditors.push(editor);
        conf.editors.splice(i--, 1);
      }
    }
  }
  if (!conf.editors || conf.editors.length === 0) {
    const msg = "At least one editor is required";
    showError(msg, name);
  }
  if (conf.formerEditors.length) {
    conf.formerEditors.forEach(peopCheck);
  }
  if (conf.authors) {
    conf.authors.forEach(peopCheck);
  }
  conf.multipleEditors = conf.editors && conf.editors.length > 1;
  conf.multipleFormerEditors = conf.formerEditors.length > 1;
  conf.multipleAuthors = conf.authors && conf.authors.length > 1;
  (conf.alternateFormats || []).forEach(it => {
    if (!it.uri || !it.label) {
      const msg = "All alternate formats must have a uri and a label.";
      showError(msg, name);
    }
  });
  if (conf.copyrightStart && conf.copyrightStart == conf.publishYear)
    conf.copyrightStart = "";
  conf.textStatus = status2text[conf.specStatus];
  conf.dashDate = ISODate.format(conf.publishDate);
  conf.publishISODate = conf.publishDate.toISOString();
  // configuration done - yay!

  // insert into document
  const header = headersTmpl(conf);
  document.body.prepend(header);
  document.body.classList.add("h-entry");

  // Requested by https://github.com/w3c/respec/issues/504
  // Makes a record of a few auto-generated things.
  pub("amend-user-config", {
    publishISODate: conf.publishISODate,
    generatedSubtitle: `${conf.longStatus} ${conf.publishHumanDate}`,
  });
}

/**
 * @param {string} orcid Either an ORCID URL or just the 16-digit ID which comes after the /
 * @return {string} the full ORCID URL. Throws an error if the ID is invalid.
 */
function normalizeOrcid(orcid) {
  const orcidUrl = new URL(orcid, "https://orcid.org/");
  if (orcidUrl.origin !== "https://orcid.org") {
    throw new Error(
      `The origin should be "https://orcid.org", not "${orcidUrl.origin}".`
    );
  }

  // trailing slash would mess up checksum
  const orcidId = orcidUrl.pathname.slice(1).replace(/\/$/, "");
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(orcidId)) {
    throw new Error(
      `ORCIDs have the format "1234-1234-1234-1234", not "${orcidId}"`
    );
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
    throw new Error(`"${orcidId}" has an invalid checksum.`);
  }

  return orcidUrl.href;
}
