// @ts-check
/**
 * Module w3c/cg-spec
 *
 * Declares what a Community Group specification is, for cg-assets'
 * cg-metadata.js: which kind of document it is, which entry of the collected
 * status metadata belongs to it, and how mature it is.
 *
 * This runs after core/github and w3c/level, both of which can still change
 * `shortName`, and that name is the metadata lookup key.
 */

import { docLink, showError } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { isCGSpec } from "./cg-assets.js";
import { sub } from "../core/pubsubhub.js";

export const name = "w3c/cg-spec";

/** @param {Conf} conf */
export function run(conf) {
  if (!isCGSpec(conf)) return;

  if (!conf.shortName) {
    const specStatus = conf.specStatus ?? "";
    const msg = docLink`The ${"[shortName]"} configuration option is required for a \`"${specStatus}"\` document.`;
    const hint = docLink`The status metadata of a Community Group specification is looked up by short name. Please set ${"[shortName]"} to the specification's short name.`;
    showError(msg, name, { hint });
    // Without it there is nothing to look the metadata up by, so say nothing
    // rather than publish an identity that cannot resolve.
    return;
  }

  const type = conf.specStatus === "CG-SNAPSHOT" ? "snapshot" : "living";
  document.head.append(
    html`<meta name="cg-spec-type" content="${type}" />`,
    html`<meta name="cg-spec-shortname" content="${conf.shortName}" />`,
    html`<meta name="cg-spec-maturity" content="${conf.cgMaturity}" />`
  );

  // The state cg-metadata.js overwrites with "fresh", "stale" or
  // "unknown-type". Defaulting to "fresh" would let a document whose script was
  // stripped go on claiming its status is current.
  document.documentElement.dataset.cgMetadata = "static";
  // cg-metadata.js also runs in the generator's browser, so without this the
  // published file would ship the generator's own result -- "fresh" as of a
  // fetch no reader made. Note the argument is the cloned `<html>` element
  // rather than a document; see core/exporter.
  sub(
    "beforesave",
    /** @param {HTMLElement} exportRoot */ exportRoot => {
      exportRoot.dataset.cgMetadata = "static";
    }
  );
}
