// @ts-check
/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import { coreDefaults } from "../core/defaults.js";
import linter from "../core/linter.js";
import { rule as privsecSectionRule } from "../core/linter-rules/privsec-section.js";
import { rule as wptTestsExist } from "../core/linter-rules/wpt-tests-exist.js";

linter.register(privsecSectionRule, wptTestsExist);

const w3cLogo = {
  src: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
  alt: "W3C",
  height: 48,
  width: 72,
  url: "https://www.w3.org/",
};

const w3cDefaults = {
  lint: {
    "privsec-section": true,
    "wpt-tests-exist": false,
  },
  doJsonLd: false,
  logos: [],
  xref: true,
};

export function run(conf) {
  // assign the defaults
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...w3cDefaults.lint,
          ...conf.lint,
        };

  if (conf.specStatus && conf.specStatus.toLowerCase() !== "unofficial") {
    w3cDefaults.logos.push(w3cLogo);
    if (!conf.hasOwnProperty("license")) {
      w3cDefaults.license = "w3c-software-doc";
    }
  }

  Object.assign(conf, {
    ...coreDefaults,
    ...w3cDefaults,
    ...conf,
    lint,
  });
}
