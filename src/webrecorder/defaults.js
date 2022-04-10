// @ts-check
/**
 * Sets the defaults for Webrecorder specs
 */
export const name = "webrecorder/defaults";
import { coreDefaults } from "../core/defaults.js";

const licenses = new Map([
  [
    "cc-by",
    {
      name: "Creative Commons Attribution 4.0 International Public License",
      short: "CC-BY",
      url: "https://creativecommons.org/licenses/by/4.0/legalcode",
    },
  ],
]);

const webrecorderDefaults = {
  lint: {
    "privsec-section": true,
    "wpt-tests-exist": false,
  },
  prependW3C: false,
  doJsonLd: false,
  license: "cc-by",
  shortName: "WACZ",
  showPreviousVersion: false,
};

function computeProps(conf) {
  return {
    licenseInfo: licenses.get(conf.license),
  };
}

export function run(conf) {
  // assign the defaults
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...webrecorderDefaults.lint,
          ...conf.lint,
        };
  Object.assign(conf, {
    ...coreDefaults,
    ...webrecorderDefaults,
    ...conf,
    lint,
  });

  // computed properties
  Object.assign(conf, computeProps(conf));
}
