/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import { rule as checkPunctuation } from "../core/linter-rules/check-punctuation";
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
  localRefsExist
);

const cgbg = new Set(["BG-DRAFT", "BG-FINAL", "CG-DRAFT", "CG-FINAL"]);
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
    "w3c-software",
    {
      name: "W3C Software Notice and License",
      short: "W3C Software",
      url:
        "https://www.w3.org/Consortium/Legal/2002/copyright-software-20021231",
    },
  ],
  [
    "w3c-software-doc",
    {
      name: "W3C Software and Document Notice and License",
      short: "W3C Software and Document",
      url:
        "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document",
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
]);

const w3cDefaults = {
  lint: {
    "no-headingless-sections": true,
    "privsec-section": true,
    "no-http-props": true,
    "check-punctuation": false,
    "local-refs-exist": true,
  },
  pluralize: false,
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

function computeProps(conf) {
  return {
    isCCBY: conf.license === "cc-by",
    licenseInfo: licenses.get(conf.license),
    isCGBG: cgbg.has(conf.specStatus),
    isCGFinal: conf.isCGBG && /G-FINAL$/.test(conf.specStatus),
    isBasic: conf.specStatus === "base",
    isRegular: !conf.isCGBG && conf.specStatus === "base",
  };
}

export function run(conf) {
  // assign the defaults
  Object.assign(conf, {
    ...w3cDefaults,
    ...conf,
  });
  Object.assign(conf.lint, {
    ...w3cDefaults.lint,
    ...conf.lint,
  });
  //computed properties
  Object.assign(conf, computeProps(conf));
}
