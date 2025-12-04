/*jshint strict: true, browser:true, jquery: true*/
/*globals define*/
// Module pcisig/style
// Inserts a link to the appropriate PCISIG style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import { toKeyValuePairs, createResourceHint, linkCSS } from "../core/utils.js";
import { pub, sub } from "../core/pubsubhub.js";

export const name = "pcisig/style";

function attachFixupScript(doc, version) {
  const script = doc.createElement("script");
  script.addEventListener(
    "load",
    function () {
      if (window.location.hash) {
        window.location = window.location;
      }
    },
    {once: true}
  );
  script.src = `https://sglaser.github.io/respec/Spec/scripts/${version}/fixup.js`;
  doc.body.appendChild(script);
}

// Make a best effort to attach meta viewport at the top of the head.
// Other plugins might subsequently push it down, but at least we start
// at the right place. When ReSpec exports the HTML, it again moves the
// meta viewport to the top of the head - so to make sure it's the first
// thing the browser sees. See js/ui/save-html.js.
function createMetaViewport() {
  const meta = document.createElement("meta");
  meta.name = "viewport";
  const contentProps = {
    width: "device-width",
    "initial-scale": "1",
    "shrink-to-fit": "no",
  };
  meta.content = toKeyValuePairs(contentProps).replace(/\"/g, "");
  return meta;
}

function createBaseStyle() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://sglaser.github.io/respec/Spec/StyleSheets/2017/base.css";
  link.classList.add("removeOnSave");
  return link;
}

function selectStyleVersion(styleVersion) {
  let version = "";
  switch (styleVersion) {
    case null:
    case true:
      version = "2017";
      break;
    default:
      if (styleVersion && !isNaN(styleVersion)) {
        version = styleVersion.toString().trim();
      }
  }
  return version;
}

function createResourceHints() {
  const resourceHints = [
    {
      hint: "preconnect", // for PCISIG styles and scripts.
      href: "https://sglaser.github.io/respec/Spec",
    },
    {
      hint: "preload", // all specs need it, and we attach it on end-all.
      href: "https://sglaser.github.io/respec/Spec/scripts/2017/fixup.js",
      as: "script",
    },
    {
      hint: "preload", // all specs include on base.css.
      href: "https://sglaser.github.io/respec/Spec/StyleSheets/2017/base.css",
      as: "style",
    },
    {
      hint: "preload", // all specs show the logo.
      href: "https://sglaser.github.io/respec/Spec/StyleSheets/2017/logos/pci_express_PMS.svg",
      as: "image",
    },
  ]
    .map(createResourceHint)
    .reduce(function (frag, link) {
      frag.appendChild(link);
      return frag;
    }, document.createDocumentFragment());
  return resourceHints;
}

// Collect elements for insertion (document fragment)
const elements = createResourceHints();

// Opportunistically apply base style
elements.appendChild(createBaseStyle());
if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.insertBefore(createMetaViewport(), elements.firstChild);
}

document.head.insertBefore(elements, document.head.firstChild);

export function run(conf, doc, cb) {
  if (!conf.specStatus) {
    const warn = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
    conf.specStatus = "base";
    pub("warn", warn);
  }

  let styleFile = "PCISIG-";

  // Figure out which style file to use.
  switch (conf.specStatus.toUpperCase()) {
    case "WG-DRAFT-NOTE":
    case "PUB-DRAFT-NOTE":
    case "WG-NOTE":
    case "PUB-NOTE":
      styleFile = "NOTE";
      break;
    case "ED":
    case "ED-CWG":
    case "ED-MEM":
    case "ED-FINAL":
      styleFile += "ED";
      break;
    case "WD":
    case "WD-CWG":
    case "WD-MEM":
    case "WD-FINAL":
      styleFile += "WD";
      break;
    case "RC":
    case "RC-CWG":
    case "RC-MEM":
    case "RC-FINAL":
      styleFile += "RC";
      break;
    case "PUB":
    case "PUB-CWG":
    case "PUB-MEM":
      styleFile += "PUB";
      break;
    case "FINAL":
      styleFile += "FINAL";
      break;
    case "UNOFFICIAL":
    case "PRIVATE":
    case "BASE":
    case "NOTE":
    case "DRAFT-NOTE":
    case "MEMBER-PRIVATE":
    case "MEMBER-SUBMISSION":
    case "TEAM-PRIVATE":
    case "TEAM-SUBMISSION":
      styleFile = "base";
      break;
    default:
      styleFile = "base";
  }

  // Select between released styles and experimental style.
  const version = selectStyleVersion(conf.useExperimentalStyles || "2017");
  // Attach PCISIG fixup script after we are done.
  if (version && !conf.noToc) {
    sub(
      "end-all",
      function () {
        attachFixupScript(doc, version);
      },
      {once: true}
    );
  }
  const finalVersionPath = version ? version + "/" : "";
  const finalStyleURL = `https://sglaser.github.io/respec/Spec/StyleSheets/${finalVersionPath}${styleFile}.css`;

  if (conf.cssOverride) {
    linkCSS(doc, conf.cssOverride);
  } else {
    linkCSS(doc, finalStyleURL);
  }
  cb();
}
