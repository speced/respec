// @ts-check
/**
 * Module w3c/style
 * Inserts a link to the appropriate W3C style for the specification's maturity level.
 * */

import { W3CNotes, recTrackStatus, registryTrackStatus } from "./headers.js";
import { createResourceHint } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { sub } from "../core/pubsubhub.js";

export const name = "w3c/style";

function attachFixupScript() {
  const script = document.createElement("script");
  script.src = "https://www.w3.org/scripts/TR/2021/fixup.js";
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

// Creates a collection of resource hints to improve the loading performance
// of the W3C resources.
function createResourceHints() {
  /** @type {ResourceHintOption[]}  */
  const opts = [
    {
      hint: "preconnect", // for W3C styles and scripts.
      href: "https://www.w3.org",
    },
    {
      hint: "preload", // all specs need it, and we attach it on end-all.
      href: "https://www.w3.org/scripts/TR/2021/fixup.js",
      as: "script",
    },
    {
      hint: "preload", // all specs include on base.css.
      href: getStyleUrl("base.css").href,
      as: "style",
    },
    {
      hint: "preload",
      href: getStyleUrl("dark.css").href,
      as: "style",
    },
    {
      hint: "preload", // all specs show the logo.
      href: "https://www.w3.org/StyleSheets/TR/2021/logos/W3C",
      as: "image",
      corsMode: "anonymous",
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

// Opportunistically apply base style
elements.appendChild(
  html`<link
    rel="stylesheet"
    href="https://www.w3.org/StyleSheets/TR/2021/base.css"
    class="removeOnSave"
  />`
);
if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.prepend(
    html`<meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />`
  );
}

document.head.prepend(elements);

/**
 * @param {URL|string} linkURL
 * @returns {(exportDoc: Document) => void}
 */
function styleMover(linkURL) {
  return exportDoc => {
    const w3cStyle = exportDoc.querySelector(`head link[href="${linkURL}"]`);
    if (w3cStyle) {
      exportDoc.querySelector("head")?.append(w3cStyle);
    }
  };
}

/**
 * Put the dark stylesheet link back into the state ReSpec chose, because by save
 * time fixup.js has been driving it live: it sets `media = ""` and toggles
 * `disabled` to follow the reader's theme, and both are reflected content
 * attributes. Saving a document while the reader had dark selected would
 * otherwise export an enabled, unconditional dark sheet, which now sits last in
 * `head` and so wins the cascade, rendering dark for everyone including readers
 * without scripting.
 *
 * The spec's own intent is read back from the `color-scheme` meta tag rather
 * than captured when the link was inserted: fixup.js never touches that tag, so
 * it still says what the spec opted into.
 *
 * @param {Document} exportDoc
 */
function restoreDarkLinkState(exportDoc) {
  const darkLink = exportDoc.querySelector(
    `head link[rel~="stylesheet"][href="${getStyleUrl("dark.css")}"]`
  );
  if (!darkLink) return;
  const colorScheme = exportDoc.querySelector("head meta[name=color-scheme]");
  if (colorScheme?.getAttribute("content")?.includes("dark")) {
    darkLink.setAttribute("media", "(prefers-color-scheme: dark)");
    darkLink.removeAttribute("disabled");
  } else {
    darkLink.removeAttribute("media");
    darkLink.setAttribute("disabled", "");
  }
}

/**
 * @param {Conf} conf
 */
export function run(conf) {
  // Attach W3C fixup script after we are done.
  if (!conf.noTOC) {
    sub("end-all", attachFixupScript, { once: true });
  }

  const finalStyleURL = getStyleUrl(getStyleFile(conf));
  document.head.appendChild(
    html`<link rel="stylesheet" href="${finalStyleURL.href}" />`
  );
  // Make sure the W3C stylesheet is the last stylesheet, as required by W3C Pub Rules.
  sub("beforesave", styleMover(finalStyleURL));

  // Add color scheme meta tag and style
  /** @type {HTMLMetaElement | null} */
  let colorScheme = document.querySelector("head meta[name=color-scheme]");
  if (!colorScheme) {
    // Default to light mode during transitional period.
    colorScheme = /** @type {HTMLMetaElement} */ (
      html`<meta name="color-scheme" content="light" />`
    );
    document.head.appendChild(colorScheme);
  }
  // W3C's fixup.js only injects the light/dark/auto toggle when it can find the
  // dark stylesheet link, and it drives that link with `.disabled`. Light-only
  // specs never had the link, so the toggle silently never appeared (#5200). Add
  // it either way, switched off when the spec has not opted into dark mode.
  const darkModeStyleURL = getStyleUrl("dark.css");
  const isDark = colorScheme.content.includes("dark");
  const darkLink = html`<link
    rel="stylesheet"
    href="${darkModeStyleURL.href}"
  />`;
  if (isDark) darkLink.media = "(prefers-color-scheme: dark)";
  // Setting `.disabled` on a still-loading link does not stick in Chrome, and the next write
  // drops the sheet (#5436), so set the state before the element enters the document.
  if (!isDark) darkLink.setAttribute("disabled", "");
  document.head.appendChild(darkLink);
  // The dark sheet has to end up last. It and base.css set the same `:root`
  // custom properties at equal specificity, and the mover above puts the
  // maturity-level sheet, which `@import`s base.css, at the end of `head` on
  // export. Without this the toggle enables a sheet that then loses the cascade
  // and the reader sees nothing change. Also what W3C Pub Rules require.
  sub(
    "beforesave",
    /** @param {Document} exportDoc */ exportDoc => {
      styleMover(darkModeStyleURL)(exportDoc);
      restoreDarkLinkState(exportDoc);
    }
  );
}

/** @param {Conf} conf */
function getStyleFile(conf) {
  const canonicalStatus = conf.specStatus?.toUpperCase() ?? "";
  let styleFile;
  const canUseW3CStyle =
    [
      ...recTrackStatus,
      ...registryTrackStatus,
      ...W3CNotes,
      "ED",
      "MEMBER-SUBM",
    ].includes(canonicalStatus) && conf.wgId;

  // Figure out which style file to use.
  switch (canonicalStatus) {
    case "WD":
    case "FPWD":
      styleFile = canUseW3CStyle ? "W3C-WD" : "base.css";
      break;
    case "CG-DRAFT":
    case "CG-FINAL":
    case "BG-DRAFT":
    case "BG-FINAL":
      styleFile = canonicalStatus.toLowerCase();
      break;
    case "UD":
    case "UNOFFICIAL":
      styleFile = "W3C-UD";
      break;
    case "FINDING":
    case "DRAFT-FINDING":
    case "EDITOR-DRAFT-FINDING":
    case "BASE":
      styleFile = "base.css";
      break;
    case "MEMBER-SUBM":
      styleFile = "W3C-Member-SUBM";
      break;
    default:
      styleFile = canUseW3CStyle ? `W3C-${conf.specStatus}` : "base.css";
  }

  return styleFile;
}

function getStyleUrl(styleFile = "base.css") {
  return new URL(`/StyleSheets/TR/2021/${styleFile}`, "https://www.w3.org/");
}
