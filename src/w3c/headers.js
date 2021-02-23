// @ts-check
// Module w3c/headers
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
//  - formerEditors: an array of people that had earlier edited the document but no longer edit.
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
//          - each logo element must specify either src or alt
//  - testSuiteURI: the URI to the test suite, if any
//  - implementationReportURI: the URI to the implementation report, if any
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
//      - "cc-by", which is experimentally available in some groups (but likely to be phased out).
//          Note that this is a dual licensing regime.
//      - "cc0", an extremely permissive license. It is only recommended if you are working on a document that is
//          intended to be pushed to the WHATWG.
//      - "w3c-software", a permissive and attributions license (but GPL-compatible).
//      - "w3c-software-doc", (default) the W3C Software and Document License
//            https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
import {
  ISODate,
  concatDate,
  docLink,
  htmlJoinAnd,
  showError,
  showWarning,
} from "../core/utils.js";
import cgbgHeadersTmpl from "./templates/cgbg-headers.js";
import cgbgSotdTmpl from "./templates/cgbg-sotd.js";
import headersTmpl from "./templates/headers.js";
import { html } from "../core/import-maps.js";
import { pub } from "../core/pubsubhub.js";
import sotdTmpl from "./templates/sotd.js";

export const name = "w3c/headers";

const W3CDate = new Intl.DateTimeFormat(["en-AU"], {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "2-digit",
});

const status2maturity = {
  LS: "WD",
  LD: "WD",
  FPWD: "WD",
  LC: "WD",
  FPLC: "WD",
  "FPWD-NOTE": "NOTE",
  "WD-NOTE": "WD",
  "LC-NOTE": "LC",
  "IG-NOTE": "NOTE",
  "WG-NOTE": "NOTE",
};

