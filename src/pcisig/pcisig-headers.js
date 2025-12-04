/*jshint
    forin: false
*/
/*global hb*/

// Module pcisig/headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION
//  - specStatus: the short code for the specification's status or type (required)
//  - specRevision: the revision of the spec (e.g., PCIe Base 4.0 would be 4.0) (required)
//  - specDraftLevel: the short code for the specification's Draft Level (required)
//      Even numbers (0.2, 0.4, ...) are WG internal drafts.
//      Odd numbers are published drafts (0.1, 0.3, 0.5, 0.7, 0.71, 0.9, ...)
//      1.0 is the published final release
//  - specChapter: if present, indicates this document is a chapter of a specification.
//      If specChapter is present, "final" values of specStatus will be converted to RC
//      (we don't publish final "chapters")
//  - shortName: the small name that is used after /Spec/ in published reports (required)
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
//  - previousStatus: the specStatus of the previous version
//  - previousRevision: the specRevisioun of the previous version
//  - previousDraftLevel: the specDraftLevel of the previous version
//  - errata: the URI of the errata document, if any
//  - alternateFormats: a list of alternate formats for the document, each of which being
//      defined by:
//          - uri: the URI to the alternate
//          - label: a label for the alternate
//          - lang: optional language
//          - type: optional MIME type
//  - logos: a list of logos to use instead of the PCI Express logo, each of which being defined by:
//          - src: the URI to the logo (target of <img src=>)
//          - alt: alternate text for the image (<img alt=>), defaults to "Logo" or "Logo 1", "Logo 2", ...
//            if src is not specified, this is the text of the "logo"
//          - height: optional height of the logo (<img height=>)
//          - width: optional width of the logo (<img width=>)
//          - url: the URI to the organization represented by the logo (target of <a href=>)
//          - id: optional id for the logo, permits custom CSS (wraps logo in <span id=>)
//          - each logo element must specifiy either src or alt
//  - bugTracker: and object with the following details
//      - open: pointer to the list of open bugs
//      - new: pointer to where to raise new bugs
//  - noSpecTrack: set to true if this document is not intended to be on the Specification track
//  - additionalCopyrightHolders: a copyright owner in addition to PCISIG (or the only one if specStatus
//      is unofficial)
//  - overrideCopyright: provides markup to completely override the copyright
//  - copyrightStart: the year from which the copyright starts running
//  - wg: the name of the WG in charge of the document. This may be an array.
//  - otherLinks: an array of other links that you might want in the header (e.g., link github, twitter, etc).
//         Example of usage: [{key: "foo", href:"https://b"}, {key: "bar", href:"https://"}].
//         Allowed values are:
//          - key: the key for the <dt> (e.g., "Bug Tracker"). Required.
//          - value: The value that will appear in the <dd> (e.g., "GitHub"). Optional.
//          - href: a URL for the value (e.g., "https://foo.com/issues"). Optional.
//          - class: a string representing CSS classes. Optional.
//  - license: can be one of the following
//      - "nda", document covered by workgroup NDA agreement (this is the default)
//      - "pcisig", the default pcisig license for published specifications
//      - "cc0", an extremely permissive license. Only recommended for documents intended for use
//            outside of PCISIG.


import { concatDate, joinAnd, ISODate } from "../core/utils.js";
import hb from "../deps/handlebars.runtime.js";
import { pub } from "../core/pubsubhub.js";
import tmpls from "../deps/templates.js";

export const name = "pcisig/headers";

const headersTmpl = tmpls["pcisig-headers"];

const PCISIGDate = new Intl.DateTimeFormat(["en-AU"], {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "2-digit",
});

