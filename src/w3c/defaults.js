// @ts-check
/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import { bgStatus, cgStatus, cgbgStatus } from "./headers.js";
import { docLink, showError } from "../core/utils.js";
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
