/**
 * This module updates the title and shortName
 * of a spec when there is a valid level configuration.
 *
 * Levels should be integers >= 0.
 */

import { showInlineWarning } from "./utils.js";
export const name = "core/level";

export function run(conf) {
  const h1Elem = document.querySelector("h1#title");

  if (conf.hasOwnProperty("level")) {
    if (Number.isInteger(conf.level) && conf.level >= 0) {
      h1Elem.append(document.createTextNode(` Level ${conf.level}`));
      document.title = `${document.title} Level ${conf.level}`;
      conf.shortName = `${conf.shortName}-${conf.level}`;
    } else {
      showInlineWarning(
        h1Elem,
        `The \`level\` configuration option must be a number greater or equal to 0. It is currently set to \`${conf.level}\``,
        "Invalid level config."
      );
    }
  }
}