hb.registerHelper("showPeople", function (name, items = []) {
  // stuff to handle RDFa
  let re = "",
    rp = "",
    rm = "",
    rn = "",
    rwu = "",
    rpu = "",
    bn = "",
    editorid = "",
    propSeeAlso = "";
  if (this.doRDFa) {
    if (name === "Editor") {
      bn = "_:editor0";
      re = " property='bibo:editor' resource='" + bn + "'";
      rp = " property='rdf:first' typeof='foaf:Person'";
    } else if (name === "Author") {
      rp = " property='dc:contributor' typeof='foaf:Person'";
    }
    rn = " property='foaf:name'";
    rm = " property='foaf:mbox'";
    rwu = " property='foaf:workplaceHomepage'";
    rpu = " property='foaf:homepage'";
    propSeeAlso = " property='rdfs:seeAlso'";
  }
  let ret = "";
  for (let i = 0, n = items.length; i < n; i++) {
    let p = items[i];
    if (p.pcisigid) {
      editorid = " data-editor-id='" + parseInt(p.pcisigid, 10) + "'";
    }
    if (this.doRDFa) {
      ret +=
        "<dd class='p-author h-card vcard' " +
        re +
        editorid +
        "><span" +
        rp +
        ">";
      if (name === "Editor") {
        // Update to next sequence in rdf:List
        bn = i < n - 1 ? "_:editor" + (i + 1) : "rdf:nil";
        re = " resource='" + bn + "'";
      }
    } else {
      ret += "<dd class='p-author h-card vcard'" + editorid + ">";
    }
    if (p.url) {
      if (this.doRDFa) {
        ret +=
          "<meta" +
          rn +
          " content='" +
          p.name +
          "'><a class='u-url url p-name fn' " +
          rpu +
          " href='" +
          p.url +
          "'>" +
          p.name +
          "</a>";
      } else
        ret +=
          "<a class='u-url url p-name fn' href='" +
          p.url +
          "'>" +
          p.name +
          "</a>";
    } else {
      ret += "<span" + rn + " class='p-name fn'>" + p.name + "</span>";
    }
    if (p.company) {
      ret += ", ";
      if (p.companyURL)
        ret +=
          "<a" +
          rwu +
          " class='p-org org h-org h-card' href='" +
          p.companyURL +
          "'>" +
          p.company +
          "</a>";
      else ret += p.company;
    }
    if (p.mailto) {
      ret +=
        ", <span class='ed_mailto'><a class='u-email email' " +
        rm +
        " href='mailto:" +
        p.mailto +
        "'>" +
        p.mailto +
        "</a></span>";
    }
    if (p.note) ret += " (" + p.note + ")";
    if (p.extras) {
      let self = this;
      let resultHTML = p.extras
      // Remove empty names
        .filter(function (extra) {
          return extra.name && extra.name.trim();
        })
        // Convert to HTML
        .map(function (extra) {
          let span = document.createElement("span");
          let textContainer = span;
          if (extra.class) {
            span.className = extra.class;
          }
          if (extra.href) {
            let a = document.createElement("a");
            span.appendChild(a);
            a.href = extra.href;
            textContainer = a;
            if (self.doRDFa) {
              a.setAttribute("property", "rdfs:seeAlso");
            }
          }
          textContainer.innerHTML = extra.name;
          return span.outerHTML;
        })
        .join(", ");
      ret += ", " + resultHTML;
    }
    if (this.doRDFa) {
      ret += "</span>\n";
      if (name === "Editor")
        ret += "<span property='rdf:rest' resource='" + bn + "'></span>\n";
    }
    ret += "</dd>\n";
  }
  return new hb.SafeString(ret);
});

function toLogo(obj) {
  const a = document.createElement("a");
  if (!obj.alt) {
    const msg = "Found spec logo without an `alt` attribute. See dev console.";
    a.classList.add("respec-offending-element");
    pub("warn", msg);
    console.warn("warn", msg, a);
  }
  a.href = obj.href ? obj.href : "";
  a.classList.add("logo");
  hyperHTML.bind(a)`
      <img
        id="${obj.id}"
        alt="${obj.alt}"
        width="${obj.width}"
        height="${obj.height}">
  `;
  // avoid triggering 404 requests from dynamically generated
  // hyperHTML attribute values
  a.querySelector("img").src = obj.src;
  return a;
}

hb.registerHelper("showLogos", logos => {
  const p = document.createElement("p");
  hyperHTML.bind(p)`${logos.map(toLogo)}`;
  return p.outerHTML;
});

