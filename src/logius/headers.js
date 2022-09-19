// @ts-check
// Module logius/headers
// todo strip w3c specific content
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
//  - edDraftURI: the URI of the Editor's Draft for this document, if any. Required if
//      specStatus is set to "ED".
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
//  - thisVersion: the URI to the dated current version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - latestVersion: the URI to the latest (undated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - prevVersion: the URI to the previous (dated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
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

/* pieter hering start synced with w3c version */
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
import { lang } from "../core/l10n.js";
import { pub } from "../core/pubsubhub.js";
import sotdTmpl from "./templates/sotd.js";
/* pieter hering end synced with w3c version */

// Thijs Brentjens: customize in the logius/templates directory
// (see above)

export const name = "logius/headers";

const localizationStrings = {
  en: {
    sotd: "Status of This Document",
    wv: "Draft",
    cv: "Recommendation",
    vv: "Proposed recommendation",
    def: "Definitive version",
    basis: "Document",
    eo: "Outdated version",
    tg: "Rescinded version",
    no: "Norm",
    st: "Standard",
    im: "Information model",
    pr: "Guideline",
    hr: "Guide",
    wa: "Proposed recommendation",
    al: "General",
    bd: "Governance documentation",
    bp: "Best practice",
  },
  nl: {
    sotd: "Status van dit document",
    wv: "Werkversie",
    cv: "Consultatieversie",
    vv: "Versie ter vaststelling",
    def: "Vastgestelde versie",
    basis: "Document",
    eo: "Verouderde versie",
    tg: "Teruggetrokken versie",
    no: "Norm",
    st: "Standaard",
    im: "Informatiemodel",
    pr: "Praktijkrichtlijn",
    hr: "Handreiking",
    wa: "Werkafspraak",
    al: "Algemeen",
    bd: "Beheerdocumentatie",
    bp: "Best practice",
  },
};

export const l10n = getIntlData(localizationStrings);

const NLRespecDate = new Intl.DateTimeFormat(["nl"], {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "2-digit",
});

// Thijs Brentjens: added Geonovum statusses
// https://github.com/Logius-standaarden/respec/wiki/specStatus
// pieter hering inserted generic names and added two statuses
const status2text = {
  WV: l10n.wv,
  CV: l10n.cv,
  VV: l10n.vv,
  DEF: l10n.def,
  BASIS: l10n.basis,
  EO: l10n.eo,
  TG: l10n.tg,
  "GN-WV": "Werkversie",
  "GN-CV": "Consultatieversie",
  "GN-VV": "Versie ter vaststelling",
  "GN-DEF": "Vastgestelde versie",
  "GN-BASIS": "Document",
};

// Thijs Brentjens: added Geonovum types
// https://github.com/Logius-standaarden/respec/wiki/specType
// pieter hering inserted generic names and added two statuses
const type2text = {
  NO: l10n.no,
  ST: l10n.st,
  IM: l10n.im,
  PR: l10n.pr,
  HR: l10n.hr,
  WA: l10n.wa,
  AL: l10n.al,
  BD: l10n.bd,
  BP: l10n.bp,
};

const status2long = {
  // "FPWD-NOTE": "First Public Working Group Note",
  // "LC-NOTE": "Last Call Working Draft",
};

const noTrackStatus = []; // empty? or only "GN-BASIS"?
// Thijs Brentjens: default licenses for Geonovum to version 4.0
// todo make fixed, static urls flexible
const licenses = {
  cc0: {
    name: "Creative Commons 0 Public Domain Dedication",
    short: "CC0",
    url: "https://creativecommons.org/publicdomain/zero/1.0/",
    image: "https://tools.geostandaarden.nl/respec/style/logos/CC-Licentie.svg",
  },
  "cc-by": {
    name: "Creative Commons Attribution 4.0 International Public License",
    short: "CC-BY",
    url: "https://creativecommons.org/licenses/by/4.0/legalcode",
    image: "https://tools.geostandaarden.nl/respec/style/logos/cc-by.svg",
  },
  "cc-by-nd": {
    name: "Creative Commons Naamsvermelding-GeenAfgeleideWerken 4.0 Internationaal",
    short: "CC-BY-ND",
    url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode.nl",
    image: "https://tools.geostandaarden.nl/respec/style/logos/cc-by-nd.svg",
  },
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
  const msg = docLink`${prop} is not a valid date: "${conf[prop]}". Expected format 'YYYY-MM-DD'.`;
  showError(msg, name);
  return new Date(ISODate.format(new Date()));
}

