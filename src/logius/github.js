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
  conf.otherLinks
    .filter(item => item.key === "Doe mee:" || item.key === "Participate:") // todo: using the Dutch expression as a filter
    .forEach(element => {
      element.data.forEach(element => {
        switch (element.value) {
          case "Dien een melding in":
            if (conf.nl_github.issueBase) {
              element.href = conf.nl_github.issueBase;
            }
            break;
          case "Revisiehistorie":
            if (conf.nl_github.revision) {
              element.href = conf.nl_github.revision;
            }
            break;
          case "Pull requests":
            if (conf.nl_github.pullrequests) {
              element.href = conf.nl_github.pullrequests;
            }
            break;
        }
      });
    });

  if (conf.nl_github.issueBase) {
    if (!conf.nl_github.issueBase.endsWith("/")) {
      conf.nl_github.issueBase += "/";
    }
    conf.issueBase = conf.nl_github.issueBase;
  }
  // todo: check if this is correct
  if (conf.nl_github.revision) {
    conf.github.branch = conf.nl_github.revision;
  }
}
