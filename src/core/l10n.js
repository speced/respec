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

// We use en-US as the base
const base = {
  bug_tracker: "Bug tracker:",
  close_parens: ")",
  open_bugs: "open bugs",
  open_parens: "(",
  save_as: "Save as",
};

const ko = {};

const zh = {
  bug_tracker: "错误跟踪：",
  open_bugs: "修正中的错误",
};

const ja = {
  bug_tracker: "バグの追跡履歴：",
  open_bugs: "改修されていないバグ",
};

const nl = {
  bug_tracker: "Meldingensysteem:",
  open_bugs: "open meldingen",
  save_as: "Bewaar als",
};

const es = {
  authors: "Autores:",
  bug_tracker: "Repositorio de bugs:",
  close_parens: ")",
  open_bugs: "Bugs abiertos",
  open_parens: "(",
};

export const l10n = {
  en: { ...base },
  ko: { ...base, ...ko },
  zh: { ...base, ...zh },
  ja: { ...base, ...ja },
  nl: { ...base, ...nl },
  es: { ...base, ...es },
};

l10n["zh-hans"] = l10n.zh;
l10n["zh-cn"] = l10n.zh;

export const lang = html && html.lang in l10n ? html.lang : "en";

export function run(config) {
  config.l10n = l10n[lang] || l10n.en;
}
