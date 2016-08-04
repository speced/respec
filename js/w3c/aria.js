// Module w3c/aria
// Adds wai-aria landmarks and roles to entire document.
// Introduced by Shane McCarron (shane@aptest.com) from the W3C PFWG

define(
    ["core/utils"], // load this to be sure that the jQuery extensions are loaded
    function (utils) {
        return {
            run:    function (conf, doc, cb) {
                // ensure head section is labelled
                $('body', doc).attr('role', 'document') ;
                $('body', doc).attr('id', 'respecDocument') ;
                $('div.head', doc).attr('role', 'contentinfo') ;
                $('div.head', doc).attr('id', 'respecHeader') ;
                if (!conf.noTOC) {
                    // ensure toc is labeled
                    var toc = doc.querySelector('#toc ol:first-of-type');
                    toc.setAttribute('role', 'directory') ;
                }
                // mark issues and notes with heading
                var noteCount = 0 ; var issueCount = 0 ; var ednoteCount = 0;
                $(".note-title, .ednote-title, .issue-title", doc).each(function (i, item) {
                    var $item = $(item)
                    ,   isIssue = $item.hasClass("issue-title")
                    ,   isEdNote = $item.hasClass("ednote-title")
                    ,   level = $item.parents("section").length+2 ;

                    $item.attr('aria-level', level) ;
                    $item.attr('role', 'heading') ;
                    if (isIssue) {
                        issueCount++;
                        $item.makeID('h', "issue" + issueCount) ;
                    } else if (isEdNote) {
                        ednoteCount++;
                        $item.makeID('h', "ednote" + ednoteCount) ;
                    } else {
                        noteCount++;
                        $item.makeID('h', "note" + noteCount) ;
                    }
                });
                cb();
            }
        };
    }
);
