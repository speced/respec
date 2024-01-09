/**
 * This module updates the title and shortName
 * of a spec when there is a valid level configuration.
 *
 * Levels should be integers >= 0.
 *
 * @module w3c/level
 */

import { getIntlData, showError } from "../core/utils.js";
export const name = "w3c/level";
/** @type {LocalizationStrings} */
const localizationStrings = {
  en: {
    level: "Level",
  },
  ja: {
    level: "レベル",
  },
  nl: {
    level: "Niveau",
  },
  de: {
    level: "Stufe",
  },
  zh: {
    level: "级别",
  },
};

const l10n = getIntlData(localizationStrings);

/**
 * Updates the title and shortName of a spec based on the level configuration.
 *
 * @param {Conf} conf - The configuration object.
 */
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
