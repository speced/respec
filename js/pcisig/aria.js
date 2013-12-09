// Module w3c/aria
// Adds wai-aria landmarks and roles to entire document.
// Introduced by Shane McCarron (shane@aptest.com) from the W3C PFWG

define(
    ["core/utils"], // load this to be sure that the jQuery extensions are loaded
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/aria");
                // ensure all headers after sections have
                // headings and aria-level
                var $secs = $("section", doc)
                                .find("h1:first, h2:first, h3:first, h4:first, h5:first, h6:first");
                $secs.each(function(i, item) {
                    var $item = $(item)
                    ,   resourceID = $item.parent('section[id]').attr('id')
                    ,   level = $item.parents("section").length ;

                    $item.attr('aria-level', level);
                    $item.attr('role', 'heading') ;
                    if (!$item.attr("id")) {
                        $item.attr('id', $item.prop('tagName').toLowerCase() + '_' + resourceID) ;
                    }
                });
                // ensure head section is labeled
                $('body', doc).attr('role', 'document') ;
                $('body', doc).attr('id', 'respecDocument') ;
                $('div.head', doc).attr('role', 'contentinfo') ;
                $('div.head', doc).attr('id', 'respecHeader') ;
                if (!conf.noTOC) {
                    // ensure Table of Contents (toc) is labeled
                    var toc = $('section#toc', doc)
                                  .find("ul:first");
                    toc.attr('role', 'directory') ;
                    if (!toc.attr("id")) {
                        toc.attr('id', 'respecContents') ;
                    }
                }
                if (!conf.TOF) {
                    // ensure Table of Figures (tof) is labeled
                    var toc = $('section#tof', doc)
                                  .find("ul:first");
                    toc.attr('role', 'directory') ;
                    if (!toc.attr("id")) {
                        toc.attr('id', 'respecContents') ;
                    }
                }
                if (!conf.TOT) {
                    // ensure Table of Tables (tot) is labeled
                    var toc = $('section#tot', doc)
                                  .find("ul:first");
                    toc.attr('role', 'directory') ;
                    if (!toc.attr("id")) {
                        toc.attr('id', 'respecContents') ;
                    }
                }
                // mark issues and notes with heading
                var noteNum = 0, issueNum = 0;
                $(".note-title, .issue-title", doc).each(function (i, item) {
                    var $item = $(item)
                    ,   isIssue = $item.hasClass("issue-title")
                    ,   level = $item.parents("section").length + 1 ;

                    $item.attr('aria-level', level);
                    $item.attr('role', 'heading') ;
                    if (isIssue) {
                        issueNum++;
                        $item.attr('id', 'h_issue_'+issueNum);
                    } else {
                        noteNum++;
                        $item.attr('id', 'h_note_'+noteNum);
                    }
                });
                msg.pub("end", "w3c/aria");
                cb();
            }
        };
    }
);
