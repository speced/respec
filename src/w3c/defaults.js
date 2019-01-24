/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import { definitionMap } from "../core/dfn-map";
import linter from "../core/linter";
import { rule as privsecSectionRule } from "./linter-rules/privsec-section";

linter.register(privsecSectionRule);

const w3cDefaults = {
  lint: {
    "privsec-section": true,
  },
  pluralize: true,
  doJsonLd: false,
  license: "w3c-software-doc",
  logos: [
    {
      src: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
      alt: "W3C",
      height: 48,
      width: 72,
      url: "https://www.w3.org/",
    },
  ],
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
