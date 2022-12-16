// @ts-check
/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import {
  W3CNotes,
  bgStatus,
  cgStatus,
  recTrackStatus,
  registryTrackStatus,
  status2text,
  tagStatus,
  trStatus,
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

const memSubmissionLogo = {
  alt: "W3C Member Submission",
  href: "https://www.w3.org/Submission/",
  src: "https://www.w3.org/Icons/member_subm-v.svg",
  width: "211",
  height: "48",
};

const w3cDefaults = {
  lint: {
    "privsec-section": false,
    "required-sections": true,
    "wpt-tests-exist": false,
    "informative-dfn": "warn",
    "no-unused-dfns": "warn",
    a11y: false,
  },
  doJsonLd: false,
  logos: [],
  xref: true,
  wgId: "",
  otherLinks: [],
  excludeGithubLinks: true,
  subtitle: "",
  prevVersion: "",
  formerEditors: [],
  editors: [],
  authors: [],
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

  validateStatusForGroup(conf);
  processLogos(conf);
}

function processLogos(conf) {
  // Primarily include the W3C logo and license for W3C Recommendation track
  // that have an actual working group.
  const { specStatus, wg } = conf;
  const isWgStatus = [
    ...recTrackStatus,
    ...registryTrackStatus,
    ...W3CNotes,
    ...tagStatus,
    "ED",
  ].includes(specStatus);
  const inWorkingGroup = wg && wg.length && isWgStatus;
  // Member submissions don't need to be in a Working Group.
  const doesNotNeedWG = ["Member-SUBM"].includes(specStatus);
  const canShowW3CLogo = inWorkingGroup || doesNotNeedWG;
  if (canShowW3CLogo) {
    conf.logos.unshift(w3cLogo);
    if (specStatus === "Member-SUBM") {
      conf.logos.push(memSubmissionLogo);
    }
  }
}

function validateStatusForGroup(conf) {
  const { specStatus, groupType, group } = conf;

  if (!specStatus) {
    const msg = docLink`The ${"[specStatus]"} configuration option is required.`;
    const hint = docLink`Select an appropriate status from ${"[specStatus]"} based on your W3C group. If in doubt, use \`"unofficial"\`.`;
    showError(msg, name, { hint });
    conf.specStatus = "base";
    return;
  }

  if (status2text[specStatus] === undefined) {
    const msg = docLink`The ${"[specStatus]"} "\`${specStatus}\`" is not supported at for this type of document.`;
    const choices = codedJoinOr(Object.keys(status2text), { quotes: true });
    const hint = docLink`set ${"[specStatus]"} to one of: ${choices}.`;
    showError(msg, name, { hint });
    conf.specStatus = "base";
    return;
  }

  switch (groupType) {
    case "cg": {
      if (![...cgStatus, "unofficial", "UD"].includes(specStatus)) {
        const msg = docLink`W3C Community Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const supportedStatus = codedJoinOr(cgStatus, { quotes: true });
        const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"CG-DRAFT"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "CG-DRAFT";
      }
      break;
    }
    case "bg": {
      if (![...bgStatus, "unofficial", "UD"].includes(specStatus)) {
        const msg = docLink`W3C Business Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const supportedStatus = codedJoinOr(bgStatus, { quotes: true });
        const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"BG-DRAFT"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "BG-DRAFT";
      }
      break;
    }
    case "wg": {
      if (![...trStatus, "unofficial", "UD", "ED"].includes(specStatus)) {
        const msg = docLink`W3C Working Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const hint = docLink`Pleas see ${"[specStatus]"} for appropriate status for W3C Working Group documents.`;
        showError(msg, name, { hint });
      }
      break;
    }
    case "other":
      if (
        group === "tag" &&
        !["ED", ...trStatus, ...tagStatus].includes(specStatus)
      ) {
        const msg = docLink`The W3C Technical Architecture Group's documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
        const supportedStatus = codedJoinOr(["ED", ...trStatus, ...tagStatus], {
          quotes: true,
        });
        const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"unofficial"\`.`;
        showError(msg, name, { hint });
        conf.specStatus = "unofficial";
      }
      break;
    default:
      if (
        !conf.wgId &&
        !["unofficial", "base", "UD", "Member-SUBM"].includes(conf.specStatus)
      ) {
        const msg =
          "Document is not associated with a [W3C group](https://respec.org/w3c/groups/). Defaulting to 'base' status.";
        const hint = docLink`Use the ${"[group]"} configuration option to associated this document with a W3C group.`;
        conf.specStatus = "base";
        showError(msg, name, { hint });
      }
  }
}
