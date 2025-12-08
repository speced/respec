/**
 * Sets the defaults for W3C specs
 */
export const name = "pcisig/pcisig-defaults";

/*const cgbg = new Set(["BG-DRAFT", "BG-FINAL", "CG-DRAFT", "CG-FINAL"]);
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
*/
const pcisigDefaults = {
  processVersion: 2017,
  lint: {
    "no-headingless-sections": true,
    "privsec-section": true,
    "no-http-props": true,
  },
  doRDFa: false,
  license: "pcisig-draft",
  specStatus: "WD",
  logos: [],
};

/*function computeProps(conf) {
  return {
    isCCBY: conf.license === "cc-by",
    licenseInfo: licenses.get(conf.license),
    isCGBG: cgbg.has(conf.specStatus),
    isCGFinal: conf.isCGBG && /G-FINAL$/.test(conf.specStatus),
    isBasic: conf.specStatus === "base",
    isRegular: !conf.isCGBG && conf.specStatus === "base",
  };
}
*/

export function run(conf) {
  // assign the defaults
  Object.assign(conf, { ...pcisigDefaults, ...conf });
  //computed properties
  //Object.assign(conf, computeProps(conf));
}
