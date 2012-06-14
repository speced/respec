
// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

define(
    ["text!core/css/examples.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/examples");
                var $exes = $("pre.example, pre.illegal-example");
                if ($exes.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    $exes.each(function (i, ex) {
                        var $ex = $(ex)
                        ,   num = i + 1
                        ,   report = { number: num, illegal: $ex.hasClass("illegal-example") }
                        ;
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
                        ,   $tit = $("<div class='example-title'><span>Example " + num + "</span></div>")
                        ;
                        report.title = $ex.attr("title");
                        if (report.title) {
                            $tit.append(doc.createTextNode(": " + report.title));
                            $ex.removeAttr("title");
                        }
                        $div.append($tit);
                        $div.append($ex.clone());
                        $ex.replaceWith($div);
                        msg.pub("example", report);
                    });
                }
                msg.pub("end", "core/examples");
                cb();
            }
        };
    }
);
