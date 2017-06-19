/*jshint strict: true, browser:true, jquery: true*/
/*globals define*/
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import { toKeyValuePairs, createResourceHint, linkCSS } from "core/utils";
import { pub, sub } from "core/pubsubhub";

function attachFixupScript(doc, version) {
  const script = doc.createElement("script");
  script.addEventListener(
    "load",
    function() {
      if (window.location.hash) {
        window.location = window.location;
      }
    },
    { once: true }
  );
  script.src = `https://www.w3.org/scripts/TR/${version}/fixup.js`;
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
  link.href = "https://tools.geostandaarden.nl/respec/style/base.css";
  link.classList.add("removeOnSave");
  return link;
}

function createStyle(css_name) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://tools.geostandaarden.nl/respec/style/{0}.css".replace(
    "{0}",
    css_name
  );
  link.classList.add("removeOnSave");
  return link;
}

function createResourceHints() {
  const resourceHints = [
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
      href: "https://tools.geostandaarden.nl/respec/style/base.css",
      as: "style",
    },
    {
      hint: "preload", // all specs show the logo.
      href: "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.png",
      as: "image",
    },
  ]
    .map(createResourceHint)
    .reduce(function(frag, link) {
      frag.appendChild(link);
      return frag;
    }, document.createDocumentFragment());
  return resourceHints;
}
// Collect elements for insertion
const elements = createResourceHints();

// Opportunistically apply base style
elements.appendChild(createBaseStyle());
if (document.body.querySelector("figure.scalable")) {
  // Apply leaflet style if class scalable is present
  elements.appendChild(createStyle("leaflet"));
  elements.appendChild(createStyle("font-awesome"));
}
if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.insertBefore(createMetaViewport(), elements.firstChild);
}

document.head.insertBefore(elements, document.head.firstChild);

export function run(conf, doc, cb) {
  if (!conf.specStatus) {
    const warn = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
    conf.specStatus = "GN-BASIS";
    pub("warn", warn);
  }

  let styleFile = "";

  // Figure out which style file to use.
  switch (conf.specStatus.toUpperCase()) {
    case "GN-WV":
      styleFile += "GN-WV.css";
      break;
    case "GN-CV":
      styleFile += "GN-CV.css";
      break;
    case "GN-VV":
      styleFile += "GN-VV.css";
      break;
    case "GN-DEF":
      styleFile += "GN-DEF.css";
      break;
    case "GN-BASIS":
      styleFile += "GN-BASIS.css";
      break;
    default:
      styleFile = "base.css";
  }

  attachFixupScript(doc, "2016");
  const finalStyleURL = `https://tools.geostandaarden.nl/respec/style/${styleFile}`;
  linkCSS(doc, finalStyleURL);
  cb();
}
