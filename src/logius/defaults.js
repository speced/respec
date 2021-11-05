/**
 * Sets the defaults for NL-Respec documents
 */
export const name = "logius/defaults";
import { coreDefaults } from "../core/defaults.js";

// todo: check if licenses are already defined
const licenses = new Map([
  [
    "cc0",
    {
      name: "Creative Commons 0 Public Domain Dedication",
      short: "CC0",
      url: "https://creativecommons.org/publicdomain/zero/1.0/",
      image:
        "https://tools.geostandaarden.nl/respec/style/logos/CC-Licentie.svg",
    },
  ],
  [
    "cc-by",
    {
      name: "Creative Commons Attribution 4.0 International Public License",
      short: "CC-BY",
      url: "https://creativecommons.org/licenses/by/4.0/legalcode",
      image: "https://tools.geostandaarden.nl/respec/style/logos/cc-by.svg",
    },
  ],
  [
    "cc-by-nd",
    {
      name:
        "Creative Commons Attribution-NoDerivatives 4.0 International Public License",
      short: "CC-BY-ND",
      url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode.nl",
      image: "https://tools.geostandaarden.nl/respec/style/logos/cc-by-nd.svg",
    },
  ],
]);
// todo: check on overrides ?
const nlRespecDefaults = {
  lint: {
    "no-headingless-sections": false,
    "privsec-section": true,
    "no-http-props": true,
  },
  doJsonLd: true,
  license: "cc-by",
  specStatus: "BASIS",
  logos: [],
};

function computeProps(conf) {
  return {
    isCCBY: conf.license === "cc-by",
    licenseInfo: licenses.get(conf.license),
    isBasic: conf.specStatus === "BASIS",
    isRegular: conf.specStatus === "BASIS",
  };
}

function addLogoData(conf) {
  if (!conf.nl_logo) {
    nlRespecDefaults.logos.push({
      src: "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.svg",
      alt: "Geonovum",
      id: "Geonovum",
      height: 67,
      width: 132,
      url: "https://www.geonovum.nl/",
    });
  } else {
    nlRespecDefaults.logos.push(conf.nl_logo);
  }
}

export function run(conf) {
  // assign the defaults
  addLogoData(conf);
  // console.log(`config: ${conf.nl_logo.src}`),
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...nlRespecDefaults.lint,
          ...conf.lint,
        };
  Object.assign(conf, {
    ...coreDefaults,
    ...nlRespecDefaults,
    ...conf,
    lint,
  });
  Object.assign(conf, { ...nlRespecDefaults, ...conf });
  // computed properties
  Object.assign(conf, computeProps(conf));
}
