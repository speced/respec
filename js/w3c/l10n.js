
// Module w3c/l10n
// Looks at the lang attribute on the root element and uses it to manage the config.l10n object so
// that other parts of the system can localise their text

define(
    [],
    function () {
        var l10n = {
            en: {
                    this_version:               "This version:"
                ,   latest_published_version:   "Latest published version:"
                ,   latest_editors_draft:       "Latest editor's draft:"
                ,   editor:                     "Editor:"
                ,   editors:                    "Editors:"
                ,   author:                     "Author:"
                ,   authors:                    "Authors:"
                ,   abstract:                   "Abstract"
                ,   sotd:                       "Status of This Document"
                ,   status_at_publication:      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/."
                ,   toc:                        "Table of Contents"
                ,   note:                       "Note"
                ,   fig:                        "Fig. "
                ,   bug_tracker:                "Bug tracker:"
                ,   file_a_bug:                 "file a bug"
                ,   open_bugs:                  "open bugs"
                ,   open_parens:                "("
                ,   close_parens:               ")"
            }
            ,   ko: {
                    this_version:               "현재 버전:"
                ,   latest_published_version:   "최신 버전:"
                ,   latest_editors_draft:       "Latest editor's draft:"
                ,   editor:                     "Editor:"
                ,   editors:                    "Editors:"
                ,   author:                     "저자:"
                ,   authors:                    "저자:"
                ,   abstract:                   "요약"
                ,   sotd:                       "현재 문서의 상태"
                ,   status_at_publication:      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/."
                ,   toc:                        "Table of Contents"
                ,   note:                       "Note"
                ,   fig:                        "그림 "
                ,   bug_tracker:                "Bug tracker:"
                ,   file_a_bug:                 "file a bug"
                ,   open_bugs:                  "open bugs"
                ,   open_parens:                "("
                ,   close_parens:               ")"
            }
            ,   zh: {
                    this_version:               "本版本："
                ,   latest_published_version:   "最新发布草稿："
                ,   latest_editors_draft:       "最新编辑草稿："
                ,   editor:                     "编辑："
                ,   editors:                    "编辑们："
                ,   author:                     "Author:"
                ,   authors:                    "Authors:"
                ,   abstract:                   "摘要"
                ,   sotd:                       "关于本文档"
                ,   status_at_publication:      "本章节描述了本文档的发布状态。其它更新版本可能会覆盖本文档。W3C的文档列 表和最新版本可通过<a href='https://www.w3.org/TR/'>W3C技术报告</a>索引访问。"
                ,   toc:                        "内容大纲"
                ,   note:                       "注"
                ,   fig:                        "圖"
                ,   bug_tracker:                "错误跟踪："
                ,   file_a_bug:                 "反馈错误"
                ,   open_bugs:                  "修正中的错误"
                ,   open_parens:                "（"
                ,   close_parens:               "）"
            }
        };
        l10n["zh-hans"] = l10n.zh;
        l10n["zh-cn"] = l10n.zh;

        return {
            run:    function (config, doc, cb) {
                var lang = $(doc.documentElement).attr("lang") || "en";
                config.l10n = l10n[lang] ? l10n[lang] : l10n.en;
                cb();
            }
        };
    }
);
