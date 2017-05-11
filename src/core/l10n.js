/**
 * Module core/l10n
 *
 * Looks at the lang attribute on the root element and uses it
 * to manage the config.l10n object so that other parts of the system can
 * localize their text.
 */
// We use en-US as the base
const base = {
  abstract: "Abstract",
  author: "Author:",
  authors: "Authors:",
  bug_tracker: "Bug tracker:",
  close_parens: ")",
  commit_history: "Commit history",
  editor: "Editor:",
  editors_note: "Editor's note",
  editors: "Editors:",
  example: "Example",
  fig: "Fig. ",
  file_a_bug: "File a bug",
  info_references: "Informative references",
  issue_summary: "Issue Summary",
  issue: "Issue",
  latest_editors_draft: "Latest editor's draft:",
  latest_published_version: "Latest published version:",
  norm_references: "Normative references",
  note: "Note",
  open_bugs: "open bugs",
  open_parens: "(",
  participate: "Participate",
  references: "References",
  sotd: "Status of This Document",
  table_of_fig: "Table of Figures",
  this_version: "This version:",
  toc: "Table of Contents",
  warning: "Warning",
};

const ko = {
  abstract: "요약",
  author: "저자:",
  authors: "저자:",
  fig: "그림 ",
  latest_published_version: "최신 버전:",
  sotd: "현재 문서의 상태",
  this_version: "현재 버전:",
};

const zh = {
  abstract: "摘要",
  bug_tracker: "错误跟踪：",
  editor: "编辑：",
  editors: "编辑们：",
  fig: "圖",
  file_a_bug: "反馈错误",
  latest_editors_draft: "最新编辑草稿：",
  latest_published_version: "最新发布草稿：",
  note: "注",
  open_bugs: "修正中的错误",
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
  fig: "図",
  latest_editors_draft: "最新の編集用草案：",
  latest_published_version: "最新バージョン：",
  note: "注",
  open_bugs: "改修されていないバグ",
  sotd: "この文書の位置付け",
  this_version: "このバージョン：",
  toc: "目次",
};

const nl = {
  abstract: "Samenvatting",
  author: "Auteur:",
  authors: "Auteurs:",
  bug_tracker: "Meldingensysteem:",
  editor: "Redacteur:",
  editors_note: "Redactionele noot",
  editors: "Redacteurs:",
  example: "Voorbeeld",
  fig: "Figuur ",
  file_a_bug: "Dien een melding in",
  info_references: "Informatieve referenties",
  issue_summary: "Lijst met issues",
  latest_editors_draft: "Laatste werkversie:",
  latest_published_version: "Laatst gepubliceerde versie:",
  norm_references: "Normatieve referenties",
  note: "Noot",
  open_bugs: "open meldingen",
  references: "Referenties",
  sotd: "Status van dit document",
  table_of_fig: "Lijst met figuren",
  this_version: "Deze versie:",
  toc: "Inhoudsopgave",
  warning: "Waarschuwing",
};

export const l10n = {
  en: Object.assign({}, base),
  ko: Object.assign({}, base, ko),
  zh: Object.assign({}, base, ko),
  ja: Object.assign({}, base, ja),
  nl: Object.assign({}, base, nl),
};

l10n["zh-hans"] = l10n.zh;
l10n["zh-cn"] = l10n.zh;

const lang = document.documentElement.lang || "en";

export function run(config) {
  config.l10n = l10n[lang] || l10n.en;
}