const status2rdf = {
  "WG-NOTE": "pcisigp:NOTE",
  "WG-DRAFT-NOTE": "pcisigp:NOTE",
  "PUB-NOTE": "pcisigp:NOTE",
  "PUB-DRAFT-NOTE": "pcisigp:NOTE",
  WD: "pcisigp:WD",
  "WD-CWG": "pcisigp:WD",
  "WD-MEM": "pcisigp:WD",
  "WD-FINAL": "pcisigp:WD",
  RC: "pcisigp:RC",
  "RC-CWG": "pcisigp:RC",
  "RC-MEM": "pcisigp:RC",
  "RC-FINAL": "pcisigp:RC",
  PUB: "pcisigp:CWG",
  "PUB-CWG": "pcisigp:CWG",
  "PUB-MEM": "pcisigp:MEM",
  "PUB-FINAL": "pcisigp:FINAL",
  FINAL: "pcisigp:FINAL",

  RESCINDED: "pcisigp:RESCINDED",
  REPLACED: "pcisigp:REPLACED",
  PRIVATE: "pcisigp:PRIVATE"
};
const status2text = {
  "WG-DRAFT-NOTE": "Draft Working Group Note",
  "WG-NOTE": "Working Group Note",
  "PUB-DRAFT-NOTE": "Published Draft Note",
  "PUB-NOTE": "Published Note",
  "member-private": "Member Private Document",
  "member-submission": "Member Submission",
  "team-private": "Team Private Document",
  "team-submission": "Team Submission",

  WD: "Working Draft",
  "WD-CWG": "Working Draft",
  "WD-MEM": "Working Draft",
  "WD-FINAL": "Working Draft",

  RC: "Release Candidate",
  "RC-CWG": "Release Candidate",
  "RC-MEM": "Release Candidate",
  "RC-FINAL": "Release Candidate",

  PUB: "Draft Spec.",
  "PUB-CWG": "Draft Spec.",
  "PUB-MEM": "Draft Spec.",
  "PUB-FINAL": "Final Spec.",
  FINAL: "Final Spec.",

  RESCINDED: "Specification Rescinded",
  REPLACED: "Specification Replaced",
  PRIVATE: "Private Document",
  unofficial: "Unofficial Document",
  base: "Document",
};
const status2long = {
  WD: "Unpublished Working Draft",
  RC: "Unpublished Release Candidate",
  PUB: "Published Specification",
  "WD-CWG": "Unpublished Cross Workgroup Review Working Draft",
  "RC-CWG": "Unpublished Cross Workgroup Review Release Candidate",
  "PUB-CWG": "Published Cross Workgroup Review Draft",
  "WD-MEM": "Unpublished Member Review Working Draft",
  "RC-MEM": "Unpublished Member Review Release Candidate",
  "RC-FINAL": "Unpublished Final Release Candidate",
  "WD-FINAL": "Unpublished Final Working Draft",
  "PUB-MEM": "Published Member Review Draft",
  FINAL: "Published Final Specification"
};
const specTrackStatus = [
  "WD", "RC", "PUB", "FINAL",
  "WD-CWG", "RC-CWG", "PUB-CWG",
  "WD-MEM", "RC-MEM", "PUB-MEM",
  "WD-FINAL", "RC-FINAL", "PUB-FINAL"
];

// Chapters are never published standalone. if conf.specChapter is present,
// this map is used to convert "final" specStatus values to equivalent "RC" values.
const specFinal2Draft = {
  "WD": "WD",
  "RC": "RC",
  "PUB": "RC",
  "FINAL": "RC",
  "WD-CWG": "WD-CWG",
  "RC-CWG": "RC-CWG",
  "PUB-CWG": "RC-CWG",
  "WD-MEM": "WD-MEM",
  "RC-MEM": "RC-MEM",
  "PUB-MEM": "RC-MEM",
  "WD-FINAL": "WD-FINAL",
  "RC-FINAL": "RC-FINAL",
  "PUB-FINAL": "RC-FINAL"
};

const noTrackStatus = [
  "unofficial",
  "private",
  "base",
  "note",
  "draft-note",
  "member-private",
  "member-submission",
  "team-private",
  "team-submission"
];
const precededByAn = ["unofficial"];  // specStatus values that should grammatically be preceded by an instead of a.

