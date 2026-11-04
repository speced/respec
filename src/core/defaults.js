// @ts-check
/**
 * Sets the core defaults
 */
import { docLink, showWarning } from "./utils.js";

export const name = "core/defaults";

export const coreDefaults = {
  lint: {
    "no-headingless-sections": true,
    "no-http-props": true,
    "no-unused-vars": false,
    "check-punctuation": false,
    "local-refs-exist": true,
    "check-internal-slots": false,
    "check-charset": false,
    "privsec-section": false,
    "no-dfn-in-abstract": false,
  },
  pluralize: true,
  specStatus: "base",
  highlightVars: true,
  addSectionLinks: true,
};

/**
 * Aliases the deprecated `noToc` option to the canonical `noTOC`.
 * @param {Conf} conf
 */
export function normalizeNoTOC(conf) {
  if (!conf.hasOwnProperty("noToc")) return;
  conf.noTOC ??= conf.noToc;
  const msg = "The `noToc` configuration option is deprecated.";
  const hint = docLink`Please use ${"[noTOC]"} instead.`;
  showWarning(msg, name, { hint });
}
