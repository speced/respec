/*jshint strict: true, browser:true, jquery: true*/
/*globals define*/
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import { toKeyValuePairs, createResourceHint, linkCSS } from "core/utils";
import { pub, sub } from "core/pubsubhub";

function attachFixupScript(doc, version) {
  var script = doc.createElement("script");
  script.addEventListener("load", function() {
    if (window.location.hash) {
      window.location = window.location;
    }
  });
  var helperScript = "https://www.w3.org/scripts/TR/{version}/fixup.js".replace(
    "{version}",
    version
  );
  script.src = helperScript;
  doc.body.appendChild(script);
}

// Make a best effort to attach meta viewport at the top of the head.
// Other plugins might subsequently push it down, but at least we start
// at the right place. When ReSpec exports the HTML, it again moves the
// meta viewport to the top of the head - so to make sure it's the first
// thing the browser sees. See js/ui/save-html.js.
function createMetaViewport() {
  var meta = document.createElement("meta");
  meta.name = "viewport";
  var contentProps = {
    width: "device-width",
    "initial-scale": "1",
    "shrink-to-fit": "no",
  };
  meta.content = toKeyValuePairs(contentProps).replace(/\"/g, "");
  return meta;
}

function createBaseStyle() {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://www.w3.org/StyleSheets/TR/2016/base.css";
  link.classList.add("removeOnSave");
  return link;
}

function selectStyleVersion(styleVersion) {
  var version = "";
  switch (styleVersion) {
    case null:
    case true:
      version = "2016";
      break;
    default:
      if (styleVersion && !isNaN(styleVersion)) {
        version = styleVersion.toString().trim();
      }
  }
  return version;
}

function createResourceHints() {
  var resourceHints = [
    {
      hint: "preconnect", // for W3C styles and scripts.
      href: "https://www.w3.org",
    },
    {
      hint: "preload", // all specs need it, and we attach it on end-all.
      href: "https://www.w3.org/scripts/TR/2016/fixup.js",
      as: "script",
    },
    {
      hint: "preload", // all specs include on base.css.
      href: "https://www.w3.org/StyleSheets/TR/2016/base.css",
      as: "style",
    },
    {
      hint: "preload", // all specs show the logo.
      href: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
      as: "image",
    },
  ]
    .map(createResourceHint)
    .reduce(
      function(frag, link) {
        frag.appendChild(link);
        return frag;
      },
      document.createDocumentFragment()
    );
  return resourceHints;
}
// Collect elements for insertion
var elements = createResourceHints();

// Opportunistically apply base style
elements.appendChild(createBaseStyle());
if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.insertBefore(createMetaViewport(), elements.firstChild);
}

document.head.insertBefore(elements, document.head.firstChild);

export function run(conf, doc, cb) {
  if (!conf.specStatus) {
    var warn = "'specStatus' missing from ReSpec config. Defaulting to 'base'.";
    conf.specStatus = "base";
    pub("warn", warn);
  }

  var styleBaseURL = "https://www.w3.org/StyleSheets/TR/{version}";
  var finalStyleURL = "";
  var styleFile = "W3C-";

  // Figure out which style file to use.
  switch (conf.specStatus.toUpperCase()) {
    case "CG-DRAFT":
    case "CG-FINAL":
    case "BG-DRAFT":
    case "BG-FINAL":
      styleFile = conf.specStatus.toLowerCase();
      break;
    case "FPWD":
    case "LC":
    case "WD-NOTE":
    case "LC-NOTE":
      styleFile += "WD";
      break;
    case "WG-NOTE":
    case "FPWD-NOTE":
      styleFile += "WG-NOTE.css";
      break;
    case "UNOFFICIAL":
      styleFile += "UD";
      break;
    case "FINDING":
    case "FINDING-DRAFT":
    case "BASE":
      styleFile = "base.css";
      break;
    default:
      styleFile += conf.specStatus;
  }

  // Select between released styles and experimental style.
  var version = selectStyleVersion(conf.useExperimentalStyles || "2016");
  // Attach W3C fixup script after we are done.
  if (version && !conf.noToc) {
    sub(
      "end-all",
      function() {
        attachFixupScript(doc, version);
      },
      { once: true }
    );
  }
  var finalVersionPath = version ? version + "/" : "";
  finalStyleURL = styleBaseURL.replace("{version}", finalVersionPath);
  finalStyleURL += styleFile;

  linkCSS(doc, finalStyleURL);
  cb();
}
