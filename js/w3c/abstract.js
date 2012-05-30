
// Module w3c/abstract
// Handle the abstract section properly.

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/abstract");
                var $abs = $("#abstract");
                if (!$abs) return msg.pub("error", "Document must have one element with ID 'abstract'");
                if ($abs.find("p").length === 0) $abs.contents().wrapAll($("<p></p>"));
                $abs.prepend("<h2>Abstract</h2>");
                $abs.addClass("introductory");
                msg.pub("end", "w3c/abstract");
                cb();
            }
        };
    }
);
