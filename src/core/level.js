/**
 * This module updates the title and shortName
 * of a spec when there is a valid level configuration.
 *
 * Levels should be integers >= 0.
 */

import { getIntlData, showInlineWarning } from "./utils.js";
export const name = "core/level";

const localizationStrings = {
  en: {
    level: "Level",
  },
};

const l10n = getIntlData(localizationStrings);

export function run(conf) {
  const h1Elem = document.querySelector("h1#title");

  if (conf.hasOwnProperty("level")) {
    if (Number.isInteger(conf.level) && conf.level >= 0) {
      h1Elem.append(document.createTextNode(` ${l10n.level} ${conf.level}`));
      document.title = `${document.title} ${l10n.level} ${conf.level}`;
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
