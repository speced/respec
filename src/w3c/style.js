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

// The author's own `<style>` elements, captured before ReSpec injects more, so the
// dark-mode strip below leaves them alone the way Bikeshed leaves author CSS alone.
// This excludes ReSpec's two stylesheets that carry an id by id rather than by
// timing, because `profiles/w3c.js` imports modules concurrently and nothing
// guarantees `core/style.js` has injected `#respec-mainstyle` before this module is
// evaluated. Excluding by id is correct whichever order they happen to run in.
const RESPEC_STYLE_IDS = ["respec-mainstyle", "baseline-stylesheet"];
const authorStyles = new Set(
  [...document.querySelectorAll("head style")].filter(
    el => !RESPEC_STYLE_IDS.includes(el.id)
  )
);

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
 * Remove every `@media (prefers-color-scheme: dark)` block from a stylesheet.
 *
 * Brace counting rather than Bikeshed's left-margin regex (`manager.py:250-270`),
 * because ReSpec's stylesheets reach the page from a minified bundle: there is no
 * newline to anchor to, the whole sheet is one line. Counts braces from the block's
 * opening one, so it works on minified and readable CSS alike.
 *
 * Known limit: a `{` or `}` inside a string or comment would miscount. None of
 * ReSpec's stylesheets contain one, and this only ever runs over ReSpec's own.
 *
 * @param {string} css
 * @returns {string}
 */
export function stripDarkMediaBlocks(css) {
  const opener = /@media[^{]*prefers-color-scheme\s*:\s*dark[^{]*\{/gi;
  let out = "";
  let copiedTo = 0;
  let match;
  while ((match = opener.exec(css)) !== null) {
    let depth = 1;
    let i = opener.lastIndex;
    while (i < css.length && depth > 0) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    }
    out += css.slice(copiedTo, match.index);
    copiedTo = i;
    opener.lastIndex = i;
  }
  return copiedTo === 0 ? css : out + css.slice(copiedTo);
}

/**
 * Strips ReSpec's own dark styles, the way Bikeshed's `removeInlineDarkStyles()`
 * strips its own, once the editor has turned dark mode off.
 *
 * Skip this and the browser paints a light page with dark ReSpec components for
 * anyone whose operating system prefers dark: dark CDDL tokens, a dark `.assert`
 * block, dark baseline pills. Nothing else can prevent that. Those blocks are
 * media queries, and neither CSS nor a meta tag can stop a media query matching,
 * which I measured in Safari 27, Chrome 151 and Firefox 153. Deleting the text is
 * the only lever ReSpec has.
 *
 * This runs once on `end-all`. That is late enough because every module injects
 * its stylesheet from `run()` or `prepare()`, and no module injects one at or
 * after `end-all`.
 */
function stripReSpecDarkStyles() {
  for (const style of document.querySelectorAll("head style")) {
    if (authorStyles.has(style)) continue;
    const stripped = stripDarkMediaBlocks(style.textContent);
    if (stripped !== style.textContent) style.textContent = stripped;
  }
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

  // The editor has turned dark mode off, so do what Bikeshed's `Dark Mode: off`
  // does: emit no `color-scheme` meta and no dark stylesheet link
  // (`boilerplate.py:1293` returns before it writes either), and strip dark blocks
  // out of our own styles. Omitting the link is the whole mechanism, because
  // fixup.js only builds the theme toggle when it finds that link.
  //
  // Strictly `=== false`. Absent is the default and `undefined` is falsy, so a
  // general falsy test would have disabled dark mode on every spec that never set
  // the option. Returning here also matters: the code below reads
  // `colorScheme.content`, which would throw once the meta is no longer injected.
  if (conf.darkMode === false) {
    // `createResourceHints()` above adds the preload hint at import time, before
    // any config exists, so this is the only place that can remove it. Worth doing:
    // a spec whose editor turned dark mode off should not fetch a stylesheet it
    // will never apply, and anyone searching for `link[href$="dark.css"]` would
    // still find the leftover hint.
    document
      .querySelector(
        `head link[rel~="preload"][href="${getStyleUrl("dark.css")}"]`
      )
      ?.remove();
    sub("end-all", stripReSpecDarkStyles, { once: true });
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
