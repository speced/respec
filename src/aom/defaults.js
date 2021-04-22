// @ts-check
/**
 * Sets the defaults for AOM specs
 */
export const name = "aom/defaults";
import { bgStatus, cgStatus, cgbgStatus } from "./headers.js";
import { docLink, showError } from "../core/utils.js";
import { coreDefaults } from "../core/defaults.js";

const aomLogo = {
  src: "http://aomedia.org/assets/images/aomedia-icon-only.png",
  alt: "AOM",
  height: 174,
  width: 174,
  url: "https://aomedia.org/",
};

const aomDefaults = {
  lint: {
    "privsec-section": true,
    "wpt-tests-exist": false,
    a11y: false,
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
          ...conf.lint,
        };

  if (conf.specStatus && conf.specStatus.toLowerCase() !== "unofficial") {
    aomDefaults.logos.push(aomLogo);
    if (!conf.hasOwnProperty("license")) {
      aomDefaults.license = "w3c-software-doc";
    }
  }

  Object.assign(conf, {
    ...coreDefaults,
    ...aomDefaults,
    ...conf,
    lint,
  });

  if (conf.groupType && conf.specStatus) {
    validateStatusForGroup(conf);
  }
}

function validateStatusForGroup(conf) {
  const { specStatus, groupType } = conf;
  switch (groupType) {
    case "cg": {
      if (![...cgbgStatus, "unofficial"].includes(specStatus)) {
        const msg = `W3C Community Group documents can't use \`"${specStatus}"\` for the ${docLink(
          "specStatus"
        )} configuration option.`;
        const hint = `Please use one of: ${toMDCode(
          cgStatus
        )}. Automatically falling back to \`"CG-DRAFT"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "CG-DRAFT";
      }
      break;
    }
    case "bg": {
      if (![...bgStatus, "unofficial"].includes(specStatus)) {
        const msg = `W3C Business Group documents can't use \`"${specStatus}"\` for the ${docLink(
          "specStatus"
        )} configuration option.`;
        const hint = `Please use one of: ${toMDCode(
          bgStatus
        )}. Automatically falling back to \`"BG-DRAFT"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "BG-DRAFT";
      }
      break;
    }
    case "wg": {
      if (cgbgStatus.includes(specStatus)) {
        const msg = `W3C Working Group documents can't use \`"${specStatus}"\` for the ${docLink(
          "specStatus"
        )} configuration option.`;
        const hint = `Please see ${docLink(
          "specStatus"
        )} for appropriate values for this type of group.`;
        showError(msg, name, { hint });
      }
      break;
    }
  }
}

function toMDCode(list) {
  return list.map(item => `\`"${item}"\``).join(", ");
}