const licenses = {
  "pcisig-draft": {
    name: "PCISIG Specification License",
    short: "PCISIG Spec",
    url: "https://sglaser.github.io/respec/Spec/Legal/2017/copyright-draft-specification",
    click_through: false
  },
  "pcisig-draft-click-through": {
    name: "PCISIG Specification License",
    short: "PCISIG Spec",
    url: "https://sglaser.github.io/respec/Spec/Legal/2017/copyright-draft-specification",
    click_through: false
  },
  "pcisig-final": {
    name: "PCISIG Specification License",
    short: "PCISIG Spec",
    url: "https://sglaser.github.io/respec/Spec/Legal/2017/copyright-final-specification",
    click_through: false
  },
  "pcisig-final-click-through": {
    name: "PCISIG Click-Through Specification License",
    short: "PCISIG Spec (Click Through License)",
    url: "https://sglaser.github.io/respec/Spec/Legal/2017/copyright-final-click-through-specification",
    click_through: true
  },
  "pcisig-note": {
    name: "PCISIG Note, Whitepaper, or Presentation License",
    short: "PCISIG Spec",
    url: "https://sglaser.github.io/respec/Spec/Legal/2017/copyright-note",
    click_through: false
  },
  "nda": {
    name: "PCISIG Non-Disclosure Agreement",
    short: "PCISIG NDA",
    url: "https://sglaser.github.io/respec/Spec/Legal/2017/copyright-nda",
    click_through: false
  },
  cc0: {
    name: "Creative Commons 0 Public Domain Dedication",
    short: "CC0",
    url: "https://creativecommons.org/publicdomain/zero/1.0/",
    click_through: false
  }
};

const baseLogo = Object.freeze({
  id: "",
  alt: "",
  href: "",
  src: "",
  height: "48",
  width: "72",
});

function validateDateAndRecover(conf, prop, fallbackDate = new Date()) {
  const date = conf[prop] ? new Date(conf[prop]) : new Date(fallbackDate);
  // if date is valid
  if (Number.isFinite(date.valueOf())) {
    const formattedDate = ISODate.format(date);
    return new Date(formattedDate);
  }
  const msg =
    `[${prop}](https://github.com/pcisig/respec/wiki/${prop}) ` +
    `is not a valid date: "${conf[prop]}". Expected format 'YYYY-MM-DD'.`;
  pub("error", msg);
  return new Date(ISODate.format(new Date()));
}

