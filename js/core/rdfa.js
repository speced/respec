
// Module core/rdfa
// Support for RDFa is spread to multiple places in the code, including templates, as needed by
// the HTML being generated in various places. This is for parts that don't fit anywhere in
// particular

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/rdfa");
                if (conf.doRDFa !== false) {
                    $("section").each(function () {
                        var $sec = $(this)
                        ,   about = ""
                        ,   $fc = $sec.children("*").first()
                        ,   ref = $sec.attr("id")
                        ;
                        if (ref) {
                            about = "#" + ref;
                        }
                        else if ($fc.length) {
                            ref = $fc.attr("id");
                            if (ref) about = "#" + ref;
                        }
                        if (about !== "") {
                            $sec.attr({
                                "typeof":   "bibo:Chapter"
                            ,   resource:   about
                            ,   rel:        "bibo:Chapter"
                            });
                        }
                    });
                }
                msg.pub("end", "core/rdfa");
                cb();
            }
        };
    }
);
