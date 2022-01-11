// @ts-check
/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import {
  W3CNotes,
  bgStatus,
  cgStatus,
  cgbgStatus,
  recTrackStatus,
  registryTrackStatus,
} from "./headers.js";
import { codedJoinOr, docLink, showError } from "../core/utils.js";
import { coreDefaults } from "../core/defaults.js";

const w3cLogo = {
  src: "https://www.w3.org/StyleSheets/TR/2021/logos/W3C",
  alt: "W3C",
  height: 48,
  width: 72,
  url: "https://www.w3.org/",
};

const w3cDefaults = {
  lint: {
    "privsec-section": false,
    "required-sections": true,
    "wpt-tests-exist": false,
    "no-unused-dfns": "warn",
    a11y: false,
  },
  doJsonLd: false,
  logos: [],
  xref: true,
  wgId: "",
  otherLinks: [],
  excludeGithubLinks: true,
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

  Object.assign(conf, {
    ...coreDefaults,
    ...w3cDefaults,
    ...conf,
    lint,
  });

  if (conf.specStatus !== "unofficial" && !conf.hasOwnProperty("license")) {
    conf.license = "w3c-software-doc";
  }

  processLogos(conf);

  if (conf.groupType && conf.specStatus) {
    validateStatusForGroup(conf);
  }
}

function processLogos(conf) {
  const status = conf.specStatus ?? "";
  // Always include the W3C logo and license for W3C Recommendation track.
  // Excludes "ED" status
  if (
    [...recTrackStatus, ...registryTrackStatus, ...W3CNotes].includes(status)
  ) {
    conf.logos?.unshift(w3cLogo);
  }

  // Special case for "ED" status...
  // Allow overriding the logos, otherwise include the w3c logo.
  if (status === "ED" && conf.logos?.length === 0) {
    conf.logos.push(w3cLogo);
  }
}

function validateStatusForGroup(conf) {
  const { specStatus, groupType } = conf;
  switch (groupType) {
    case "cg": {
      if (![...cgbgStatus, "unofficial"].includes(specStatus)) {
        const msg = docLink`W3C Community Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const supportedStatus = codedJoinOr(cgStatus, { quotes: true });
        const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"CG-DRAFT"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "CG-DRAFT";
      }
      break;
    }
    case "bg": {
      if (![...bgStatus, "unofficial"].includes(specStatus)) {
        const msg = docLink`W3C Business Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const supportedStatus = codedJoinOr(bgStatus, { quotes: true });
        const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"BG-DRAFT"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "BG-DRAFT";
      }
      break;
    }
    case "wg": {
      if (cgbgStatus.includes(specStatus)) {
        const msg = docLink`W3C Working Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const hint = docLink`Please see ${"[specStatus]"} for appropriate values for this type of group.`;
        showError(msg, name, { hint });
      }
      break;
    }
  }
}
