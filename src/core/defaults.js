// @ts-check
/**
 * Sets the core defaults
 */
export const name = "core/defaults";
import { rule as checkCharset } from "./linter-rules/check-charset.js";
import { rule as checkInternalSlots } from "./linter-rules/check-internal-slots.js";
import { rule as checkPunctuation } from "./linter-rules/check-punctuation.js";
import linter from "./linter.js";
import { rule as localRefsExist } from "./linter-rules/local-refs-exist.js";
import { rule as noHeadinglessSectionsRule } from "./linter-rules/no-headingless-sections.js";
import { rule as noHttpPropsRule } from "./linter-rules/no-http-props.js";
import { rule as noUnusedVars } from "./linter-rules/no-unused-vars.js";
import { rule as privsecSection } from "./linter-rules/privsec-section.js";

linter.register(
  noHttpPropsRule,
  noHeadinglessSectionsRule,
  noUnusedVars,
  checkPunctuation,
  localRefsExist,
  checkInternalSlots,
  checkCharset,
  privsecSection
);

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
