// @ts-check
/* jshint strict: true, browser:true, jquery: true */
// Module logius/style
// Inserts a link to the appropriate NL-RESPEC style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import {
  createResourceHint,
  linkCSS,
  showWarning,
  toKeyValuePairs,
} from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { sub } from "../core/pubsubhub.js";
export const name = "logius/style";

function attachFixupScript() {
  const script = html`<script src="https://www.w3.org/scripts/TR/2021/fixup.js">`;
  if (location.hash) {
    script.addEventListener(
      "load",
      () => {
        window.location.href = location.hash;
      },
      { once: true }
    );
  }
  document.body.appendChild(script);
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
  return `${baseStyle}base.css`;
}

function createBaseStyle() {
  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href = getBaseStyleURI();
  link.classList.add("removeOnSave");
  return link;
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

function styleMover(linkURL) {
  return exportDoc => {
    const w3cStyle = exportDoc.querySelector(`head link[href="${linkURL}"]`);
    exportDoc.querySelector("head").append(w3cStyle);
  };
}

document.head.prepend(elements);

export function run(conf) {
  if (!conf.specStatus) {
    const msg = "`respecConfig.specStatus` missing. Defaulting to 'base'";
    conf.specStatus = "base";
    showWarning(msg, name);
  }
  if (!conf.nl_organisationStylesURL) {
    // defaulting to Geonovum
    conf.nl_organisationStylesURL =
      "https://tools.geostandaarden.nl/respec/style/";
    // override nl_organisationPrefix
    conf.nl_organisationPrefix = "GN-";
    let msg = `respecConfig.nl_organisationStylesURL missing. Defaulting to '${conf.nl_organisationStylesURL}'.`;
    showWarning(msg, name);
    msg = `respecConfig.nl_organisationPrefix missing. Defaulting to 'GN-.'`;
    showWarning(msg, name);
  }
  if (!conf.nl_organisationPrefix) {
    // default to geonovum
    conf.nl_organisationPrefix = "GN-";
    const msg = `respecConfig.nl_organisationPrefix missing. Defaulting to 'GN-.'`;
    showWarning(msg, name);
  }

  if (!conf.nl_organisationStylesURL) {
    // defaulting to Geonovum
    conf.nl_organisationStylesURL =
      "https://tools.geostandaarden.nl/respec/style/";
    const msg = `respecConfig.nl_organisationStylesURL missing. Defaulting to '${conf.nl_organisationStylesURL}'.`;
    showWarning(msg, name);
  }

  if (!conf.noToc) {
    sub("end-all", attachFixupScript, { once: true });
  }

  const finalStyleURL = getBaseStyleURI();
  linkCSS(document, finalStyleURL);
  const moveStyle = styleMover(finalStyleURL);
  sub("beforesave", moveStyle);

  // code hierboven mogenlijk overbodig?
}
