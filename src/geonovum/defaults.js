/**
 * Sets the defaults for Geonovum documents
 */
export const name = "geonovum/defaults";
import linter from "core/linter";
import { rule as noHeadinglessSectionsRule } from "core/linter-rules/no-headingless-sections";
import { rule as noHttpPropsRule } from "core/linter-rules/no-http-props";
import { rule as privsecSectionRule } from "geonovum/linter-rules/privsec-section";

linter.register(noHttpPropsRule, privsecSectionRule, noHeadinglessSectionsRule);

// const cgbg = new Set(["BG-DRAFT", "BG-FINAL", "CG-DRAFT", "CG-FINAL"]);
const licenses = new Map([
  [
    "cc0",
    {
      name: "Creative Commons 0 Public Domain Dedication",
      short: "CC0",
      url: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  ],
  [
    "cc-by",
    {
      name: "Creative Commons Attribution 4.0 International Public License",
      short: "CC-BY",
      url: "https://creativecommons.org/licenses/by/4.0/legalcode",
    },
  ],
  [
    "cc-by-nd",
    {
      name: "Creative Commons Attribution-NoDerivatives 4.0 International Public License",
      short: "CC-BY-ND",
      url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode.nl",
    },
  ]
]);

const geonovumDefaults = {
  lint: {
    "no-headingless-sections": true,
    "privsec-section": true,
    "no-http-props": true,
  },
  doJsonLd: true,
  license: "cc-by-nd",
  specStatus: "GN-BASIS",
  logos: [{
    src: "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.svg",
    alt: "Geonovum",
    id: "Geonovum",
    height: 67,
    width: 132,
    url: "https://www.geonovum.nl/"
  }]
};

function computeProps(conf) {
  return {
    isCCBY: conf.license === "cc-by-nd",
    licenseInfo: licenses.get(conf.license),
    isBasic: conf.specStatus === "GN-BASIS",
    isRegular: conf.specStatus === "GN-BASIS",
  };
}

export function run(conf) {
  // assign the defaults
  Object.assign(conf, { ...geonovumDefaults, ...conf });
  //computed properties
  Object.assign(conf, computeProps(conf));
}
