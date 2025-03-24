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
import css from "../styles/license.css.js";
import { html } from "../core/import-maps.js";
import { sub } from "../core/pubsubhub.js";
export const name = "logius/style";

function attachFixupScript() {
  const script = html`<script src="https://gitdocumentatie.logius.nl/publicatie/respec/fixup.js">`;
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

function createBaseStyle() {
  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href = getStyleUrl();
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
      href: getStyleUrl("base.css"),
      as: "style",
    },
    {
      hint: "preload",
      href: getStyleUrl("dark.css"),
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

function insertStyle() {
  const styleElement = document.createElement("style");
  styleElement.id = "respec-nlgov";
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
  return styleElement;
}

export function run(conf) {
  if (!conf.specStatus) {
    const msg = "`respecConfig.specStatus` missing. Defaulting to 'base'";
    conf.specStatus = "base";
    showWarning(msg, name);
  }

  if (!conf.noToc) {
    sub("end-all", attachFixupScript, { once: true });
  }

  const finalStyleURL = getStyleUrl();
  linkCSS(document, finalStyleURL);
  const moveStyle = styleMover(finalStyleURL);
  sub("beforesave", moveStyle);

  // code hierboven mogenlijk overbodig?
  insertStyle();

  // Add color scheme meta tag and style
  /** @type HTMLMetaElement */
  let colorScheme = document.querySelector("head meta[name=color-scheme]");
  if (!colorScheme) {
    // Default to light mode during transitional period.
    colorScheme = html`<meta name="color-scheme" content="light" />`;
    document.head.appendChild(colorScheme);
  }
  if (colorScheme.content.includes("dark")) {
    const darkModeStyleUrl = getStyleUrl("dark.css");
    document.head.appendChild(
      html`<link
        rel="stylesheet"
        href="${darkModeStyleUrl}"
        media="(prefers-color-scheme: dark)"
      />`
    );
    // As required by W3C Pub Rules.
    sub("beforesave", styleMover(darkModeStyleUrl));
  }
}

function getStyleUrl(styleFile = "base.css") {
  let baseStyle = respecConfig.nl_organisationStylesURL
    ? respecConfig.nl_organisationStylesURL
    : "https://www.w3.org/StyleSheets/TR/2021/";
  if (!baseStyle.endsWith("/")) {
    baseStyle += "/";
  }
  return new URL(styleFile, baseStyle).href;
}
