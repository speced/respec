// @ts-check
/**
 * Module core/l10n
 *
 * Looks at the lang attribute on the root element and uses it
 * to manage the config.l10n object so that other parts of the system can
 * localize their text.
 */
export const name = "core/l10n";

const html = document.documentElement;
if (html && !html.hasAttribute("lang")) {
  html.lang = "en";
  if (!html.hasAttribute("dir")) {
    html.dir = "ltr";
  }
}

export const l10n = {
  en: {},
  ko: {},
  zh: {},
  ja: {},
  nl: {},
  es: {},
};

l10n["zh-hans"] = l10n.zh;
l10n["zh-cn"] = l10n.zh;

export const lang = html && html.lang in l10n ? html.lang : "en";

/**
 * @template {Record<string, Record<string, string|Function>>} T
 * @param {T} localizationStrings
 * @returns {T[keyof T]}
 */
export function getIntlData(localizationStrings) {
  // Proxy return type is a known bug:
  // https://github.com/Microsoft/TypeScript/issues/20846
  // @ts-ignore
  return new Proxy(localizationStrings, {
    /** @param {string} key */
    get(data, key) {
      const result = data[lang][key] || data.en[key];
      if (!result) {
        throw new Error(`No l10n data for key: "${key}"`);
      }
      return result;
    },
  });
}

export function run(config) {
  config.l10n = l10n[lang] || l10n.en;
}
