// @ts-check

import { pub } from "../core/pubsubhub.js";

/**
 * this module fixes some peculiarities in core/github for the Dutch context
 *
 */
export const name = "logius/github";

export function run(conf) {

  if (!conf.nl_github) {
    pub("warn", "respecConfig.nl_github not set"); 
    return;
  }
  // override respec github settings if present
  conf.otherLinks
    .filter(item => item.key === "Doe mee") // todo: using the Dutch expression as a filter
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
            };
            break;
          case "Pull requests":
            if (conf.nl_github.pullrequests) {
              element.href = conf.nl_github.pullrequests;
            };
            break;
        }
      });
    });

  if (conf.nl_github.issueBase) {
    conf.issueBase = conf.nl_github.issueBase;
  }
  // todo: check if this is correct
  if (conf.nl_github.revision) {
    conf.github.branch = conf.nl_github.revision;
  }

}
