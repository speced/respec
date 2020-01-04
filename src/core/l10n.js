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
  participate: "Participate",
  save_as: "Save as",
  toc: "Table of Contents",
};

const ko = {};

const zh = {
  bug_tracker: "错误跟踪：",
  file_a_bug: "反馈错误",
  open_bugs: "修正中的错误",
  participate: "参与：",
  toc: "内容大纲",
};

const ja = {
  bug_tracker: "バグの追跡履歴：",
  file_a_bug: "問題報告",
  open_bugs: "改修されていないバグ",
  participate: "参加方法：",
  toc: "目次",
};

const nl = {
  bug_tracker: "Meldingensysteem:",
  file_a_bug: "Dien een melding in",
  open_bugs: "open meldingen",
  participate: "Doe mee",
  save_as: "Bewaar als",
  toc: "Inhoudsopgave",
};

const es = {
  authors: "Autores:",
  bug_tracker: "Repositorio de bugs:",
  close_parens: ")",
  file_a_bug: "Nota un bug",
  open_bugs: "Bugs abiertos",
  open_parens: "(",
  participate: "Participad",
  toc: "Tabla de Contenidos",
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