export function run(conf) {
  // Thijs Brentjens: TODO: decide by default unofficial?
  // conf.isUnofficial = conf.specStatus === "unofficial";

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
  conf.hasBeenPublished = conf.publishDate ? true : false;
  // Thijs Brentjens: TODO: document license types for Geonovum
  conf.isCCBY = conf.license === "cc-by";
  conf.isCCBYND = conf.license === "cc-by-nd";

  conf.licenseInfo = licenses[conf.license];
  conf.isBasic = conf.specStatus === "base";
  // Thijs Brentjens: TODO: for a GN-BASIS document, is it necesary to deal differently with URIs? Especially for "Laatst gepubliceerde versie"
  // Deal with all current GN specStatusses the same. This is mostly seen in the links in the header for Last editor's draft etc
  // conf.isRegular = conf.specStatus !== "GN-BASIS";
  conf.isRegular = true;
  conf.isOfficial = conf.specStatus === "GN-DEF" || conf.specStatus === "DEF";

  if (!conf.specStatus) {
    const msg = "Missing required configuration: `specStatus`";
    showError(msg, name);
  }
  if (conf.isRegular && !conf.shortName) {
    const msg = "Missing required configuration: `shortName`";
    showError(msg, name);
  }

  // inserted from w3c or skip this part
  // todo check fixed, static urls
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
  // end insertion from w3c

  conf.title = document.title || "No Title";
  if (!conf.subtitle) conf.subtitle = "";
  conf.publishDate = validateDateAndRecover(
    conf,
    "publishDate",
    document.lastModified
  );
  conf.publishYear = conf.publishDate.getUTCFullYear();

  // pieter added: override date with LastModified date when specStatus =="WV"
  conf.publishHumanDate = NLRespecDate.format(
    conf.specStatus != "WV" ? conf.publishDate : new Date(document.lastModified)
  );
  conf.isNoTrack = noTrackStatus.includes(conf.specStatus);

  // todo fixed, static url
  if (!conf.edDraftURI) {
    conf.edDraftURI = "";
    // Thijs Brentjens: deal with editors draft links based on Github URIs
    if (conf.github) {
      // parse the org and repo name to construct a github.io URI if a github URI is provided
      // https://github.com/Logius-standaarden/respec/issues/141
      // https://github.com/{org}/{repo} should be rewritten to https://{org}.github.io/{repo}/
      const githubParts = conf.github.split("github.com/")[1].split("/");
      conf.edDraftURI = `https://${githubParts[0]}.github.io/${githubParts[1]}`;
    }
    // todo no clear 'ED' status in this version
    if (conf.specStatus === "ED") {
      const msg = "Editor's Drafts should set edDraftURI.";
      showWarning(msg, name);
    }
  }
  // Version URLs
  // Thijs Brentjens: changed this to Geonovum specific format. See https://github.com/Geonovum/respec/issues/126
  if (!conf.nl_organisationPublishURL) {
    conf.nl_organisationPublishURL = "https://docs.geostandaarden.nl/";
  } else {
    if (!conf.nl_organisationPublishURL.endsWith("/"))
      conf.nl_organisationPublishURL += "/";
  }

  // pieter added subdomain
  const subdomain = conf.shortName ? `${conf.shortName}/` : ``;

  const specStatus = conf.specStatus.includes("GN")
    ? conf.specStatus.substr(3).toLowerCase()
    : conf.specStatus.toLowerCase();
  // eslint-disable-next-line prettier/prettier
  if (conf.isRegular && conf.specStatus !== "GN-WV" && conf.specStatus !== "WV" && conf.specStatus == "DEF") // pieter added: only link to publication server when specStatus == "DEF
  {
    if (!conf.publishVersion) {
      // eslint-disable-next-line prettier/prettier
      conf.thisVersion = `${conf.nl_organisationPublishURL}${conf.pubDomain}/${subdomain}${specStatus}-${conf.specType.toLowerCase()}-${conf.shortName}-${concatDate(conf.publishDate)}/`;
    } else {
      // Logius specific
      conf.thisVersion = `${conf.nl_organisationPublishURL}${conf.pubDomain}/${subdomain}${conf.publishVersion}`;
    }
  } else {
    conf.thisVersion = conf.edDraftURI;
  }

  // Only show latestVersion if a publishDate has been set. see issue https://github.com/Geonovum/respec/issues/93
  // todo check path generation
  if (conf.isRegular && conf.hasBeenPublished)
    // Thijs Brentjens: see
    conf.latestVersion = `${conf.nl_organisationPublishURL}${conf.pubDomain}/${conf.shortName}/`;

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
    const prevStatus = conf.previousStatus.includes("GN")
      ? conf.previousStatus.substr(3).toLowerCase()
      : conf.previousStatus.toLowerCase();

    // Thijs Brentjens: default to current spectype
    // TODO: should the prev-/spectype always be in the WP URL too?
    let prevType = "";
    if (conf.previousType) {
      prevType = conf.previousType.toLowerCase();
    } else {
      prevType = conf.specType.toLowerCase();
    }
    conf.prevVersion = `None${conf.previousPublishDate}`;
    if (!conf.previousPublishVersion) {
      // eslint-disable-next-line prettier/prettier
      conf.prevVersion = `${conf.nl_organisationPublishURL}${conf.pubDomain}/${subdomain}${prevStatus}-${prevType}-${conf.shortName}-${concatDate(conf.previousPublishDate)}/`;
    } else {
      // eslint-disable-next-line prettier/prettier
      conf.prevVersion = `${conf.nl_organisationPublishURL}${conf.pubDomain}/${subdomain}${conf.previousPublishVersion}/`;
    }
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
  /*
  conf.multipleAlternates =
    conf.alternateFormats && conf.alternateFormats.length > 1;
  conf.alternatesHTML =
    conf.alternateFormats &&
    htmlJoinAnd(conf.alternateFormats, alt => {
      let optional =
        alt.hasOwnProperty("lang") && alt.lang ? ` hreflang='${alt.lang}'` : "";
      optional +=
        alt.hasOwnProperty("type") && alt.type ? ` type='${alt.type}'` : "";
      return `<a rel='alternate' href='${alt.uri}'${optional}>${alt.label}</a>`;
    });
*/
  if (conf.bugTracker) {
    if (conf.bugTracker.new && conf.bugTracker.open) {
      conf.bugTrackerHTML = `<a href='${conf.bugTracker.new}'>${conf.l10n.file_a_bug}</a> ${conf.l10n.open_parens}<a href='${conf.bugTracker.open}'>${conf.l10n.open_bugs}</a>${conf.l10n.close_parens}`;
    } else if (conf.bugTracker.open) {
      conf.bugTrackerHTML = `<a href='${conf.bugTracker.open}'>open bugs</a>`;
    } else if (conf.bugTracker.new) {
      conf.bugTrackerHTML = `<a href='${conf.bugTracker.new}'>file a bug</a>`;
    }
  }
  if (conf.copyrightStart && conf.copyrightStart == conf.publishYear)
    conf.copyrightStart = "";
  for (const k in status2text) {
    if (status2long[k]) continue;
    status2long[k] = status2text[k];
  }
  conf.longStatus = status2long[conf.specStatus];
  conf.textStatus = status2text[conf.specStatus];
  // Thijs: added typeStatus
  conf.typeStatus = type2text[conf.specType];

  conf.showThisVersion = !conf.isNoTrack; // || conf.isTagFinding;
  // Thijs Brentjens: adapted for Geonovum document tyoes
  // TODO: add an extra check, because now it seems that showPreviousVersion is true in (too) many cases?
  conf.showPreviousVersion = !conf.isNoTrack && !conf.isSubmission;
  // Thijs Brentjens: only show if prevVersion is available
  // todo check GN STATUSES in templates
  if (!conf.prevVersion) conf.showPreviousVersion = false;
  // Thijs: get specStatus from Geonovum list https://github.com/Logius-standaarden/respec/wiki/specStatus
  // Pieter: added generic checks
  conf.isDEF = conf.specStatus === "GN-DEF" || conf.specStatus === "DEF";
  conf.isWV = conf.specStatus === "GN-WV" || conf.specStatus === "WV";
  conf.isCV = conf.specStatus === "GN-CV" || conf.specStatus === "CV";
  conf.isVV = conf.specStatus === "GN-VV" || conf.specStatus === "VV";
  conf.isBASIS = conf.specStatus === "GN-BASIS" || conf.specStatus === "BASIS";

  // added two extra conf parameters
  // todo check if logius will still use
  conf.isNLEO = conf.specStatus === "EO";
  conf.isGNTG = conf.specStatus === "TG";

  conf.dashDate = ISODate.format(conf.publishDate);
  conf.publishISODate = conf.publishDate.toISOString();
  conf.shortISODate = ISODate.format(conf.publishDate);

  // todo Pieter: do we need these?
  Object.defineProperty(conf, "wgId", {
    get() {
      if (!this.hasOwnProperty("wgPatentURI")) {
        return "";
      }
      // it's always at "pp-impl" + 1
      const urlParts = this.wgPatentURI.split("/");
      const pos = urlParts.findIndex(item => item === "pp-impl") + 1;
      return urlParts[pos] || "";
    },
  });
  // configuration done - yay!

  /*
  const options = {
    get multipleAlternates() {
      return conf.alternateFormats && conf.alternateFormats.length > 1;
    },
    get alternatesHTML() {
      return (
        conf.alternateFormats &&
        htmlJoinAnd(conf.alternateFormats, alt => {
          const lang = alt.hasOwnProperty("lang") && alt.lang ? alt.lang : null;
          const type = alt.hasOwnProperty("type") && alt.type ? alt.type : null;
          return html`<a
            rel="alternate"
            href="${alt.uri}"
            hreflang="${lang}"
            type="${type}"
            >${alt.label}</a
          >`;
        })
      );
    },
  };

*/
  // w3c version

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

  // todo Pieter: is the comment below valid in this version?
  // NOTE:
  //  When arrays, wg and wgURI have to be the same length (and in the same order).
  //  Technically wgURI could be longer but the rest is ignored.
  //  However wgPatentURI can be shorter. This covers the case where multiple groups
  //  publish together but some aren't used for patent policy purposes (typically this
  //  happens when one is foolish enough to do joint work with the TAG). In such cases,
  //  the groups whose patent policy applies need to be listed first, and wgPatentURI
  //  can be shorter — but it still needs to be an array.
  const wgPotentialArray = [conf.wg, conf.wgURI, conf.wgPatentURI];
  if (
    wgPotentialArray.some(item => Array.isArray(item)) &&
    !wgPotentialArray.every(item => Array.isArray(item))
  ) {
    pub(
      "error",
      "If one of '`wg`', '`wgURI`', or '`wgPatentURI`' is an array, they all have to be."
    );
  }
  // todo Pieter valid?
  if (Array.isArray(conf.wg)) {
    conf.multipleWGs = conf.wg.length > 1;
    conf.wgHTML = htmlJoinAnd(conf.wg, (wg, idx) => {
      return html`the <a href="${conf.wgURI[idx]}">${wg}</a>`;
    });
    const pats = [];
    for (let i = 0, n = conf.wg.length; i < n; i++) {
      pats.push(
        `a <a href='${conf.wgPatentURI[i]}' rel='disclosure'>` +
          `public list of any patent disclosures  (${conf.wg[i]})</a>`
      );
    }
    conf.wgPatentHTML = htmlJoinAnd(pats);
  } else {
    conf.multipleWGs = false;
    conf.wgHTML = `the <a href='${conf.wgURI}'>${conf.wg}</a>`;
  }
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

  html.bind(sotd)`${populateSoTD(conf, sotd)}`;

  if (!conf.implementationReportURI && (conf.isCR || conf.isPR || conf.isRec)) {
    pub(
      "error",
      "CR, PR, and REC documents need to have an `implementationReportURI` defined."
    );
  }

  // Requested by https://github.com/w3c/respec/issues/504
  // Makes a record of a few auto-generated things.
  pub("amend-user-config", {
    publishISODate: conf.publishISODate,
    generatedSubtitle: `${conf.longStatus} ${conf.publishHumanDate}`,
  });
}

