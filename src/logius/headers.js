// @ts-check
// Module logius/headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
//  - shortName: the small name that is used after /TR/ in published reports (required)
//  - editors: an array of people editing the document (at least one is required). People
//      are defined using:
//          - name: the person's name (required)
//          - url: URI for the person's home page
//          - company: the person's company
//          - companyURL: the URI for the person's company
//          - mailto: the person's email
//          - note: a note on the person (e.g. former editor)
//  - authors: an array of people who are contributing authors of the document.
//  - subtitle: a subtitle for the specification
//  - publishDate: the date to use for the publication, default to document.lastModified, and
//      failing that to now. The format is YYYY-MM-DD or a Date object.
//  - previousPublishDate: the date on which the previous version was published.
//  - previousMaturity: the specStatus of the previous version
//  - errata: the URI of the errata document, if any
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
//          - each logo element must specifiy either src or alt
//  - testSuiteURI: the URI to the test suite, if any
//  - implementationReportURI: the URI to the implementation report, if any
//  - bugTracker: and object with the following details
//      - open: pointer to the list of open bugs
//      - new: pointer to where to raise new bugs
//  - noRecTrack: set to true if this document is not intended to be on the Recommendation track
//  - additionalCopyrightHolders: a copyright owner in addition to W3C (or the only one if specStatus
//      is unofficial)
//  - overrideCopyright: provides markup to completely override the copyright
//  - copyrightStart: the year from which the copyright starts running
//  - prevED: the URI of the previous Editor's Draft if it has moved
//  - prevRecShortname: the short name of the previous Recommendation, if the name has changed
//  - prevRecURI: the URI of the previous Recommendation if not directly generated from
//    prevRecShortname.
//  - wg: the name of the WG in charge of the document. This may be an array in which case wgURI
//      and wgPatentURI need to be arrays as well, of the same length and in the same order
//  - wgURI: the URI to the group's page, or an array of such
//  - wgPatentURI: the URI to the group's patent information page, or an array of such. NOTE: this
//      is VERY IMPORTANT information to provide and get right, do not just paste this without checking
//      that you're doing it right
//  - wgPublicList: the name of the mailing list where discussion takes place. Note that this cannot
//      be an array as it is assumed that there is a single list to discuss the document, even if it
//      is handled by multiple groups
//  - charterDisclosureURI: used for IGs (when publishing IG-NOTEs) to provide a link to the IPR commitment
//      defined in their charter.
//  - addPatentNote: used to add patent-related information to the SotD, for instance if there's an open
//      PAG on the document.
//  - subjectPrefix: the string that is expected to be used as a subject prefix when posting to the mailing
//      list of the group.
//  - otherLinks: an array of other links that you might want in the header (e.g., link github, twitter, etc).
//         Example of usage: [{key: "foo", href:"https://b"}, {key: "bar", href:"https://"}].
//         Allowed values are:
//          - key: the key for the <dt> (e.g., "Bug Tracker"). Required.
//          - value: The value that will appear in the <dd> (e.g., "GitHub"). Optional.
//          - href: a URL for the value (e.g., "https://foo.com/issues"). Optional.
//          - class: a string representing CSS classes. Optional.
//  - license: can be one of the following
//      - "w3c", currently the default (restrictive) license
//      - "cc-by", which is experimentally available in some groups (but likely to be phased out).
//          Note that this is a dual licensing regime.
//      - "cc0", an extremely permissive license. It is only recommended if you are working on a document that is
//          intended to be pushed to the WHATWG.
//      - "w3c-software", a permissive and attributions license (but GPL-compatible).
//      - "w3c-software-doc", the W3C Software and Document License
//            https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document

import {
  ISODate,
  concatDate,
  docLink,
  getIntlData,
  htmlJoinAnd,
  showError,
  showWarning,
} from "../core/utils.js";
import headersTmpl from "./templates/headers.js";
import { html } from "../core/import-maps.js";
import { pub } from "../core/pubsubhub.js";
import sotdTmpl from "./templates/sotd.js";

export const name = "logius/headers";

const NLRespecDate = new Intl.DateTimeFormat(["nl"], {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "2-digit",
});

const noTrackStatus = []; // empty? or only "GN-BASIS"?

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
  const msg = docLink`${prop} is not a valid date: "${conf[prop]}". Expected format 'YYYY-MM-DD'.`;
  showError(msg, name);
  return new Date(ISODate.format(new Date()));
}

