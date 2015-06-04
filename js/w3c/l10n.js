
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
                ,   abstract:                   "Abstract"
                ,   sotd:                       "Status of This Document"
                ,   status_at_publication:      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='http://www.w3.org/TR/'>W3C technical reports index</a> at http://www.w3.org/TR/."
                ,   toc:                        "Table of Contents"
                ,   note:                       "Note"
                ,   fig:                        "Fig. "
            }
            ,   zh: {
                    this_version:               "本版本："
                ,   latest_published_version:   "最新发布草稿："
                ,   latest_editors_draft:       "最新编辑草稿："
                ,   editor:                     "编辑："
                ,   editors:                    "编辑："
                ,   abstract:                   "摘要"
                ,   sotd:                       "关于本文档"
                ,   status_at_publication:      "本章节描述了本文档的发布状态。其它更新版本可能会覆盖本文档。W3C的文档列 表和最新版本可通过W3C技术报告索引访问。"
                ,   toc:                        "内容大纲"
                ,   note:                       "注"
                ,   fig:                        "圖"
            }
        };
        l10n["zh-hans"] = l10n.zh;
        l10n["zh-cn"] = l10n.zh;
        
        return {
            run:    function (config, doc, cb, msg) {
                msg.pub("start", "w3c/l10n");
                var lang = $(doc.documentElement).attr("lang") || "en";
                config.l10n = l10n[lang] ? l10n[lang] : l10n.en;
                msg.pub("end", "w3c/l10n");
                cb();
            }
        };
    }
);
