
// Module core/best-practices
// Handles the marking up of best practices, and can generate a summary of all of them.
// The summary is generated if there is a section in the document with ID bp-summary.
// Best practices are marked up with span.practicelab.

define(
    ["text!core/css/bp.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/best-practices");
                var num = 0
                ,   $bps = $("span.practicelab", doc)
                ,   $content = $("<div><h2>Best Practices Summary</h2><ul></ul></div>")
                ,   $ul = $content.find("ul")
                ;
                $bps.each(function () {
                    var $bp = $(this), id = $bp.makeID("bp"), $li = $("<li><a></a></li>"), $a = $li.find("a");
                    num++;
                    $a.attr("href", "#" + id).text("Best Practice " + num);
                    $li.append(doc.createTextNode(": " + $bp.text()));
                    $ul.append($li);
                    $bp.prepend(doc.createTextNode("Best Practice " + num + ": "));
                });
                if ($bps.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    if ($("#bp-summary")) $("#bp-summary").append($content.contents());
                }
                else if ($("#bp-summary").length) {
                    msg.pub("warn", "Using best practices summary (#bp-summary) but no best practices found.");
                    $("#bp-summary").remove();
                }

                msg.pub("end", "core/best-practices");
                cb();
            }
        };
    }
);
