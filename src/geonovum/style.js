// @ts-check
// Module geonovum/style
// Inserts a link to the appropriate Geonovum style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import {
  createResourceHint,
  linkCSS,
  showWarning,
  toKeyValuePairs,
} from "../core/utils.js";
import { sub } from "../core/pubsubhub.js";
export const name = "geonovum/style";
function attachFixupScript(doc, version) {
  const script = doc.createElement("script");
  script.addEventListener(
    "load",
    () => {
      if (window.location.hash) {
        window.location.href = window.location.hash;
      }
    },
    { once: true }
  );
  script.src = `https://www.w3.org/scripts/TR/${version}/fixup.js`;
  doc.body.appendChild(script);
}

/**
 * Make a best effort to attach meta viewport at the top of the head.
 * Other plugins might subsequently push it down, but at least we start
 * at the right place. When ReSpec exports the HTML, it again moves the
 * meta viewport to the top of the head - so to make sure it's the first
 * thing the browser sees. See js/ui/save-html.js.
 */
function createMetaViewport() {
  const meta = document.createElement("meta");
  meta.name = "viewport";
  const contentProps = {
    width: "device-width",
    "initial-scale": "1",
    "shrink-to-fit": "no",
  };
  meta.content = toKeyValuePairs(contentProps).replace(/"/g, "");
  return meta;
}

function createStyle(css_name) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://tools.geostandaarden.nl/respec/style/${css_name}.css`;
  return link;
}

function createResourceHints() {
  /** @type ResourceHintOption[] */
  const opts = [
    {
      hint: "preconnect", // for W3C fixup.js
      href: "https://www.w3.org",
    },
    {
      hint: "preload", // all specs need it, and we attach it on end-all.
      href: "https://www.w3.org/scripts/TR/2016/fixup.js",
      as: "script",
    },
    {
      hint: "preconnect", // for Geonovum styles and scripts.
      href: "https://tools.geostandaarden.nl/",
    },
    {
      hint: "preload", // all Geonovum specs import base.css.
      href: "https://tools.geostandaarden.nl/respec/style/base.css",
      as: "style",
    },
    {
      hint: "preload", // all Geonovum specs show the logo.
      href: "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.svg",
      as: "image",
    },
  ];
  const resourceHints = document.createDocumentFragment();
  for (const link of opts.map(createResourceHint)) {
    resourceHints.appendChild(link);
  }
  return resourceHints;
}

// Collect elements for insertion (document fragment)
const elements = createResourceHints();

// add favicon for Geonovum
const favicon = document.createElement("link");
favicon.rel = "shortcut icon";
favicon.type = "image/x-icon";
favicon.href =
  "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.ico";
document.head.prepend(favicon);

if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.prepend(createMetaViewport());
}

document.head.prepend(elements);

// export function run(conf, doc, cb) {
export function run(conf) {
  if (!conf.specStatus) {
    const msg = "`respecConfig.specStatus` missing. Defaulting to 'GN-BASIS'.";
    conf.specStatus = "GN-BASIS";
    showWarning(msg, name);
  }

  if (document.body.querySelector("figure.scalable")) {
    // Apply leaflet style if class scalable is present
    document.head.appendChild(createStyle("leaflet"));
    document.head.appendChild(createStyle("font-awesome"));
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

  if (!conf.noToc) {
    sub(
      "end-all",
      () => {
        attachFixupScript(document, "2016");
      },
      { once: true }
    );
  }
  const finalStyleURL = `https://tools.geostandaarden.nl/respec/style/${styleFile}`;
  linkCSS(document, finalStyleURL);
}
