// @ts-check
/* jshint strict: true, browser:true, jquery: true */
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import { createResourceHint, toKeyValuePairs } from "../core/utils.js";
export const name = "w3c/style";

const headElements =
  typeof document !== "undefined" ? insertHeadElements(document) : undefined;

function attachFixupScript(doc, version) {
  const script = doc.createElement("script");
  if (doc.location.hash) {
    script.addEventListener(
      "load",
      () => {
        window.location.href = location.hash;
      },
      { once: true }
    );
  }
  script.src = `https://www.w3.org/scripts/TR/${version}/fixup.js`;
  doc.body.appendChild(script);
}

/**
 * Make a best effort to attach meta viewport at the top of the head.
 * Other plugins might subsequently push it down, but at least we start
 * at the right place. When ReSpec exports the HTML, it again moves the
 * meta viewport to the top of the head - so to make sure it's the first
 * thing the browser sees. See js/ui/save-html.js.
 *
 * @param {Document} document
 */
function createMetaViewport(document) {
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

/**
 * take a document and a link to CSS and appends
 * a <link/> element to the head pointing to each
 *
 * @param {Document} doc
 * @param {string} cssUrl
 */
function createCssStyle(doc, cssUrl) {
  const link = doc.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  return link;
}

/**
 * @param {Document} document
 */
function createBaseStyle(document) {
  const link = createCssStyle(
    document,
    "https://www.w3.org/StyleSheets/TR/2016/base.css"
  );
  link.classList.add("removeOnSave");
  return link;
}

function selectStyleVersion(styleVersion) {
  let version = "";
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

/**
 * @param {Document} document
 */
function createResourceHints(document) {
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
      href: "https://www.w3.org/StyleSheets/TR/2016/base.css",
      as: "style",
    },
    {
      hint: "preload", // all specs show the logo.
      href: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
      as: "image",
    },
  ]
    .map(opts => createResourceHint(opts, document))
    .reduce((frag, link) => {
      frag.appendChild(link);
      return frag;
    }, document.createDocumentFragment());
  return resourceHints;
}

function insertHeadElements(document) {
  // Collect elements for insertion (document fragment)
  const elements = createResourceHints(document);

  // Opportunistically apply base style
  elements.appendChild(createBaseStyle(document));
  if (!document.head.querySelector("meta[name=viewport]")) {
    // Make meta viewport the first element in the head.
    elements.prepend(createMetaViewport(document));
  }

  document.head.prepend(elements);
  return elements;
}

/**
 * @param {import("../respec-document").RespecDocument} respecDoc
 */
export default function(respecDoc) {
  const { document, configuration: conf, hub } = respecDoc;
  if (!conf.specStatus) {
    const warn = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
    conf.specStatus = "base";
    hub.pub("warn", warn);
  }
  if (!headElements) {
    insertHeadElements(document);
  }

  let styleFile = "W3C-";

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
  const version = selectStyleVersion(conf.useExperimentalStyles || "2016");
  // Attach W3C fixup script after we are done.
  if (version && !conf.noToc) {
    hub.sub("end-all", () => attachFixupScript(document, version), {
      once: true,
    });
  }
  const finalVersionPath = version ? `${version}/` : "";
  const finalStyle = createCssStyle(
    document,
    `https://www.w3.org/StyleSheets/TR/${finalVersionPath}${styleFile}`
  );
  finalStyle.classList.add("w3c-move-last");
  document.head.appendChild(finalStyle);
}
