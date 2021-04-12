// @ts-check
/**
 * Sets the core defaults
 */
export const name = "core/defaults";

import linter from "./linter.js";
import { rule as noHttpPropsRule } from "./linter-rules/no-http-props.js";

linter.register(noHttpPropsRule);

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
  },
  pluralize: true,
  specStatus: "base",
  highlightVars: true,
  addSectionLinks: true,
};
