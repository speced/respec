/**
 * Sets the core defaults
 */
export const name = "core/defaults";
import { rule as checkInternalSlots } from "./linter-rules/check-internal-slots";
import { rule as checkPunctuation } from "./linter-rules/check-punctuation";
import linter from "./linter";
import { rule as localRefsExist } from "./linter-rules/local-refs-exist";
import { rule as noHeadinglessSectionsRule } from "./linter-rules/no-headingless-sections";
import { rule as noHttpPropsRule } from "./linter-rules/no-http-props";

linter.register(
  noHttpPropsRule,
  noHeadinglessSectionsRule,
  checkPunctuation,
  localRefsExist,
  checkInternalSlots
);

const coreDefaults = {
  lint: {
    "no-headingless-sections": true,
    "no-http-props": true,
    "check-punctuation": false,
    "local-refs-exist": true,
    "check-internal-slots": false,
  },
  pluralize: false,
  specStatus: "base",
  highlightVars: true,
  addSectionLinks: true,
};

export function run(conf) {
  // assign the defaults
  Object.assign(conf, {
    ...coreDefaults,
    ...conf,
  });
  Object.assign(conf.lint, {
    ...coreDefaults.lint,
    ...conf.lint,
  });
}
