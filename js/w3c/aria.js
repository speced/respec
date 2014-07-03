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
                // ensure head section is labelled
                $('body', doc).attr('role', 'document') ;
                $('body', doc).attr('id', 'respecDocument') ;
                var $head = $('div.head') ;
                $head.attr('role', 'contentinfo') ;
                $head.attr('id', 'respecHeader') ;
                if (!conf.noTOC) {
                    // ensure toc is labelled
                    var toc = $('section#toc', doc);
                    toc.attr('role', 'navigation') ;
                    toc = toc.find("ul:first");
                    toc.attr('role', 'directory') ;
                    if (!toc.attr("id")) {
                        toc.attr('id', 'respecContents') ;
                    }
                }
                // Search for terms and link them to their definitions
                // if possible
                //
                // dfn elements enclose a term, but the definition of
                // that term is in the surrounding element OR in a
                // subsequent dd element if the term is within a dt
                // element. aria-describedby is designed to help
                // users of assistive technologies find the actual
                // definition of a term (among other things).
                //
                $("dfn", doc).each( function(i, item) {
                    var $ant = $(item) ;
                    // if the item does not point to its description, see if we can find it
                    if ( !$ant.attr("aria-describedby") ) {
                        // the definition of a term should have a role of definition 
                        var $p = $ant.parent("dt") ;
                        if ($p.length) {
                            // The dfn is within a dt element.  Its
                            // definition is by convention in the next
                            // dd element.  Point to that.
                            var $t = $p.next("dd") ;
                            // if there is already an indication of
                            // its label, then don't change it
                            if ($t && !$t.attr("aria-labelledby")) {
                                $ant.attr("aria-describedby", $t.makeID("desc", $ant.attr('id').replace(/^dfn-/, ''))) ;
                                $t.attr('role', 'definition') ;
                                $t.attr("aria-labelledby", $ant.attr('id')) ;
                            }
                        }
                        else {
                            // we are not in a dt - we must be in *something*
                            // assume that the definition of the term
                            // is within the enclosing element and use
                            // that.
                            $p = $ant.parent() ;
                            // if there is already an indication of
                            // its label, then don't change it
                            if ($p && !$p.attr("aria-labelledby")) {
                                $ant.attr("aria-describedby", $p.makeID("desc", $ant.attr('id').replace(/^dfn-/, ''))) ;
                                $p.attr('role', 'definition') ;
                                $p.attr('aria-labelledby', $ant.attr('id')) ;
                            }
                        }
                    }
                });

                // annotate definition references with a
                // describedby and label
                $(".internalDFN", doc).each(function (i, item) {
                    var $item = $(item);
                    if (!$item.attr('aria-describedby')) {
                        var h = $item.attr('href') ;
                        var $d = $(h, doc);
                        if ($d && $d.attr('aria-describedby')) {
                            $item.attr('aria-describedby', $d.attr('aria-describedby'));
                        }
                    }
                    if (!$item.attr("aria-label") && !$item.attr("aria-labelledby")) {
                        var con = $item.text();
                        $item.attr("aria-label", "Definition: "+con) ;
                    }
                });

                // mark issues and notes with heading
                $(".note-title, .issue-title", doc).each(function (i, item) {
                    var $item = $(item)
                    ,   isIssue = $item.hasClass("issue-title")
                    ,   level = $item.parents("section").length + 1 ;

                    $item.attr('aria-level', level);
                    $item.attr('role', 'heading') ;
                    if (isIssue) {
                        $item.makeID("h-issue");
                    } 
                    else {
                        $item.makeID("h-note");
                    }
                });
                
                // mark notes with role of note
                $(".note", doc).each(function (i, item) {
                    var $item = $(item);
                    $item.attr('role', 'note');
                    $item.makeID("note");
                });
                
                // wrap content sections in a div with role main
                var $before = $head ;
                while ($before && $before.next("section").hasClass("introductory")) {
                    $before = $before.next("section");
                }
                if ($before) {
                    var $main = $before.next("section") ;
                    // skip the toc
                    if ($main.attr('id') == "toc") {
                        $before = $main ;
                    }
                    // create the container
                    var $con = $(doc.createElement("main")) ;
                    $con.attr('id', "respecMain");
                    $con.attr('role', 'main');
                    // move the main sections into this container
                    var done = 0;
                    var foundApp = 0;
                    $before.nextAll().each(function (i, item) {
                        var $t = $(item) ;
                        if (!done && $t.is("section") && $t.hasClass("appendix")) {
                            done = 1;
                            foundApp = 1;
                        } 
                        else if (!done) {
                            $con.append(item);
                        }
                    });
                    $before.after($con) ;
                    if (foundApp) {
                        var $app = $(doc.createElement("div"));
                        $app.attr('id', "respecAppendices");
                        $app.attr('role', 'complementary') ;
                        $con.nextAll().each(function (i, item) {
                            $app.append(item);
                        }) ;
                        $con.after($app) ;
                    }
                }
                msg.pub("end", "w3c/aria");
                cb();
            }
        };
    }
);
