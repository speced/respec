/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import { coreDefaults } from "../core/defaults.js";
import linter from "../core/linter.js";
import { rule as privsecSectionRule } from "../core/linter-rules/privsec-section.js";

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
  xref: true,
};

/** @param {import("../respec-document").RespecDocument} respecDoc */
export default function run({ configuration: conf }) {
  if (conf.specStatus === "unofficial") return;
  // assign the defaults
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...w3cDefaults.lint,
          ...conf.lint,
        };
  Object.assign(conf, {
    ...coreDefaults,
    ...w3cDefaults,
    ...conf,
    lint,
  });
}
