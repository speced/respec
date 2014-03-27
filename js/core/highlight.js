
// Module core/highlight
// Does syntax highlighting to all pre and code that have a class of "highlight"

// A potential improvement would be to call cb() immediately and benefit from the asynchronous
// ability of prettyPrint() (but only call msg.pub() in the callback to remain accurate as to
// the end of processing)

define(
    ["text!core/css/highlight.css", "google-code-prettify"],
    function (css, PR) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/highlight");
                
                // fix old classes
                var oldies = "sh_css sh_html sh_javascript sh_javascript_dom sh_xml".split(" ");
                for (var i = 0, n = oldies.length; i < n; i++) {
                    var old = oldies[i];
                    $("." + old).each(function () {
                        $(this).removeClass(old).addClass("highlight");
                        msg.pub("warn", "Old highlighting class '" + old + "', use 'highlight' instead.");
                    });
                }
                
                // prettify
                var $highs = $("pre.highlight, code.highlight")
                ,   done = function () {
                        msg.pub("end", "core/highlight");
                        cb();
                    }
                ;
                if ($highs.length) {
                    if (!conf.noHighlightCSS) {
                        $(doc).find("head link").first().before($("<style/>").text(css));
                    }
                    $highs.addClass("prettyprint");
                    PR.prettyPrint(done);
                }
                else {
                    done();
                }
            }
        };
    }
);