const status2rdf = {
  NOTE: "w3p:NOTE",
  WD: "w3p:WD",
  LC: "w3p:LastCall",
  CR: "w3p:CR",
  CRD: "w3p:CRD",
  PR: "w3p:PR",
  REC: "w3p:REC",
  PER: "w3p:PER",
  RSCND: "w3p:RSCND",
};
const status2text = {
  NOTE: "Working Group Note",
  "WG-NOTE": "Working Group Note",
  "CG-NOTE": "Co-ordination Group Note",
  "IG-NOTE": "Interest Group Note",
  "Member-SUBM": "Member Submission",
  "Team-SUBM": "Team Submission",
  MO: "Member-Only Document",
  ED: "Editor's Draft",
  LS: "Living Standard",
  LD: "Living Document",
  FPWD: "First Public Working Draft",
  WD: "Working Draft",
  "FPWD-NOTE": "Working Group Note",
  "WD-NOTE": "Working Draft",
  "LC-NOTE": "Working Draft",
  FPLC: "First Public and Last Call Working Draft",
  LC: "Last Call Working Draft",
  CR: "Candidate Recommendation",
  CRD: "Candidate Recommendation",
  PR: "Proposed Recommendation",
  PER: "Proposed Edited Recommendation",
  REC: "Recommendation",
  RSCND: "Rescinded Recommendation",
  unofficial: "Unofficial Draft",
  base: "Document",
  finding: "TAG Finding",
  "draft-finding": "Draft TAG Finding",
  "CG-DRAFT": "Draft Community Group Report",
  "CG-FINAL": "Final Community Group Report",
  "BG-DRAFT": "Draft Business Group Report",
  "BG-FINAL": "Final Business Group Report",
};
const status2long = {
  ...status2text,
  CR: "Candidate Recommendation Snapshot",
  CRD: "Candidate Recommendation Draft",
  "FPWD-NOTE": "First Public Working Group Note",
  "LC-NOTE": "Last Call Working Draft",
};
const maybeRecTrack = ["FPWD", "WD"];
const recTrackStatus = ["FPLC", "LC", "CR", "CRD", "PR", "PER", "REC"];
export const cgStatus = ["CG-DRAFT", "CG-FINAL"];
export const bgStatus = ["BG-DRAFT", "BG-FINAL"];
export const cgbgStatus = [...cgStatus, ...bgStatus];
const noTrackStatus = [
  "base",
  ...cgStatus,
  ...bgStatus,
  "draft-finding",
  "finding",
  "MO",
  "unofficial",
];
const precededByAn = ["ED", "IG-NOTE"];
const licenses = new Map([
  [
    "cc0",
    {
      name: "Creative Commons 0 Public Domain Dedication",
      short: "CC0",
      url: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  ],
  [
    "w3c-software",
    {
      name: "W3C Software Notice and License",
      short: "W3C Software",
      url:
        "https://www.w3.org/Consortium/Legal/2002/copyright-software-20021231",
    },
  ],
  [
    "w3c-software-doc",
    {
      name: "W3C Software and Document Notice and License",
      short: "W3C Software and Document",
      url:
        "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document",
    },
  ],
  [
    "cc-by",
    {
      name: "Creative Commons Attribution 4.0 International Public License",
      short: "CC-BY",
      url: "https://creativecommons.org/licenses/by/4.0/legalcode",
    },
  ],
]);

const baseLogo = Object.freeze({
  id: "",
  alt: "",
  href: "",
  src: "",
  height: "48",
  width: "72",
});

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
  if (!conf.specStatus) {
    const msg = `Missing required configuration: ${docLink("specStatus")}.`;
    const hint = `Please select an appropriate status from ${docLink(
      "specStatus"
    )} based on your W3C group. If in doubt, use \`"unofficial"\`.`;
    showError(msg, name, { hint });
  }
  conf.isUnofficial = conf.specStatus === "unofficial";
  if (conf.isUnofficial && !Array.isArray(conf.logos)) {
    conf.logos = [];
  }
  if (conf.isUnofficial) {
    if (conf.license && !licenses.has(conf.license)) {
      const msg = `The ${docLink(
        "license"
      )} configuration option has an invalid value: "\`${
        conf.license
      }\`". Defaulting to "cc-by".`;
      const licensesKeys = [...licenses.keys()]
        .map(key => `\`"${key}"\``)
        .join(", ");
      const hint = `Please explicitly set ${docLink(
        "license"
      )} to one of: ${licensesKeys}.`;
      showError(msg, name, { hint });
      conf.license = "cc-by";
    }
    // default it to cc-by
    if (conf.license === undefined) {
      conf.license = "cc-by";
    }
  }

  conf.isCCBY = conf.license === "cc-by";
  conf.isW3CSoftAndDocLicense = conf.license === "w3c-software-doc";
  if (!conf.isUnofficial && ["cc-by"].includes(conf.license)) {
    const msg = `You cannot use license "\`${conf.license}\`" with W3C Specs.`;
    const hint = `Please set ${docLink(
      "license"
    )} to "w3c-software-doc" instead.`;
    showError(msg, name, { hint });
  }
  conf.licenseInfo = licenses.get(conf.license);
  conf.isCGBG = cgbgStatus.includes(conf.specStatus);
  conf.isCGFinal = conf.isCGBG && conf.specStatus.endsWith("G-FINAL");
  conf.isBasic = conf.specStatus === "base";
  conf.isRegular = !conf.isCGBG && !conf.isBasic;

  if (conf.isRegular && !conf.shortName) {
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
        `Please update your ${docLink("testSuiteURI")} to point to the ` +
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
  conf.publishHumanDate = W3CDate.format(conf.publishDate);
  conf.isNoTrack = noTrackStatus.includes(conf.specStatus);
  conf.isRecTrack = conf.noRecTrack
    ? false
    : recTrackStatus.concat(maybeRecTrack).includes(conf.specStatus);
  conf.isMemberSubmission = conf.specStatus === "Member-SUBM";
  if (conf.isMemberSubmission) {
    const memSubmissionLogo = {
      alt: "W3C Member Submission",
      href: "https://www.w3.org/Submission/",
      src: "https://www.w3.org/Icons/member_subm-v.svg",
      width: "211",
    };
    conf.logos.push({ ...baseLogo, ...memSubmissionLogo });
  }
  conf.isTeamSubmission = conf.specStatus === "Team-SUBM";
  if (conf.isTeamSubmission) {
    const teamSubmissionLogo = {
      alt: "W3C Team Submission",
      href: "https://www.w3.org/TeamSubmission/",
      src: "https://www.w3.org/Icons/team_subm-v.svg",
      width: "211",
    };
    conf.logos.push({ ...baseLogo, ...teamSubmissionLogo });
  }
  conf.isSubmission = conf.isMemberSubmission || conf.isTeamSubmission;
  conf.anOrA = precededByAn.includes(conf.specStatus) ? "an" : "a";
  conf.isTagFinding =
    conf.specStatus === "finding" || conf.specStatus === "draft-finding";

  if (conf.isRecTrack && !hasGitHubIssuesLink(conf)) {
    const msg = `Rec-track documents must link to Github issues from their head.`;
    const hint = `Please use the [\`github\`](https://respec.org/docs/#github) configuration option.`;
    showError(msg, name, { hint });
  }
  if (!conf.edDraftURI) {
    conf.edDraftURI = "";
    if (conf.specStatus === "ED") {
      const msg = "Editor's Drafts should set edDraftURI.";
      showWarning(msg, name);
    }
  }
  conf.maturity = status2maturity[conf.specStatus]
    ? status2maturity[conf.specStatus]
    : conf.specStatus;
  let publishSpace = "TR";
  if (conf.specStatus === "Member-SUBM") publishSpace = "Submission";
  else if (conf.specStatus === "Team-SUBM") publishSpace = "TeamSubmission";
  if (conf.isRegular)
    conf.thisVersion = `https://www.w3.org/${publishSpace}/${conf.publishDate.getUTCFullYear()}/${
      conf.maturity
    }-${conf.shortName}-${concatDate(conf.publishDate)}/`;
  if (conf.specStatus === "ED") conf.thisVersion = conf.edDraftURI;
  const skipLatestVersion =
    conf.specStatus === "ED" && conf.latestVersion === null;
  if (conf.isRegular && !skipLatestVersion)
    conf.latestVersion = `https://www.w3.org/${publishSpace}/${conf.shortName}/`;
  if (conf.isTagFinding) {
    conf.latestVersion = `https://www.w3.org/2001/tag/doc/${conf.shortName}`;
    conf.thisVersion = `${conf.latestVersion}-${ISODate.format(
      conf.publishDate
    )}`;
  }
  if (conf.previousPublishDate) {
    if (!conf.previousMaturity && !conf.isTagFinding) {
      const msg = "`previousPublishDate` is set, but not `previousMaturity`.";
      showError(msg, name);
    }

    conf.previousPublishDate = validateDateAndRecover(
      conf,
      "previousPublishDate"
    );

    const pmat = status2maturity[conf.previousMaturity]
      ? status2maturity[conf.previousMaturity]
      : conf.previousMaturity;
    if (conf.isTagFinding) {
      conf.prevVersion = `${conf.latestVersion}-${ISODate.format(
        conf.previousPublishDate
      )}`;
    } else if (conf.isCGBG) {
      conf.prevVersion = conf.prevVersion || "";
    } else if (conf.isBasic) {
      conf.prevVersion = "";
    } else {
      conf.prevVersion = `https://www.w3.org/TR/${conf.previousPublishDate.getUTCFullYear()}/${pmat}-${
        conf.shortName
      }-${concatDate(conf.previousPublishDate)}/`;
    }
  } else {
    if (
      !conf.specStatus.endsWith("NOTE") &&
      conf.specStatus !== "FPWD" &&
      conf.specStatus !== "FPLC" &&
      conf.specStatus !== "ED" &&
      !conf.noRecTrack &&
      !conf.isNoTrack &&
      !conf.isSubmission
    ) {
      const msg = "Document on track but no previous version.";
      const hint =
        "Add [`previousMaturity`](https://respec.org/docs/#previousMaturity) " +
        "and [`previousPublishDate`](https://respec.org/docs/#previousPublishDate) to ReSpec's config.";
      showError(msg, name, { hint });
    }
    if (!conf.prevVersion) conf.prevVersion = "";
  }
  if (conf.prevRecShortname && !conf.prevRecURI)
    conf.prevRecURI = `https://www.w3.org/TR/${conf.prevRecShortname}`;
  const peopCheck = function (it) {
    if (!it.name) {
      const msg = "All authors and editors must have a `name` property.";
      const hint =
        "See [Person](https://respec.org/docs/#person) configuration for available options.";

      showError(msg, name, { hint });
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
  conf.longStatus = status2long[conf.specStatus];
  conf.textStatus = status2text[conf.specStatus];
  if (status2rdf[conf.specStatus]) {
    conf.rdfStatus = status2rdf[conf.specStatus];
  }
  conf.showThisVersion = !conf.isNoTrack || conf.isTagFinding;
  conf.showPreviousVersion =
    conf.specStatus !== "FPWD" &&
    conf.specStatus !== "FPLC" &&
    conf.specStatus !== "ED" &&
    !conf.isNoTrack &&
    !conf.isSubmission;
  if (conf.specStatus.endsWith("NOTE") && !conf.prevVersion)
    conf.showPreviousVersion = false;
  if (conf.isTagFinding)
    conf.showPreviousVersion = conf.previousPublishDate ? true : false;
  conf.notYetRec = conf.isRecTrack && conf.specStatus !== "REC";
  conf.isRec = conf.isRecTrack && conf.specStatus === "REC";
  if (conf.isRec && !conf.errata) {
    const msg = "Recommendations must have an errata link.";
    const hint =
      "Add an [`errata`](https://respec.org/docs/#errata) URL to your respecConfig.";
    showError(msg, name, { hint });
  }
  conf.prependW3C = !conf.isUnofficial;
  conf.isED = conf.specStatus === "ED";
  conf.isCR = conf.specStatus === "CR" || conf.specStatus === "CRD";
  conf.isCRDraft = conf.specStatus === "CRD";
  conf.isPR = conf.specStatus === "PR";
  conf.isPER = conf.specStatus === "PER";
  conf.isMO = conf.specStatus === "MO";
  conf.isNote = ["FPWD-NOTE", "WG-NOTE"].includes(conf.specStatus);
  conf.isIGNote = conf.specStatus === "IG-NOTE";
  conf.dashDate = ISODate.format(conf.publishDate);
  conf.publishISODate = conf.publishDate.toISOString();
  conf.shortISODate = ISODate.format(conf.publishDate);
  if (
    conf.wgPatentPolicy &&
    !["PP2017", "PP2020"].includes(conf.wgPatentPolicy)
  ) {
    const msg =
      "Invalid [`wgPatentPolicy`](https://respec.org/docs#wgPatentPolicy) value.";
    const hint = 'Please use `"PP2017"` or `"PP2020"`.';
    showError(msg, name, { hint });
  }
  if (conf.hasOwnProperty("wgPatentURI") && !Array.isArray(conf.wgPatentURI)) {
    Object.defineProperty(conf, "wgId", {
      get() {
        // it's always at "pp-impl" + 1
        const urlParts = this.wgPatentURI.split("/");
        const pos = urlParts.findIndex(item => item === "pp-impl") + 1;
        return urlParts[pos] || "";
      },
    });
  } else {
    conf.wgId = conf.wgId ? conf.wgId : "";
  }
  // configuration done - yay!

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

  // insert into document
  const header = (conf.isCGBG ? cgbgHeadersTmpl : headersTmpl)(conf, options);
  document.body.prepend(header);
  document.body.classList.add("h-entry");

  // handle SotD
  const sotd =
    document.getElementById("sotd") || document.createElement("section");
  if ((conf.isCGBG || !conf.isNoTrack || conf.isTagFinding) && !sotd.id) {
    const msg =
      "A custom SotD paragraph is required for your type of document.";
    showError(msg, name);
  }
  sotd.id = sotd.id || "sotd";
  sotd.classList.add("introductory");
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
    const msg =
      "If one of '`wg`', '`wgURI`', or '`wgPatentURI`' is an array, they all have to be.";
    showError(msg, name);
  }
  if (conf.isCGBG && !conf.wg) {
    const msg =
      "[`wg`](https://github.com/w3c/respec/wiki/wg)" +
      " configuration option is required for this kind of document.";
    showError(msg, name);
  }
  if (Array.isArray(conf.wg)) {
    conf.multipleWGs = conf.wg.length > 1;
    conf.wgHTML = htmlJoinAnd(conf.wg, (wg, idx) => {
      return html`the <a href="${conf.wgURI[idx]}">${wg}</a>`;
    });
    const pats = [];
    for (let i = 0, n = conf.wg.length; i < n; i++) {
      pats.push(
        html`a
          <a href="${conf.wgPatentURI[i]}" rel="disclosure"
            >public list of any patent disclosures (${conf.wg[i]})</a
          >`
      );
    }
    conf.wgPatentHTML = htmlJoinAnd(pats);
  } else {
    conf.multipleWGs = false;
    if (conf.wg) {
      conf.wgHTML = html`the <a href="${conf.wgURI}">${conf.wg}</a>`;
    }
  }
  if (conf.specStatus === "PR" && !conf.crEnd) {
    const msg =
      '`specStatus` is "PR" but no `crEnd` is specified (needed to indicate end of previous CR).';
    showError(msg, name);
  }

  if (conf.specStatus === "CR" && !conf.crEnd) {
    const msg =
      '`specStatus` is "CR", but no `crEnd` is specified in Respec config.';
    showError(msg, name);
  }
  conf.crEnd = validateDateAndRecover(conf, "crEnd");
  conf.humanCREnd = W3CDate.format(conf.crEnd);

  if (conf.specStatus === "PR" && !conf.prEnd) {
    const msg = `\`specStatus\` is "PR" but no \`prEnd\` is specified.`;
    showError(msg, name);
  }
  conf.prEnd = validateDateAndRecover(conf, "prEnd");
  conf.humanPREnd = W3CDate.format(conf.prEnd);

  if (conf.specStatus === "PER" && !conf.perEnd) {
    const msg = "Status is PER but no perEnd is specified";
    showError(msg, name);
  }
  conf.perEnd = validateDateAndRecover(conf, "perEnd");
  conf.humanPEREnd = W3CDate.format(conf.perEnd);

  const revisionTypes = ["addition", "correction"];
  if (
    conf.specStatus === "REC" &&
    conf.revisionTypes &&
    conf.revisionTypes.length > 0
  ) {
    const unknownRevisionType = conf.revisionTypes.find(
      x => !revisionTypes.includes(x)
    );
    if (unknownRevisionType) {
      const msg = `\`specStatus\` is "REC" with unknown revision type '${unknownRevisionType}'`;
      showError(msg, name);
    }
    if (conf.revisionTypes.includes("addition") && !conf.updateableRec) {
      const msg = `\`specStatus\` is "REC" with proposed additions but the Rec is not marked as a allowing new features.`;
      showError(msg, name);
    }
  }

  if (
    conf.specStatus === "REC" &&
    conf.updateableRec &&
    conf.revisionTypes &&
    conf.revisionTypes.length > 0 &&
    !conf.revisedRecEnd
  ) {
    const msg = `\`specStatus\` is "REC" with proposed corrections or additions but no \`revisedRecEnd\` is specified.`;
    showError(msg, name);
  }
  conf.revisedRecEnd = validateDateAndRecover(conf, "revisedRecEnd");
  conf.humanRevisedRecEnd = W3CDate.format(conf.revisedRecEnd);

  conf.recNotExpected =
    conf.noRecTrack || conf.recNotExpected
      ? true
      : !conf.isRecTrack &&
        conf.maturity == "WD" &&
        conf.specStatus !== "FPWD-NOTE";
  if (conf.noRecTrack && recTrackStatus.includes(conf.specStatus)) {
    const msg = `Document configured as [\`noRecTrack\`](https://github.com/w3c/respec/wiki/noRecTrack), but its status ("${conf.specStatus}") puts it on the W3C Rec Track.`;
    const hint = `Status cannot be any of: ${recTrackStatus.join(", ")}.`;
    showError(msg, name, { hint });
  }
  if (conf.isIGNote && !conf.charterDisclosureURI) {
    const msg =
      "IG-NOTEs must link to charter's disclosure section using `charterDisclosureURI`.";
    showError(msg, name);
  }
  if (!sotd.classList.contains("override")) {
    html.bind(sotd)`${populateSoTD(conf, sotd)}`;
  }

  if (!conf.implementationReportURI && conf.isCR) {
    const msg =
      "CR documents must have an [`implementationReportURI`](https://github.com/w3c/respec/wiki/implementationReportURI) that describes [implementation experience](https://www.w3.org/2019/Process-20190301/#implementation-experience).";
    showError(msg, name);
  }
  if (!conf.implementationReportURI && conf.isPR) {
    const msg =
      "PR documents should include an " +
      " [`implementationReportURI`](https://github.com/w3c/respec/wiki/implementationReportURI) that describes [implementation experience](https://www.w3.org/2019/Process-20190301/#implementation-experience).";
    showWarning(msg, name);
  }

  // Requested by https://github.com/w3c/respec/issues/504
  // Makes a record of a few auto-generated things.
  pub("amend-user-config", {
    publishISODate: conf.publishISODate,
    generatedSubtitle: `${conf.longStatus} ${conf.publishHumanDate}`,
  });
}

/**
 * @param {*} conf
 * @param {HTMLElement} sotd
 */
function populateSoTD(conf, sotd) {
  const options = {
    ...collectSotdContent(sotd, conf),

    get mailToWGPublicList() {
      return `mailto:${conf.wgPublicList}@w3.org`;
    },
    get mailToWGPublicListWithSubject() {
      const fragment = conf.subjectPrefix
        ? `?subject=${encodeURIComponent(conf.subjectPrefix)}`
        : "";
      return this.mailToWGPublicList + fragment;
    },
    get mailToWGPublicListSubscription() {
      return `mailto:${conf.wgPublicList}-request@w3.org?subject=subscribe`;
    },
  };
  const template = conf.isCGBG ? cgbgSotdTmpl : sotdTmpl;
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
    const msg = `ReSpec does not support automated SotD generation for TAG findings.`;
    const hint = `Please add the prerequisite content in the 'sotd' section.`;
    showWarning(msg, name, { hint });
  }
  return {
    additionalContent,
    // Whatever sections are left, we throw at the end.
    additionalSections: sotdClone.childNodes,
  };
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

/**
 * @param {Node} node
 * @return {node is Element}
 */
function isElement(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}

function hasGitHubIssuesLink(conf) {
  return (
    conf.github ||
    (conf.otherLinks &&
      conf.otherLinks.find(linkGroup =>
        linkGroup.data.find(
          l =>
            l.href &&
            l.href.toString().match(/^https:\/\/github\.com\/.*\/issues/)
        )
      ))
  );
}
