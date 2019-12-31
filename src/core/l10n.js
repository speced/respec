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
  about_respec: "About",
  abstract: "Abstract",
  bug_tracker: "Bug tracker:",
  close_parens: ")",
  definition_list: "Definitions",
  editors_note: "Editor's note",
  feature_at_risk: "(Feature at Risk) Issue",
  info_references: "Informative references",
  issue_summary: "Issue Summary",
  issue: "Issue",
  list_of_definitions: "List of Definitions",
  norm_references: "Normative references",
  note: "Note",
  open_bugs: "open bugs",
  open_parens: "(",
  participate: "Participate",
  references: "References",
  save_as: "Save as",
  save_snapshot: "Export",
  search_specref: "Search Specref",
  toc: "Table of Contents",
  warning: "Warning",
};

const ko = {
  abstract: "요약",
};

const zh = {
  about_respec: "关于",
  abstract: "摘要",
  bug_tracker: "错误跟踪：",
  file_a_bug: "反馈错误",
  note: "注",
  open_bugs: "修正中的错误",
  participate: "参与：",
  toc: "内容大纲",
};

const ja = {
  abstract: "要約",
  bug_tracker: "バグの追跡履歴：",
  file_a_bug: "問題報告",
  note: "注",
  open_bugs: "改修されていないバグ",
  participate: "参加方法：",
  toc: "目次",
};

const nl = {
  about_respec: "Over",
  abstract: "Samenvatting",
  bug_tracker: "Meldingensysteem:",
  definition_list: "Lijst van Definities",
  editors_note: "Redactionele noot",
  file_a_bug: "Dien een melding in",
  info_references: "Informatieve referenties",
  issue_summary: "Lijst met issues",
  list_of_definitions: "Lijst van Definities",
  norm_references: "Normatieve referenties",
  note: "Noot",
  open_bugs: "open meldingen",
  participate: "Doe mee",
  references: "Referenties",
  save_as: "Bewaar als",
  save_snapshot: "Bewaar Snapshot",
  search_specref: "Doorzoek Specref",
  toc: "Inhoudsopgave",
  warning: "Waarschuwing",
};

const es = {
  abstract: "Resumen",
  authors: "Autores:",
  bug_tracker: "Repositorio de bugs:",
  close_parens: ")",
  editors_note: "Nota de editor",
  file_a_bug: "Nota un bug",
  info_references: "Referencias informativas",
  issue_summary: "Resumen de la cuestión",
  issue: "Cuestión",
  norm_references: "Referencias normativas",
  note: "Nota",
  open_bugs: "Bugs abiertos",
  open_parens: "(",
  participate: "Participad",
  references: "Referencias",
  toc: "Tabla de Contenidos",
  warning: "Aviso",
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
