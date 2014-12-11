
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
                        ,   fcref = null
                        ;
                        if (ref) {
                            about = "#" + ref;
                        }
                        else if ($fc.length) {
                            ref = $fc.attr("id");
                            if (ref) {
                                about = "#" + ref;
                                fcref = ref;
                            }
                        }
                        if (about !== "") {
                            $sec.attr({
                                "typeof":   "bibo:Chapter"
                            ,   resource:   about
                            ,   rel:        "bibo:Chapter"
                            });
                            // create a heading triple too, as per the role spec
                            // since we should not be putting an @role on 
                            // h* elements with a value of heading, but we 
                            // still want the semantic markup
                            if ($fc.length) {
                                if (!fcref) {
                                    // there is no ID on the heading itself.  Add one
                                    fcref = $fc.makeID("h", ref) ;
                                }
                                $fc.attr({
                                    about:      "#" + fcref
                                ,   property:   "xhv:role"
                                ,   resource:   "xhv:heading"
                                });
                            }
                        }
                        // annotate the child h* element
                        


                    });
                }
                msg.pub("end", "core/rdfa");
                cb();
            }
        };
    }
);