// todo: pieter commented out
/**
 * @param {*} conf
 * @param {HTMLElement} sotd
 */
// function populateSoTD(conf, sotd) {

//   const sotdClone = sotd.cloneNode(true);
//   const additionalNodes = document.createDocumentFragment();
//   const additionalContent = document.createElement("temp");
//   // we collect everything until we hit a section,
//   // that becomes the custom content.
//   while (sotdClone.hasChildNodes()) {
//     if (
//       sotdClone.firstChild.nodeType !== Node.ELEMENT_NODE ||
//       sotdClone.firstChild.localName !== "section"
//     ) {
//       additionalNodes.appendChild(sotdClone.firstChild);
//       continue;
//     }
//     break;
//   }
//   additionalContent.appendChild(additionalNodes);
//   conf.additionalContent = additionalContent.innerHTML;
//   // Whatever sections are left, we throw at the end.
//   conf.additionalSections = sotdClone.innerHTML;
//   return sotdTmpl(conf);
// }

// todo revert geonvum alterations
/**
 * @param {*} conf
 * @param {HTMLElement} sotd
 */
function populateSoTD(conf, sotd) {
  if (!conf.nl_organisationName) {
    conf.nl_organisationName = "";
  }
  const options = {
    ...collectSotdContent(sotd, conf),
    get specDocument() {
      let article = "";
      if (lang.toLowerCase() == "nl") {
        conf.specType == "IM" ? (article = "het ") : (article = "de ");
      }
      return `${article} ${conf.typeStatus.toLowerCase()}`;
    },
    get operationalCommittee() {
      let operationalCommittee = "";

      switch (conf.nl_organisationName.toLowerCase()) {
        case "logius":
          operationalCommittee = "het Technisch Overleg";
          break;
        default:
          // Geonovum = 1
          operationalCommittee = "de werkgroep";
          break;
      }
      return operationalCommittee;
    },
    get emailComments() {
      if (!conf.nl_emailcomments && !conf.emailcomments) {
        switch (conf.nl_organisationName.toLowerCase()) {
          case "logius": // Logius
            conf.nl_emailcomments = "api@logius.nl";
            break;
          case "geonovum":
          default:
            // Geonovum
            conf.nl_emailcomments = "geo-standaarden@geonovum.nl";
            conf.emailcomments = "geo-standaarden@geonovum.nl";
            break;
        }
      }
      return `${conf.nl_emailcomments}`;
    },
    get emailCommentsMailto() {
      return `mailto:${this.emailComments}`;
    },
    get emailCommentsMailtoSubject() {
      const fragment = conf.subjectPrefix
        ? `?subject=${encodeURIComponent(conf.subjectPrefix)}`
        : "";
      return this.emailCommentsMailto + fragment;
    },
  };
  const template = sotdTmpl;
  return template(conf, options);
}

/**
 * @param {HTMLElement} sotd
 */
function collectSotdContent(sotd, { isTagFinding = false }) {
  const sotdClone = sotd.cloneNode(true);
  const additionalContent = document.createDocumentFragment();
  // we collect everything until we hit a section,
  // that becomes the custom content.
  while (sotdClone.hasChildNodes()) {
    if (
      isElement(sotdClone.firstChild) &&
      sotdClone.firstChild.localName === "section"
    ) {
      break;
    }
    additionalContent.appendChild(sotdClone.firstChild);
  }
  if (isTagFinding && !additionalContent.hasChildNodes()) {
    pub(
      "warn",
      "ReSpec does not support automated SotD generation for TAG findings, " +
        "please add the prerequisite content in the 'sotd' section"
    );
  }
  return {
    additionalContent,
    // Whatever sections are left, we throw at the end.
    additionalSections: sotdClone.childNodes,
  };
}

/**
 * @param {Node} node
 * @return {node is Element}
 */
function isElement(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}
