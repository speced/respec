// @ts-check
export const name = "core/translations";

import { getIntlData } from "./utils.js";
import { html } from "./import-maps.js";

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
const languages = new Map([
  ["de", "Deutsch"],
  ["en", "English"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["ru", "ру́сский"],
  ["zh", "中文"],
]);

const localizationStrings = {
  en: {
    title: "Translations:",
  },
};
const l10n = getIntlData(localizationStrings);

/**
 * @param {Conf} conf
 */
export function run(conf) {
  if (!conf.translations) return;
  const translations = getNormalizedConfig(conf.translations);

  document.head.append(...getAlternateLinks(translations));

  return Object.entries(conf.translations).map(([lang, url]) => {
    return html`<dd><a href="${url}">${languages.get(lang) || lang}</a></dd>`;
  });
}

/**
 * @param {Translations} translations
 */
function getHeaderLinks(translations) {
  return translations.map(({ lang, url, isValid }) => {
    const text = languages.get(lang) || lang;
    const langtag = isValid ? lang : null;
    return html`<dd>
      <a href="${url}" hreflang="${langtag}" lang="${langtag}">${text}</a>
    </dd>`;
  });
}

/**
 * @param {Translations} translations
 */
function getAlternateLinks(translations) {
  return translations
    .filter(({ isValid }) => isValid)
    .map(({ lang, url }) => {
      return html`<link rel="alternate" href="${url}" hreflang="${lang}" />`;
    });
}

/**
 * @param {Required<Conf["translations"]>} translations
 * @typedef {ReturnType<typeof getNormalizedConfig>} Translations
 */
function getNormalizedConfig(translations) {
  return Object.entries(translations).map(([lang, url]) => {
    return { lang, url, isValid: isValidLang(lang) };
  });
}

/**
 * Check if kinda matches syntax of BCP47 (RFC-5646). Full validation will bloat
 * the code. This implementation treats following as valid:
 * - 2-3 letter language subtag, in lower case,
 * - (optionally) after a `-`, 2-letter (uppercase) or 3-digit language subtag.
 * @example "es", "bdz", "es-ES", "es-103" are valid tags.
 * @param {string} lang
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
 */
function isValidLang(lang) {
  const [languageSubtag, regionSubtag] = lang.split("-", 2);
  return (
    /^[a-z]{2,3}$/.test(languageSubtag) &&
    (!regionSubtag ||
      /^[A-Z]{2}$/.test(regionSubtag) ||
      /^[0-9]{3}$/.test(regionSubtag))
  );
}
