// @ts-check
/**
 * Sets the defaults for W3C specs
 */
export const name = "w3c/defaults";
import {
  W3CNotes,
  bgStatus,
  cgRedesignStatus,
  cgStatus,
  recTrackStatus,
  registryTrackStatus,
  status2text,
  tagStatus,
  trStatus,
} from "./headers.js";
import { codedJoinOr, docLink, showError } from "../core/utils.js";
import { coreDefaults, normalizeNoTOC } from "../core/defaults.js";

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

/**
 * @param {Conf} conf
 */
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

  normalizeNoTOC(conf);
  if (conf.specStatus !== "unofficial" && !conf.hasOwnProperty("license")) {
    conf.license = "w3c-software-doc";
  }

  validateStatusForGroup(conf);
  validateCGMaturity(conf);
  processLogos(/** @type {NormalizedConf} */ (conf));
}

/**
 * @param {NormalizedConf} conf
 */
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

const CG_MATURITIES = ["draft", "transferred", "unmaintained"];

/**
 * The maturity stage of a CG specification, which is a separate axis from its
 * status: either of the two redesign statuses can be at any of the three
 * stages, and the stage changes the markup rather than a value.
 *
 * @param {Conf} conf
 */
function validateCGMaturity(conf) {
  // Silently irrelevant elsewhere: nothing about a document that is not one of
  // these two statuses should change because this option exists.
  if (!cgRedesignStatus.includes(conf.specStatus ?? "")) return;

  if (conf.cgMaturity === undefined) {
    conf.cgMaturity = "draft";
  } else if (!CG_MATURITIES.includes(conf.cgMaturity)) {
    const choices = codedJoinOr(CG_MATURITIES, { quotes: true });
    const msg = docLink`\`"${conf.cgMaturity}"\` is not a supported value for the ${"[cgMaturity]"} configuration option.`;
    const hint = `Please use one of: ${choices}. Automatically falling back to \`"draft"\`.`;
    showError(msg, name, { hint });
    conf.cgMaturity = "draft";
  }

  validateTransferredTo(conf);
}

/**
 * @param {Conf["transferredTo"]} to
 */
function organizationName(to) {
  if (typeof to === "string") return to.trim();
  if (to && typeof to === "object" && typeof to.name === "string") {
    return to.name.trim();
  }
  return "";
}

/**
 * A transferred specification must say who took the work up.
 *
 * @param {Conf} conf
 */
function validateTransferredTo(conf) {
  if (conf.cgMaturity !== "transferred") return;
  if (organizationName(conf.transferredTo)) return;

  const msg = conf.transferredTo
    ? docLink`The ${"[transferredTo]"} configuration option needs the name of an organization.`
    : docLink`The ${"[transferredTo]"} configuration option is required when ${"[cgMaturity]"} is \`"transferred"\`.`;
  const hint = docLink`Set ${"[transferredTo]"} to the organization that has taken the work up: a name, or \`{ name, url }\`. Until it is set, the notice reads "Another organization".`;
  showError(msg, name, { hint });
  delete conf.transferredTo;
}

/**
 * @param {Conf} conf
 */
function validateStatusForGroup(conf) {
  const { specStatus, groupType, group } = conf;

  if (!specStatus) {
    const msg = docLink`The ${"[specStatus]"} configuration option is required.`;
    const hint = docLink`Select an appropriate status from ${"[specStatus]"} based on your W3C group. If in doubt, use \`"unofficial"\`.`;
    showError(msg, name, { hint });
    conf.specStatus = "base";
    return;
  }

  if (
    /** @type {Record<string, string>} */ (status2text)[specStatus] ===
    undefined
  ) {
    const msg = docLink`The ${"[specStatus]"} "\`${specStatus}\`" is not supported at for this type of document.`;
    const choices = codedJoinOr(Object.keys(status2text), { quotes: true });
    const hint = docLink`set ${"[specStatus]"} to one of: ${choices}.`;
    showError(msg, name, { hint });
    conf.specStatus = "base";
    return;
  }

  switch (groupType) {
    case "cg": {
      if (
        ![...cgStatus, ...cgRedesignStatus, "unofficial", "UD"].includes(
          specStatus
        )
      ) {
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
        !["unofficial", "base", "UD", "Member-SUBM"].includes(specStatus)
      ) {
        const msg =
          "Document is not associated with a [W3C group](https://respec.org/w3c/groups/). Defaulting to 'base' status.";
        const hint = docLink`Use the ${"[group]"} configuration option to associated this document with a W3C group.`;
        conf.specStatus = "base";
        showError(msg, name, { hint });
      }
  }
}
