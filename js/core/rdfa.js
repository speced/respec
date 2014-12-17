
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
                if (conf.doRDFa) {
                    $("section").each(function () {
                        var $sec = $(this)
                        ,   resource = ""
                        ,   $fc = $sec.children("*").first()
                        ,   ref = $sec.attr("id")
                        ;
                        if (ref) {
                            resource = "#" + ref;
                        }
                        else if ($fc.length) {
                            ref = $fc.attr("id");
                            if (ref) resource = "#" + ref;
                        }
                        var property = "bibo:hasPart";
                        // Headings on everything but boilerplate
                        if (!resource.match(/#(abstract|sotd|toc)$/)) {
                            $sec.attr({
                                "typeof":   "bibo:Chapter"
                            ,   resource:   resource
                            ,   property:   property
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
