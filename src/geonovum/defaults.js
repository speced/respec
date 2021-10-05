// @ts-check
/**
 * Sets the defaults for Geonovum documents
 */
export const name = "geonovum/defaults";
import { coreDefaults } from "../core/defaults.js";

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
  ],
]);

const geonovumDefaults = {
  lint: {
    "privsec-section": true,
  },
  doJsonLd: true,
  license: "cc-by",
  specStatus: "GN-BASIS",
  logos: [
    {
      src: "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.svg",
      alt: "Geonovum",
      id: "Geonovum",
      height: 67,
      width: 132,
      url: "https://www.geonovum.nl/",
    },
  ],
};

function computeProps(conf) {
  return {
    isCCBY: conf.license === "cc-by",
    licenseInfo: licenses.get(conf.license),
    isBasic: conf.specStatus === "GN-BASIS",
    isRegular: conf.specStatus === "GN-BASIS",
  };
}

export function run(conf) {
  // assign the defaults
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...geonovumDefaults.lint,
          ...conf.lint,
        };
  Object.assign(conf, {
    ...coreDefaults,
    ...geonovumDefaults,
    ...conf,
    lint,
  });
  // computed properties
  Object.assign(conf, computeProps(conf));
}
