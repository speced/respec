/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import { rule as checkInternalSlots } from "../core/linter-rules/check-internal-slots";
import { rule as checkPunctuation } from "../core/linter-rules/check-punctuation";
import { definitionMap } from "../core/dfn-map";
import linter from "../core/linter";
import { rule as localRefsExist } from "../core/linter-rules/local-refs-exist";
import { rule as noHeadinglessSectionsRule } from "../core/linter-rules/no-headingless-sections";
import { rule as noHttpPropsRule } from "../core/linter-rules/no-http-props";
import { rule as privsecSectionRule } from "./linter-rules/privsec-section";

linter.register(
  noHttpPropsRule,
  privsecSectionRule,
  noHeadinglessSectionsRule,
  checkPunctuation,
  localRefsExist,
  checkInternalSlots
);

const w3cDefaults = {
  lint: {
    "no-headingless-sections": true,
    "privsec-section": true,
    "no-http-props": true,
    "check-punctuation": false,
    "local-refs-exist": true,
    "check-internal-slots": false,
  },
  pluralize: true,
  highlightVars: true,
  doJsonLd: false,
  license: "w3c-software-doc",
  specStatus: "base",
  logos: [
    {
      src: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
      alt: "W3C",
      height: 48,
      width: 72,
      url: "https://www.w3.org/",
    },
  ],
  addSectionLinks: true,
};

export function run(conf) {
  if (conf.specStatus === "unofficial") return;
  // assign the defaults
  Object.assign(conf, {
    ...w3cDefaults,
    ...conf,
  });
  Object.assign(conf.lint, {
    ...w3cDefaults.lint,
    ...conf.lint,
  });

  // TODO: eventually, we want to remove this.
  // It's here for legacy support of json-ld specs
  // see https://github.com/w3c/respec/issues/2019
  Object.assign(conf, { definitionMap });
}
