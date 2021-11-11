// @ts-check

import { showWarning } from "../core/utils.js";
/**
 * this module fixes some peculiarities in core/github for the Dutch context
 *
 */
export const name = "logius/github";

export function run(conf) {
  if (!conf.nl_github) {
    const msg = "respecConfig.nl_github not set. Using";
    const hint =
      "add nl_github: { issuebase: ..., revision: ..., pullrequests: ... }";
    showWarning(msg, name, { hint });
    return;
  }
  // pieter added: override respec github settings if present
  // this fix is very stupid, but do not know a better alternative

  if (conf.nl_github.issueBase) {
    if (!conf.nl_github.issueBase.endsWith("/")) {
      conf.nl_github.issueBase += "/";
    }
  }
  if (conf.nl_github.issueBase) {
    if (!conf.nl_github.issueBase.endsWith("/")) {
      conf.nl_github.issueBase += "/";
    }
    conf.otherLinks[0].data[1].href = conf.nl_github.issueBase;
    conf.issueBase = conf.nl_github.issueBase;
  }
  if (conf.nl_github.revision) {
    if (!conf.nl_github.revision.endsWith("/")) {
      conf.nl_github.revision += "/";
    }
    conf.otherLinks[0].data[2].href = conf.nl_github.revision;
  }
  if (conf.nl_github.pullrequests) {
    if (!conf.nl_github.pullrequests.endsWith("/")) {
      conf.nl_github.pullrequests += "/";
    }
    conf.otherLinks[0].data[3].href = conf.nl_github.pullrequests;
  }

  // todo: check if this is correct
  if (conf.nl_github.revision) {
    conf.github.branch = conf.nl_github.revision;
  }
}
