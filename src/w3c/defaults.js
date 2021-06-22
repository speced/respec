// @ts-check
/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import {
  bgStatus,
  cgStatus,
  cgbgStatus,
  maybeRecTrack,
  recTrackStatus,
} from "./headers.js";
import { mdJoinOr, showError } from "../core/utils.js";
import { coreDefaults } from "../core/defaults.js";
import { docLink } from "../core/respec-docs.js";

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
    a11y: false,
  },
  doJsonLd: false,
  logos: [],
  xref: true,
  wgId: "",
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
        const msg = docLink`W3C Community Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const supportedStatus = mdJoinOr(cgStatus, { quotes: true });
        const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"CG-DRAFT"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "CG-DRAFT";
      }
      break;
    }
    case "bg": {
      if (![...bgStatus, "unofficial"].includes(specStatus)) {
        const msg = docLink`W3C Business Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const supportedStatus = mdJoinOr(bgStatus, { quotes: true });
        const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"BG-DRAFT"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "BG-DRAFT";
      }
      break;
    }
    case "wg": {
      const trackStatus = [
        "unofficial",
        "ED",
        ...maybeRecTrack,
        ...recTrackStatus,
      ];
      if (
        // it's using a BG/CG status
        cgbgStatus.includes(specStatus) ||
        // Is not one of the supported status for working groups
        !trackStatus.includes(specStatus)
      ) {
        const msg = docLink`W3C Working Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const supportedStatus = mdJoinOr(trackStatus, { quotes: true });
        const hint = docLink`Please use one of: ${supportedStatus}. Please see ${"[specStatus]"} for appropriate values for this type of group.`;
        showError(msg, name, { hint });
      }
      break;
    }
  }
}
