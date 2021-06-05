/**
 * This module updates the title and shortName
 * of a spec when there is a valid level configuration.
 *
 * Levels should be integers >= 0.
 */

import { getIntlData, showError } from "../core/utils.js";
export const name = "w3c/level";

const localizationStrings = {
  en: {
    level: "Level",
  },
};

const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.hasOwnProperty("level")) return;

  const h1Elem = document.querySelector("h1#title");

  const level = parseInt(conf.level);
  if (!Number.isInteger(level) || level < 0) {
    const msg = `The \`level\` configuration option must be a number greater or equal to 0. It is currently set to \`${level}\``;
    const title = "Invalid level config.";
    showError(msg, name, { title, elements: [h1Elem] });
    return;
  }

  h1Elem.append(` ${l10n.level} ${level}`);
  document.title = `${document.title} ${l10n.level} ${level}`;
  conf.shortName = `${conf.shortName}-${level}`;
  conf.level = level;
}
