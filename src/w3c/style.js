// @ts-check
/**
 * Module w3c/style
 * Inserts a link to the appropriate W3C style for the specification's maturity level.
 * */

import { W3CNotes, recTrackStatus, registryTrackStatus } from "./headers.js";
import { createResourceHint } from "../core/utils.js";
import { disableDarkStyles } from "../core/insert-style.js";
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
 * Restores the dark stylesheet link to the state ReSpec chose, in the document being
 * exported.
 *
 * Keep this on the `beforesave` path: fixup.js drives that link live to follow the reader's
 * theme, and `media` and `disabled` are reflected content attributes, so a spec saved while
 * dark was showing would otherwise publish an unconditional dark sheet that every reader
 * gets, scripting or not.
 *
 * Intent comes from the `color-scheme` meta tag rather than a flag captured at insert time,
 * because fixup.js never touches that tag.
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

  if (conf.darkMode === false) {
    disableDarkStyles();
    // Without this the page still downloads dark.css, which it will never apply.
    document
      .querySelector(
        `head link[rel~="preload"][href="${getStyleUrl("dark.css")}"]`
      )
      ?.remove();
    return;
  }

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
  // Add the link even for a light-only spec, switched off: fixup.js injects the
  // light/dark/auto toggle only when it can find this link, and drives it with `.disabled`.
  const darkModeStyleURL = getStyleUrl("dark.css");
  const isDark = colorScheme.content.includes("dark");
  const darkLink = html`<link
    rel="stylesheet"
    href="${darkModeStyleURL.href}"
  />`;
  if (isDark) darkLink.media = "(prefers-color-scheme: dark)";
  // Set `disabled` before appending: Chrome does not keep it on a link that is still
  // loading, and the next write to that link drops the sheet.
  if (!isDark) darkLink.setAttribute("disabled", "");
  document.head.appendChild(darkLink);
  // Move the dark sheet too, or the toggle enables a sheet that then loses the cascade and
  // the reader sees nothing change: it and base.css set the same `:root` custom properties
  // at equal specificity, and the mover above puts the maturity-level sheet, which
  // `@import`s base.css, at the end of `head`.
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
