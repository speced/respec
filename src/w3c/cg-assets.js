// @ts-check
/**
 * Module w3c/cg-assets
 *
 * The style sheets and scripts of the Community Group specification redesign,
 * which live in w3c/cg-assets rather than in /StyleSheets/TR/2021/. Only the
 * `cgRedesignStatus` documents use them; `CG-DRAFT` and `CG-FINAL` keep the
 * older W3C-hosted CG styles.
 *
 * The markup this emits is the contract documented in cg-assets' README, under
 * "How a specification uses these".
 */

import { cgRedesignStatus } from "./headers.js";
import { createResourceHint } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { sub } from "../core/pubsubhub.js";

export const name = "w3c/cg-assets";

/**
 * CG specifications are to be published on w3.org eventually; until they are,
 * the assets are served from GitHub Pages. Changing where they live is this
 * one line.
 */
export const CG_ASSETS_BASE = "https://w3c.github.io/cg-assets/";

/** @param {string} path */
export function cgAssetUrl(path) {
  return new URL(path, CG_ASSETS_BASE).href;
}

/** @param {Conf} conf */
export function isCGSpec(conf) {
  return cgRedesignStatus.includes(conf.specStatus ?? "");
}

/**
 * base.css, cg-spec.css and dark.css all set the same `:root` custom properties
 * at equal specificity, so a document that loads them out of order gets the
 * wrong colours. Keep them adjacent and in this order, live and on save.
 */
const STYLES = ["css/base.css", "css/cg-spec.css", "css/dark.css"];

const SCRIPTS = ["js/cg-fixup.js", "js/dark.js", "js/cg-metadata.js"];

/**
 * Drops the w3.org styles and hints that this module's sibling w3c/style adds
 * at import time, before any configuration is readable.
 */
function removeTRAssets() {
  const selectors = [
    'head link[rel~="preconnect"][href^="https://www.w3.org"]',
    'head link[rel~="preload"][href^="https://www.w3.org/StyleSheets/TR/"]',
    'head link[rel~="preload"][href^="https://www.w3.org/scripts/TR/"]',
    'head link[rel~="stylesheet"][href^="https://www.w3.org/StyleSheets/TR/"]',
  ];
  for (const link of document.querySelectorAll(selectors.join(", "))) {
    link.remove();
  }
}

function createResourceHints() {
  /** @type {ResourceHintOption[]} */
  const opts = [{ hint: "preconnect", href: CG_ASSETS_BASE }];
  for (const path of STYLES) {
    opts.push({ hint: "preload", href: cgAssetUrl(path), as: "style" });
  }
  const hints = document.createDocumentFragment();
  for (const link of opts.map(createResourceHint)) {
    hints.appendChild(link);
  }
  return hints;
}

/**
 * The dark sheet carries `media` so that a reader without JavaScript still gets
 * a palette matching their system, and `class="dark-mode"` so that cg-assets'
 * dark.js can find the sheet it drives from the theme picker.
 *
 * @param {string} path
 */
function createStyleLink(path) {
  const href = cgAssetUrl(path);
  return path.endsWith("dark.css")
    ? html`<link
        rel="stylesheet"
        class="dark-mode"
        media="(prefers-color-scheme: dark)"
        href="${href}"
      />`
    : html`<link rel="stylesheet" href="${href}" />`;
}

/**
 * cg-metadata.js builds the status blocks, several of which sit at the foot of
 * the document, so it must not run before the document is complete.
 *
 * @param {string} path
 */
function createScript(path) {
  const src = cgAssetUrl(path);
  const script = path.endsWith("cg-metadata.js")
    ? html`<script src="${src}" defer></script>`
    : html`<script src="${src}"></script>`;
  // Make script async false to preserve execution order and avoid race conditions.
  script.async = false;
  return script;
}

/**
 * Puts the exported document back the way the generator wrote it.
 *
 * The three scripts run in ReSpec's own browser, so whatever they did to suit
 * that one reader -- which theme was showing, whether the status metadata
 * loaded -- would otherwise be published as everyone's starting state. This is
 * the same job w3c/style's `styleMover` and `restoreDarkLinkState` do for the
 * W3C TR assets.
 *
 * Note this receives the cloned `<html>` element, not a document; see
 * core/exporter.
 *
 * @param {Element} exportRoot
 */
function restoreExportedState(exportRoot) {
  const head = exportRoot.querySelector("head");
  // Order matters as much on disk as it does live: all three sheets set the
  // same `:root` custom properties at equal specificity.
  for (const path of STYLES) {
    const link = exportRoot.querySelector(
      `head link[rel~="stylesheet"][href="${cgAssetUrl(path)}"]`
    );
    if (!link) continue;
    head?.append(link);
    // dark.js swaps the media list for "all" / "not all" to follow the reader's
    // theme. Published like that, a reader without scripting gets either an
    // unconditional dark page or no dark palette at all.
    if (path.endsWith("dark.css")) {
      link.setAttribute("media", "(prefers-color-scheme: dark)");
    }
  }

  // dark.js also marks the body while dark is showing. core/exporter already
  // drops cg-fixup.js's `toc-sidebar` / `toc-inline` for the same reason.
  exportRoot.querySelector("body")?.classList.remove("darkmode");
}

/** Inserts the CG style sheets and scripts, replacing the W3C TR ones. */
export function insertCGAssets() {
  removeTRAssets();
  document.head.prepend(createResourceHints());
  for (const path of STYLES) {
    document.head.appendChild(createStyleLink(path));
  }
  sub("beforesave", restoreExportedState);

  // At the end, like w3c/style does for fixup.js: these scripts read the
  // finished document.
  sub(
    "end-all",
    () => {
      for (const path of SCRIPTS) {
        document.body.appendChild(createScript(path));
      }
    },
    { once: true }
  );
}
