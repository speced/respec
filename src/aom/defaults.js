// @ts-check
/**
 * Sets the defaults for AOM specs
 */
export const name = "aom/defaults";
import { coreDefaults } from "../core/defaults.js";

const licenses = new Map([
  [
    "aom",
    {
      name: "Alliance for Open Media License",
      short: "AOM",
      url: "http://aomedia.org/license/",
    },
  ],
]);

const aomDefaults = {
  // treat document as "Common Markdown" (with a little bit of HTML).
  // choice between Markdown and HTML depends on the complexity of the spec
  // example of Markdown spec: https://github.com/WICG/netinfo/blob/gh-pages/index.html
  // Helpful guide: https://respec.org/docs/#markdown
  format: "markdown",
  logos: [
    {
      src: "https://aomedia.org/assets/images/aomedia-icon-only.png",
      alt: "AOM",
      id: "AOM",
      height: 170,
      width: 170,
      url: "https://aomedia.org/",
    },
  ],
  license: "aom",
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
          ...aomDefaults.lint,
          ...conf.lint,
        };
  Object.assign(conf, {
    ...coreDefaults,
    ...aomDefaults,
    ...conf,
    lint,
  });

  // computed properties
  Object.assign(conf, computeProps(conf));
}
