
// Module w3c/abstract
// Handle the abstract section properly.

define(
    ["core/jquery-enhanced"],
    function ($) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/abstract");
                var $abs = $("#abstract");
                if ($abs.length) {
                    if ($abs.find("p").length === 0) $abs.contents().wrapAll($("<p></p>"));
                    $abs.prepend("<h2>" + conf.l10n.abstract + "</h2>");
                    $abs.addClass("introductory");
                    if (conf.doRDFa) {
                        var rel = "dc:abstract"
                        ,   ref = $abs.attr("property");
                        if (ref) rel = ref + " " + rel;
                        $abs.attr({ property: rel });
                    }
                }
                else msg.pub("error", "Document must have one element with ID 'abstract'");
                msg.pub("end", "w3c/abstract");
                cb();
            }
        };
    }
);
