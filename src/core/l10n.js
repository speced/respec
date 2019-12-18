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
  author: "Author:",
  authors: "Authors:",
  bug_tracker: "Bug tracker:",
  close_parens: ")",
  definition_list: "Definitions",
  editor: "Editor:",
  editors_note: "Editor's note",
  editors: "Editors:",
  feature_at_risk: "(Feature at Risk) Issue",
  former_editor: "Former editor:",
  former_editors: "Former editors:",
  info_references: "Informative references",
  issue_summary: "Issue Summary",
  issue: "Issue",
  latest_editors_draft: "Latest editor's draft:",
  latest_published_version: "Latest published version:",
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
  sotd: "Status of This Document",
  this_version: "This version:",
  toc: "Table of Contents",
  warning: "Warning",
};

const ko = {
  abstract: "요약",
  author: "저자:",
  authors: "저자:",
  latest_published_version: "최신 버전:",
  sotd: "현재 문서의 상태",
  this_version: "현재 버전:",
};

const zh = {
  about_respec: "关于",
  abstract: "摘要",
  bug_tracker: "错误跟踪：",
  editor: "编辑：",
  editors: "编辑：",
  file_a_bug: "反馈错误",
  former_editor: "原编辑：",
  former_editors: "原编辑：",
  latest_editors_draft: "最新编辑草稿：",
  latest_published_version: "最新发布版本：",
  note: "注",
  open_bugs: "修正中的错误",
  participate: "参与：",
  sotd: "关于本文档",
  this_version: "本版本：",
  toc: "内容大纲",
};

const ja = {
  abstract: "要約",
  author: "著者：",
  authors: "著者：",
  bug_tracker: "バグの追跡履歴：",
  editor: "編者：",
  editors: "編者：",
  file_a_bug: "問題報告",
  former_editor: "以前の版の編者：",
  former_editors: "以前の版の編者：",
  latest_editors_draft: "最新の編集用草案：",
  latest_published_version: "最新バージョン：",
  note: "注",
  open_bugs: "改修されていないバグ",
  participate: "参加方法：",
  sotd: "この文書の位置付け",
  this_version: "このバージョン：",
  toc: "目次",
};

const nl = {
  about_respec: "Over",
  abstract: "Samenvatting",
  author: "Auteur:",
  authors: "Auteurs:",
  bug_tracker: "Meldingensysteem:",
  definition_list: "Lijst van Definities",
  editor: "Redacteur:",
  editors_note: "Redactionele noot",
  editors: "Redacteurs:",
  file_a_bug: "Dien een melding in",
  info_references: "Informatieve referenties",
  issue_summary: "Lijst met issues",
  latest_editors_draft: "Laatste werkversie:",
  latest_published_version: "Laatst gepubliceerde versie:",
  list_of_definitions: "Lijst van Definities",
  norm_references: "Normatieve referenties",
  note: "Noot",
  open_bugs: "open meldingen",
  participate: "Doe mee",
  references: "Referenties",
  save_as: "Bewaar als",
  save_snapshot: "Bewaar Snapshot",
  search_specref: "Doorzoek Specref",
  sotd: "Status van dit document",
  this_version: "Deze versie:",
  toc: "Inhoudsopgave",
  warning: "Waarschuwing",
};

const es = {
  abstract: "Resumen",
  author: "Autor:",
  authors: "Autores:",
  bug_tracker: "Repositorio de bugs:",
  close_parens: ")",
  editor: "Editor:",
  editors_note: "Nota de editor",
  editors: "Editores:",
  file_a_bug: "Nota un bug",
  info_references: "Referencias informativas",
  issue_summary: "Resumen de la cuestión",
  issue: "Cuestión",
  latest_editors_draft: "Borrador de editor mas reciente:",
  latest_published_version: "Versión publicada mas reciente:",
  norm_references: "Referencias normativas",
  note: "Nota",
  open_bugs: "Bugs abiertos",
  open_parens: "(",
  participate: "Participad",
  references: "Referencias",
  sotd: "Estado de este Document",
  this_version: "Ésta versión:",
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
