// @ts-check
/* jshint strict: true, browser:true, jquery: true */
// Module logius/style
// Inserts a link to the appropriate NL-RESPEC style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import { createResourceHint, linkCSS, toKeyValuePairs } from "../core/utils.js";
import { pub, sub } from "../core/pubsubhub.js";
export const name = "logius/style";
function attachFixupScript(doc, version) {
  const script = doc.createElement("script");
  if (location.hash) {
    script.addEventListener(
      "load",
      () => {
        window.location.href = location.hash;
      },
      { once: true }
    );
  }
  // todo warning w3c.org/scripts is not accessible
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

// get base.css from pubdomain if present else W3c
function getBaseStyleURI() {
  let baseStyle = respecConfig.nl_organisationStylesURL
    ? respecConfig.nl_organisationStylesURL
    : "https://www.w3.org/StyleSheets/TR/2016/";
  if (!baseStyle.endsWith("/")) baseStyle += "/";
  return `${baseStyle}/base.css`;
}

function createBaseStyle() {
  const link = document.createElement("link");


  link.rel = "stylesheet";
  link.href = getBaseStyleURI();
  link.classList.add("removeOnSave");
  return link;
}

function selectStyleVersion(styleVersion) {
  let version = "";
  switch (styleVersion) {
    case null:
    case true:
      version = "";
      break;
    default:
      if (styleVersion && !isNaN(styleVersion)) {
        version = styleVersion.toString().trim();
      }
  }
  return version;
}

function createResourceHints() {
  /** @type ResourceHintOption[]  */
  const opts = [
    {
      hint: "preconnect", // for W3C styles and scripts.
      href: "https://www.w3.org",
    },
    // {
    //   hint: "preload", // all specs need it, and we attach it on end-all.
    //   href: "https://www.w3.org/scripts/TR/2016/fixup.js",
    //   as: "script",
    // },
    {
      hint: "preload", // all specs include on base.css.
      // href: "https://www.w3.org/StyleSheets/TR/2016/base.css",
      href: getBaseStyleURI(),
      as: "style",
    },
    // {
    //   hint: "preload", // all specs show the logo.
    //   href: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
    //   as: "image",
    // },
  ];

  const resourceHints = document.createDocumentFragment();
  for (const link of opts.map(createResourceHint)) {
    resourceHints.appendChild(link);
  }
  return resourceHints;
}
// Collect elements for insertion (document fragment)
const elements = createResourceHints();

// Opportunistically apply base style
elements.appendChild(createBaseStyle());
if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.prepend(createMetaViewport());
}

document.head.prepend(elements);

function styleMover(linkURL) {
  return exportDoc => {
    const w3cStyle = exportDoc.querySelector(`head link[href="${linkURL}"]`);
    exportDoc.querySelector("head").append(w3cStyle);
  };
}

export function run(conf) {
  if (!conf.specStatus) {
    const warn = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
    conf.specStatus = "base";
    pub("warn", warn);
  }
  if (!conf.nl_organisationStylesURL) {
    // defaulting to Geonovum
    conf.nl_organisationStylesURL = "https://tools.geostandaarden.nl/respec/style/";
    // override nl_organisationPrefix 
    conf.nl_organisationPrefix = "GN-";
    pub("warn", `respecConfig.nl_organisationStylesURL missing. Defaulting to '${conf.nl_organisationStylesURL}'.`);
    pub("warn", "`respecConfig.nl_organisationPrefix` missing. Defaulting to 'GN-'.");
  }
  if (!conf.nl_organisationPrefix) {
    // default to geonovum
    conf.nl_organisationPrefix = "GN-";
    pub("warn", "`respecConfig.nl_organisationPrefix` missing. Defaulting to 'GN-'.");
  }

  let styleFile = conf.nl_organisationPrefix;

  // Figure out which style file to use.
  switch (conf.specStatus.toUpperCase()) {
    // Geonovum statuses for backward compatibility  
    // todo W3c seem to have a status with a dedicated css (XX_Draft),  do we need this too?
    // case "DRAFT":
    // case "GN-DRAFT":
    //   styleFile = conf.specStatus.toLowerCase();
    //   break;
    case "WV": // Werkversie
    case "GN-WV":
      styleFile += "WV.css";
      break;
    case "CV": // (Openbare) Consultatieversie
    case "GN-CV":
      styleFile += "CV.css";
      break;
    case "VV": // Vastgestelde versie
    case "GN-VV":
      styleFile += "VV.css";
      break;
    case "DEF": // Definitieve versie
    case "GN-DEF": // todo Check geonovum impact
      if (conf.specType == "ST") {
        styleFile += "DEF.css";
      } else {
        styleFile += "VG.css";
      }
      break;
    case "EO": // Verouderde versie/Einde ondersteuning/Vervangen door nieuwere versie
    case "GN-EO":
      styleFile += "EO.css";
      break;
    case "TG": // Versie teruggetrokken
    case "TG-EO":
      styleFile += "TG.css";
      break;
    case "BASIS": // 'geen status' 
    case "GN-BASIS":
      styleFile += "BASIS.css";
      break;
    default:
      styleFile += "BASIS.css";
  }

  // todo we don't have an experimental style yet, do we need this?
  // Select between released styles and experimental style.
  // const version = selectStyleVersion(conf.useExperimentalStyles || "2016");
  // // Attach W3C fixup script after we are done.
  // if (version && !conf.noToc) {
  //   sub(
  //     "end-all",
  //     () => {
  //       attachFixupScript(document, version);
  //     },
  //     { once: true }
  //   );
  // }
  // const finalVersionPath = version ? `${version}/` : "";
  const finalVersionPath = "";

  if (!conf.nl_organisationStylesURL) {
    // defaulting to Geonovum
    conf.nl_organisationStylesURL = "https://tools.geostandaarden.nl/respec/style/";
    pub("warn", `respecConfig.nl_organisationStylesURL missing. Defaulting to '${conf.nl_organisationStylesURL}'.`);
  }
  const finalStyleURL = `${conf.nl_organisationStylesURL}${finalVersionPath}${styleFile}`;
  // (`using ${finalStyleURL}`);
  linkCSS(document, finalStyleURL);
  // Make sure the W3C stylesheet is the last stylesheet, as required by W3C Pub Rules.
  const moveStyle = styleMover(finalStyleURL);
  sub("beforesave", moveStyle);
}
