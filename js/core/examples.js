
// XXX untested

// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre or code element with class example.

// TODO
//  support invalid-example as well


define(
    ["text!core/css/examples.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/examples");
                var $exes = $("pre.example");
                if ($exes.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    $exes.each(function (i, ex) {
                        var $ex = $(ex), num = i + 1;
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
                        $ex.html(lines.join("\n"));
                        // wrap
                        var $div = $("<div class='example'></div>")
                        ,   $tit = $("<div class='example-title'><span>Example " + num + "</span></div>")
                        ;
                        if ($ex.attr("title")) $tit.append(doc.createTextNode(": " + $ex.attr("title")));
                        $div.append($tit);
                        $div.append($ex.clone());
                        $ex.replaceWith($div);
                    });
                }
                msg.pub("end", "core/examples");
                cb();
            }
        };
    }
);
