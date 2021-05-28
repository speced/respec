// @ts-check
export const name = "core/templates/show-translations";

import { html } from "../../core/import-maps.js";

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
const languages = new Map([
  ["de", "Deutsch"],
  ["en", "English"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["ru", "ру́сский"],
  ["zh", "中文"],
]);

/**
 * @param {Record<string, string>} translations
 */
export default function showTranslations(translations) {
  return Object.entries(translations).map(([lang, url]) => {
    return html`<dd><a href="${url}">${languages.get(lang) || lang}</a></dd>`;
  });
}