export function run(conf, doc, cb) {
  // TODO: move to pcisig defaults
  if (!conf.logos) {
    conf.logos = [];
  }
  if (conf.specStatus && conf.specChapter && specFinal2Draft.hasOwnProperty(conf.specStatus)){
    conf.specStatus = specFinal2Draft[conf.specStatus];
  }
  // Default include RDFa document metadata
  if (conf.doRDFa === undefined) conf.doRDFa = true;
  // validate configuration and derive new configuration values
  if (!conf.license) {
    conf.license = "nda";
  }
  if (["cc0"].includes(conf.license)) {
    let msg = `You cannot use license "${conf.license}" with PCISIG Specs. `;
    let non_cc0 = licenses.keys.remove("cc0").toString();
    msg += `Please set 'respecConfig.license:' to one of ${non_cc0} instead.`;
    pub("error", msg);
  }
  conf.licenseInfo = licenses[conf.license];
  conf.isClickThrough = conf.licenseInfo.click_through;
  if (["final"].includes(conf.license)) {
    if (conf.specChapter) {
      conf.license = conf.license.sub("final", "draft");
    }
  }
  conf.isBasic = conf.specStatus === "base";
  conf.isRegular = !conf.isBasic;
  if (!conf.specStatus) {
    pub("error", "Missing required configuration: `specStatus`");
  }

  if (conf.isRegular && !conf.shortName) {
    pub("error", "Missing required configuration: `shortName`");
  }
  conf.title = doc.title || "No Title";
  if (!conf.subtitle) conf.subtitle = "";
  conf.publishDate = validateDateAndRecover(
    conf,
    "publishDate",
    doc.lastModified
  );
  conf.publishYear = conf.publishDate.getUTCFullYear().toString();
  conf.publishHumanDate = PCISIGDate.format(conf.publishDate);
  conf.isNoTrack = noTrackStatus.includes(conf.specStatus) || conf.specChapter;
  conf.isSpecTrack = conf.noSpecTrack
    ? false
    : specTrackStatus.includes(conf.specStatus);
  if (conf.isSpecTrack && !conf.specRevision) {
    pub("error", "Missing required configuration: `specRevision`");
  }
  if (conf.isSpecTrack && !conf.specDraftLevel) {
    pub("error", "Missing required configuration: `specDraftLevel`");
  }
  conf.isMemberPrivate = conf.specStatus === "member-private";
  if (conf.isMemberPrivate) {
    const memPrivateLogo = {
      alt: "PCISIG Member Private",
      href: "https://sglaser.github.io/respec/Spec/MemberSubmission/Private/",
      src: "https://sglaser.github.io/respec/Spec/Icons/member_private.svg",
      width: "211",
    };
    conf.logos.push({...baseLogo, ...memPrivateLogo});
  }
  conf.isMemberSubmission = conf.specStatus === "member-submission";
  if (conf.isMemberSubmission) {
    const memSubmissionLogo = {
      alt: "PCISIG Member Submission",
      href: "https://sglaser.github.io/respec/Spec/MemberSubmission/",
      src: "https://sglaser.github.io/respec/Spec/Icons/member_submission.svg",
      width: "211",
    };
    conf.logos.push({...baseLogo, ...memSubmissionLogo});
  }
  conf.isTeamPrivate = conf.specStatus === "team-private";
  if (conf.isTeamPrivate) {
    const teamPrivateLogo = {
      alt: "PCISIG Team Private",
      href: "https://sglaser.github.io/respec/Spec/TeamSubmission/Private/",
      src: "https://sglaser.github.io/respec/Spec/Icons/team_private.svg",
      width: "211",
    };
    conf.logos.push({...baseLogo, ...teamPrivateLogo});
  }
  conf.isTeamSubmission = conf.specStatus === "team-submission";
  if (conf.isTeamSubmission) {
    const teamSubmissionLogo = {
      alt: "PCISIG Team Submission",
      href: "https://sglaser.github.io/respec/Spec/TeamSubmission/",
      src: "https://sglaser.github.io/respec/Spec/Icons/team_submmission.svg",
      width: "211",
    };
    conf.logos.push({...baseLogo, ...teamSubmissionLogo});
  }
  conf.isSubmission = conf.isMemberSubmission || conf.isTeamSubmission;
  conf.isPrivate = conf.isMemberPrivate || conf.isPrivate || conf.specStatus === "private";
  conf.anOrA = precededByAn.includes(conf.specStatus) ? "an" : "a";

  let temp = [];

  if (conf.specRevision) {
    temp.push(conf.specRevision);
  }
  if (conf.specDraftLevel) {
    temp.push(conf.specDraftLevel);
  }
  if (conf.specStatus) {
    temp.push(conf.specStatus);
  }
  if (conf.specChapter) {
    temp.push(conf.specChapter);
  }
  conf.maturity = temp.join("-");

  let publishSpace = "Spec/Published";
  if (conf.specStatus === "member-submission") publishSpace = "Spec/Submission";
  else if (conf.specStatus === "member-private") publishSpace = "Spec/Submission/Private";
  else if (conf.specStatus === "team-submission") publishSpace = "Spec/TeamSubmission";
  else if (conf.specStatus === "team-private") publishSpace = "Spec/TeamSubmission/Private";
  if (conf.isRegular)
    conf.thisVersion =
      "https://sglaser.github.io/respec/" +
      publishSpace +
      "/" +
      conf.publishDate.getUTCFullYear() +
      "/" +
      conf.shortName +
      "-" +
      conf.maturity +
      "-" +
      concatDate(conf.publishDate) +
      "/";
  if (conf.isRegular)
    conf.latestVersion =
      "https://sglaser.github.io/respec/" + publishSpace + "/" + conf.shortName + "/";

  if (conf.previousPublishDate) {
    if (!conf.previousStatus) {
      pub("error", "`previousPublishDate` is set, but not `previousStatus`.");
    }
    if (!conf.previousRevision) {
      pub("error", "`previousPublishDate` is set, but not `previousRevision`.");
    }
    if (!conf.previousDraftLevel) {
      pub("error", "`previousPublishDate` is set, but not `previousDraftLevel`.");
    }

    conf.previousPublishDate = validateDateAndRecover(
      conf,
      "previousPublishDate"
    );

    if (conf.previousRevision) {
      temp.push(conf.previousRevision);
    }
    if (conf.previousDraftLevel) {
      temp.push(conf.previousDraftLevel);
    }
    if (conf.previousStatus) {
      temp.push(conf.previousStatus);
    }
    let pmat = temp.join("-");

    if (conf.isBasic) {
      conf.prevVersion = "";
    } else {
      conf.prevVersion =
        "https://sglaser.github.io/respec/Spec/" +
        conf.previousPublishDate.getUTCFullYear() +
        "/" +
        conf.shortName +
        "-" +
        pmat +
        "-" +
        concatDate(conf.previousPublishDate) +
        "/";
    }
  } else {
    if (
      !(/NOTE$/.test(conf.specStatus)) &&
      !conf.prevStatus === "none" &&
      !conf.noSpecTrack &&
      !conf.isNoTrack &&
      !conf.isSubmission
    )
      pub(
        "error",
        "Document on specification track but has no previous version:" +
        " Add `previousStatus`, `previousRevision`, `previousDraftLevel`, and `previousPublishDate` to ReSpec's config."
      );
    if (!conf.prevVersion) conf.prevVersion = "";
  }
  if (!conf.wg) {
    if (!conf.editors || conf.editors.length === 0)
      pub("error", "At least one editor is required");
  }

  let peopCheck = function (it) {
    if (!it.name) pub("error", "All authors and editors must have a name.");
  };
  if (conf.editors) {
    conf.editors.forEach(peopCheck);
  }
  if (conf.authors) {
    conf.authors.forEach(peopCheck);
  }
  conf.multipleEditors = conf.editors && conf.editors.length > 1;
  conf.multipleAuthors = conf.authors && conf.authors.length > 1;

  $.each(conf.alternateFormats || [], function (i, it) {
    if (!it.uri || !it.label)
      pub("error", "All alternate formats must have a uri and a label.");
  });
  conf.multipleAlternates =
    conf.alternateFormats && conf.alternateFormats.length > 1;
  conf.alternatesHTML =
    conf.alternateFormats &&
    joinAnd(conf.alternateFormats, function (alt) {
      let optional = alt.hasOwnProperty("lang") && alt.lang
        ? " hreflang='" + alt.lang + "'"
        : "";
      optional += alt.hasOwnProperty("type") && alt.type
        ? " type='" + alt.type + "'"
        : "";
      return (
        "<a rel='alternate' href='" +
        alt.uri +
        "'" +
        optional +
        ">" +
        alt.label +
        "</a>"
      );
    });
  if (conf.bugTracker) {
    if (conf.bugTracker["new"] && conf.bugTracker.open) {
      conf.bugTrackerHTML =
        "<a href='" +
        conf.bugTracker["new"] +
        "'>" +
        conf.l10n.file_a_bug +
        "</a> " +
        conf.l10n.open_parens +
        "<a href='" +
        conf.bugTracker.open +
        "'>" +
        conf.l10n.open_bugs +
        "</a>" +
        conf.l10n.close_parens;
    } else if (conf.bugTracker.open) {
      conf.bugTrackerHTML =
        "<a href='" + conf.bugTracker.open + "'>open bugs</a>";
    } else if (conf.bugTracker["new"]) {
      conf.bugTrackerHTML =
        "<a href='" + conf.bugTracker["new"] + "'>file a bug</a>";
    }
  }
  if (conf.copyrightStart && conf.copyrightStart == conf.publishYear)
    conf.copyrightStart = "";
  for (let k in status2text) {
    if (status2long[k]) continue;
    status2long[k] = status2text[k];
  }
  conf.longStatus = status2long[conf.specStatus];
  conf.textStatus = status2text[conf.specStatus];
  if (status2rdf[conf.specStatus]) {
    conf.rdfStatus = status2rdf[conf.specStatus];
  }
  conf.showThisVersion = !conf.isNoTrack;
  conf.showPreviousVersion =
    !conf.previousStatus === "none" &&
    !conf.isNoTrack &&
    !conf.isSubmission;
  if (/NOTE$/.test(conf.specStatus) && !conf.prevVersion)
    conf.showPreviousVersion = false;
  conf.notYetFinal = conf.isSpecTrack && (conf.specStatus !== "FINAL" || conf.specStatus !== "PUB-FINAL");
  conf.isFinal = conf.isSpecTrack && (conf.specStatus === "FINAL" || conf.specStatus === "PUB-FINAL");
  if (conf.isFinal && !conf.errata)
    pub("error", "Recommendations must have an errata link.");
  conf.isUnofficial = conf.specStatus === "unofficial";
  conf.prependPCISIG = !conf.isUnofficial;
  conf.isWD = conf.specStatus === "WD" || conf.specStatus === "WD-CWG" || conf.specStatus === "WD-MEM" || conf.specStatus === "WD-FINAL";
  conf.isRC = conf.specStatus === "RC" || conf.specStatus === "RC-CWG" || conf.specStatus === "RC-MEM" || conf.specStatus === "RC-FINAL";
  conf.isPUB = conf.specStatus === "PUB" || conf.specStatus === "PUB-CWG" || conf.specStatus === "PUB-MEM";
  conf.dashDate = ISODate.format(conf.publishDate);
  conf.publishISODate = conf.publishDate.toISOString();
  conf.shortISODate = ISODate.format(conf.publishDate);
// configuration done - yay!

  if (false) {
    // annotate html element with RFDa
    if (conf.doRDFa) {
      if (conf.rdfStatus)
        $("html").attr("typeof", "bibo:Document " + conf.rdfStatus);
      else $("html").attr("typeof", "bibo:Document ");
      let prefixes =
        "bibo: http://purl.org/ontology/bibo/ pcisigp: http://sglaser.github.io/respec/2001/02pd/rec54#";
      $("html").attr("prefix", prefixes);
      $("html>head").prepend(
        $("<meta lang='' property='dc:language' content='en'>")
      );
    }
  }

  // NOTE:
  if (Array.isArray(conf.wg)) {
    conf.multipleWGs = conf.wg.length > 1;
    conf.wgHTML = joinAnd(conf.wg);
  } else {
    conf.multipleWGs = false;
    conf.wgHTML = conf.wg;
  }

// insert into document and mark with microformat
  let bp;
  bp = headersTmpl(conf);
  $("body", doc).prepend($(bp)).addClass("h-entry");

// invent toc if not already present
  if (!document.body.querySelector("#toc")) {
    $("body", doc).prepend($("<nav id=\"toc\"><section class=\"introductory\"></section></nav>"));
  }

// handle Revision History
  let revision_history =
    document.body.querySelector("#revision-history") || document.createElement("section");
  if ((!conf.isNoTrack) && !revision_history.id) {
    pub(
      "error",
      "A Revision History section is required for your type of document."
    );
  }
  revision_history.id = revision_history.id || "revision-history";
  revision_history.classList.add("introductory");

// handle SotD
  let sotd =
    document.body.querySelector("#sotd") || document.createElement("section");
  if ((!conf.isNoTrack) && !sotd.id) {
    pub(
      "error",
      "A custom SotD paragraph is required for your type of document."
    );
  }
  sotd.id = sotd.id || "stod";
  sotd.classList.add("introductory");


  if (conf.specStatus === "PUB-CWG" && !conf.cwgReviewEnd) {
    pub(
      "error",
      `'specStatus' is "PUB-CWG" but no 'cwgReviewEnd' is specified (needed to indicate end of the Cross Workgroup Review).`
    );
  }
  conf.cwgReviewEnd = validateDateAndRecover(conf, "cwgReviewEnd");
  conf.humanCwgReviewEnd = PCISIGDate.format(conf.cwgReviewEnd);


  if (conf.specStatus === "PUB-MEM" && !conf.memReviewEnd) {
    pub(
      "error",
      `'specStatus' is "PUB-MEM", but no 'memReviewEnd' is specified (needed to indicate end of the Member Review).`
    );
  }
  conf.memReviewEnd = validateDateAndRecover(conf, "memReviewEnd");
  conf.humanMemReviewEnd = PCISIGDate.format(conf.memReviewEnd);

  sotd.innerHTML = populateSoTD(conf, sotd);

// Requested by https://github.com/pcisig/respec/issues/504
// Makes a record of a few auto-generated things.
  pub("amend-user-config", {
    publishISODate: conf.publishISODate,
    generatedSubtitle: `${conf.longStatus} ${conf.publishHumanDate}`,
  });
  cb();
}

function populateSoTD(conf, sotd) {
  const sotdClone = sotd.cloneNode(true);
  const additionalNodes = document.createDocumentFragment();
  const additionalContent = document.createElement("temp");
  // we collect everything until we hit a section,
  // that becomes the custom content.
  while (sotdClone.hasChildNodes()) {
    if (
      sotdClone.firstChild.nodeType !== Node.ELEMENT_NODE ||
      sotdClone.firstChild.localName !== "section"
    ) {
      additionalNodes.appendChild(sotdClone.firstChild);
      continue;
    }
    break;
  }
  additionalContent.appendChild(additionalNodes);
  conf.additionalContent = additionalContent.innerHTML;
  // Whatever sections are left, we throw at the end.
  conf.additionalSections = sotdClone.innerHTML;
  return tmpls["pcisig-sotd"](conf);
}