export function run(conf) {
  conf.isUnofficial = true;
  if (!conf.logos || !conf.useLogo) {
    // conf.isUnofficial
    conf.logos = [];
  }
  conf.specStatus = conf.specStatus ? conf.specStatus.toUpperCase() : "";
  if (!conf.specType) {
    const msg = `SpecType is not defined`;
    const hint = `set config.specType to see https://github.com/Logius-standaarden/respec/wiki/specType`;
    showWarning(msg, name, { hint });
  }
  conf.specType = conf.specType ? conf.specType.toUpperCase() : "";

  conf.pubDomain = conf.pubDomain ? conf.pubDomain.toLowerCase() : "";
  conf.hasBeenPublished = !!conf.publishDate;

  conf.licenseInfo = conf.licenses[conf.license.toLowerCase()];

  if (!conf.specStatus) {
    const msg = "Missing required configuration: `specStatus`";
    showError(msg, name);
  }
  if (!conf.shortName) {
    const msg = "Missing required configuration: `shortName`";
    showError(msg, name);
  }

  if (conf.testSuiteURI) {
    const url = new URL(conf.testSuiteURI, location.href);
    const { host, pathname } = url;
    if (
      host === "github.com" &&
      pathname.startsWith("/w3c/web-platform-tests/")
    ) {
      const msg =
        "Web Platform Tests have moved to a new Github Organization at https://github.com/web-platform-tests. ";
      const hint =
        "Please update your [`testSuiteURI`](https://respec.org/docs/#testSuiteURI) to point to the " +
        `new tests repository (e.g., https://github.com/web-platform-tests/wpt/tree/master/${conf.shortName} ).`;
      showWarning(msg, name, { hint });
    }
  }

  if (!conf.subtitle) conf.subtitle = "";
  conf.publishDate = validateDateAndRecover(
    conf,
    "publishDate",
    document.lastModified
  );
  conf.publishYear = conf.publishDate.getUTCFullYear();
  conf.isNoTrack = noTrackStatus.includes(conf.specStatus);

  conf.publishHumanDate = NLRespecDate.format(
    conf.specStatus != "WV" ? conf.publishDate : new Date(document.lastModified)
  );

  // Version URLs
  // Thijs Brentjens: changed this to Geonovum specific format. See https://github.com/Geonovum/respec/issues/126
  if (!conf.nl_organisationPublishURL) {
    conf.nl_organisationPublishURL = "https://default.nl/";
  } else {
    if (!conf.nl_organisationPublishURL.endsWith("/"))
      conf.nl_organisationPublishURL += "/";
  }

  // Thijs Brentjens: support previousMaturity as previousStatus
  if (conf.previousMaturity && !conf.previousStatus)
    conf.previousStatus = conf.previousMaturity;
  // Thijs Brentjens: default to current specStatus if previousStatus is not provided
  if (
    (conf.previousPublishDate || conf.previousPublishVersion) &&
    !conf.previousStatus
  )
    conf.previousStatus = conf.specStatus;
  if (
    (conf.previousPublishDate || conf.previousPublishVersion) &&
    conf.previousStatus
  ) {
    conf.previousPublishDate = validateDateAndRecover(
      conf,
      "previousPublishDate"
    );
  }

  const peopCheck = function (it) {
    if (!it.name) {
      const msg = "All authors and editors must have a `name` property.";
      const hint =
        "See [Person](https://respec.org/docs/#person) configuration for available options.";
      showError(msg, name, { hint });
    }
  };
  if (conf.editors) {
    conf.editors.forEach(peopCheck);
  }
  if (conf.authors) {
    conf.authors.forEach(peopCheck);
  }
  conf.multipleEditors = conf.editors && conf.editors.length > 1;
  conf.multipleAuthors = conf.authors && conf.authors.length > 1;
  (conf.alternateFormats || []).forEach(it => {
    if (!it.uri || !it.label) {
      const msg = "All alternate formats must have a uri and a label.";
      showError(msg, name);
    }
  });

  if (conf.copyrightStart && conf.copyrightStart == conf.publishYear)
    conf.copyrightStart = "";
  if (!conf.specStatusText) {
    conf.specStatusText = conf.localizationStrings;
  }
  conf.statusText = getIntlData(conf.specStatusText)[
    conf.specStatus.toLowerCase()
  ];
  if (!conf.specTypeText) {
    conf.specTypeText = conf.localizationStrings;
  }
  conf.typeText = getIntlData(conf.specTypeText)[conf.specType.toLowerCase()];

  conf.showThisVersion = !conf.isNoTrack; // || conf.isTagFinding;
  conf.showPreviousVersion = !conf.isNoTrack && !conf.isSubmission;
  if (!conf.prevVersion) conf.showPreviousVersion = false;

  conf.dashDate = ISODate.format(conf.publishDate);
  conf.publishISODate = conf.publishDate.toISOString();
  conf.shortISODate = ISODate.format(conf.publishDate);

  const options = {
    get multipleAlternates() {
      return conf.alternateFormats && conf.alternateFormats.length > 1;
    },
    get alternatesHTML() {
      return (
        conf.alternateFormats &&
        htmlJoinAnd(
          // We need to pass a string here...
          conf.alternateFormats.map(({ label }) => label),
          (_, i) => {
            const alt = conf.alternateFormats[i];
            return html`<a
              rel="alternate"
              href="${alt.uri}"
              hreflang="${alt?.lang ?? null}"
              type="${alt?.type ?? null}"
              >${alt.label}</a
            >`;
          }
        )
      );
    },
  };

  function createUrlFromArray(input) {
    let unresolved = false;
    let url = "";
    if (!Array.isArray(input)) {
      if (input != "") {
        showError(
          `URI config option expected to be an array. Input: <code>${input}</code>`,
          "headers.js"
        );
      }
      return;
    }
    input.forEach(i => {
      if (!conf[i]) {
        if (i.length > 3) {
          showWarning(
            `URI config option expected <code>${i}</code> to be in config.`,
            "headers.js"
          );
          unresolved = true;
        }
        url += i;
      } else {
        if (i === "github") {
          url += conf.github.repoURL;
        } else if (i === "publishDate" || i === "previousPublishDate") {
          url += concatDate(conf[i]);
        } else {
          url += conf[i];
        }
      }
    });
    if (unresolved) {
      return;
    }
    return url.toLowerCase();
  }

  if (!conf.thisVersion) {
    conf.thisVersion = [
      "nl_organisationPublishURL",
      "pubDomain",
      "/",
      "specStatus",
      "-",
      "specType",
      "-",
      "shortName",
      "-",
      "publishDate",
    ];
  }
  conf.thisVersion = createUrlFromArray(conf.thisVersion);
  if (!conf.latestVersion) {
    conf.latestVersion = [
      "nl_organisationPublishURL",
      "pubDomain",
      "/",
      "shortName",
    ];
  }
  conf.latestVersion = createUrlFromArray(conf.latestVersion);
  if (!conf.prevVersion) {
    conf.prevVersion = [
      "nl_organisationPublishURL",
      "pubDomain",
      "/",
      "previousMaturity",
      "-",
      "specType",
      "-",
      "shortName",
      "-",
      "previousPublishDate",
    ];
  }
  conf.prevVersion = createUrlFromArray(conf.prevVersion);
  if (Array.isArray(conf.edDraftURI)) {
    conf.edDraftURI = createUrlFromArray(conf.edDraftURI);
  }
  if (conf.specStatus == "WV") {
    conf.thisVersion = conf.edDraftURI;
  }

  // insert into document
  const header = headersTmpl(conf, options);
  document.body.insertBefore(header, document.body.firstChild);
  document.body.classList.add("h-entry");

  // handle SotD
  const sotd =
    document.getElementById("sotd") || document.createElement("section");
  if (!conf.isNoTrack && !sotd.id) {
    pub(
      "error",
      "A custom SotD paragraph is required for your type of document."
    );
  }
  sotd.id = sotd.id || "stod";
  sotd.classList.add("introductory");

  if (conf.specStatus === "PR" && !conf.crEnd) {
    pub(
      "error",
      `\`specStatus\` is "PR" but no \`crEnd\` is specified (needed to indicate end of previous CR).`
    );
  }

  if (conf.specStatus === "CR" && !conf.crEnd) {
    pub(
      "error",
      `\`specStatus\` is "CR", but no \`crEnd\` is specified in Respec config.`
    );
  }
  conf.crEnd = validateDateAndRecover(conf, "crEnd");
  conf.humanCREnd = NLRespecDate.format(conf.crEnd);

  if (conf.specStatus === "PR" && !conf.prEnd) {
    const msg = `\`specStatus\` is "PR" but no \`prEnd\` is specified.`;
    showError(msg, name);
  }
  conf.prEnd = validateDateAndRecover(conf, "prEnd");
  conf.humanPREnd = NLRespecDate.format(conf.prEnd);

  if (conf.specStatus === "PER" && !conf.perEnd) {
    const msg = "Status is PER but no perEnd is specified";
    showError(msg, name);
  }
  conf.perEnd = validateDateAndRecover(conf, "perEnd");
  conf.humanPEREnd = NLRespecDate.format(conf.perEnd);

  if (conf.subjectPrefix !== "")
    conf.subjectPrefixEnc = encodeURIComponent(conf.subjectPrefix);

  html.bind(sotd)`${populateSoTD(conf)}`;

  if (!conf.implementationReportURI && (conf.isCR || conf.isPR || conf.isRec)) {
    pub(
      "error",
      "CR, PR, and REC documents need to have an `implementationReportURI` defined."
    );
  }
}

/**
 * @param {*} conf
 */
function populateSoTD(conf) {
  if (!conf.nl_organisationName) {
    conf.nl_organisationName = "";
  }
  const template = sotdTmpl;
  return template(conf);
}
