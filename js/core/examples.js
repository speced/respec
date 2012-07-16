
// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

define(
    ["text!core/css/examples.css"],
    function (css) {
        var makeTitle = function ($el, num, report) {
            var txt = (num > 0) ? " " + num : ""
            ,   $tit = $("<div class='example-title'><span>Example" + txt + "</span></div>");
            report.title = $el.attr("title");
            if (report.title) {
                $tit.append($el[0].ownerDocument.createTextNode(": " + report.title));
                $el.removeAttr("title");
            }
            return $tit;
        };
        
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/examples");
                var $exes = $("pre.example, pre.illegal-example, aside.example")
                ,   num = 0
                ;
                if ($exes.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    $exes.each(function (i, ex) {
                        var $ex = $(ex)
                        ,   report = { number: num, illegal: $ex.hasClass("illegal-example") }
                        ;
                        if ($ex.is("aside")) {
                            num++;
                            var $tit = makeTitle($ex, num, report);
                            $ex.prepend($tit);
                            msg.pub("example", report);
                        }
                        else {
                            var inAside = !!$ex.parents("aside").length;
                            if (!inAside) num++;
                            // reindent
                            var lines = $ex.html().split("\n");
                            while (lines.length && /^\s*$/.test(lines[0])) lines.shift();
                            while (lines.length && /^\s*$/.test(lines[lines.length - 1])) lines.pop();
                            var matches = /^(\s+)/.exec(lines[0]);
                            if (matches) {
                                var rep = new RegExp("^" + matches[1]);
                                for (var j = 0; j < lines.length; j++) {
                                    lines[j] = lines[j].replace(rep, "");
                                }
                            }
                            report.content = lines.join("\n");
                            $ex.html(lines.join("\n"));
                            // wrap
                            var $div = $("<div class='example'></div>")
                            ,   $tit = makeTitle($ex, inAside ? 0 : num, report)
                            ;
                            $div.append($tit);
                            $div.append($ex.clone());
                            $ex.replaceWith($div);
                            if (!inAside) msg.pub("example", report);
                        }
                    });
                }
                msg.pub("end", "core/examples");
                cb();
            }
        };
    }
);
