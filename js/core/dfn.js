
// Module core/dfn
// Finds all <dfn> elements and populates conf.definitionMap to identify them.
define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb) {
                doc.normalize();
                $("[dfn-for]").each(function() {
                    this.setAttribute("data-dfn-for", this.getAttribute("dfn-for").toLowerCase());
                    this.removeAttribute("dfn-for");
                });
                if (!conf.definitionMap) conf.definitionMap = Object.create(null);
                $("dfn").each(function () {
                    var dfn = $(this);
                    if (dfn.attr("for")) {
                        dfn.attr("data-dfn-for", dfn.attr("for").toLowerCase());
                        dfn.removeAttr("for");
                    } else {
                        dfn.attr("data-dfn-for", (dfn.closest("[data-dfn-for]").attr("data-dfn-for") || "").toLowerCase());
                    }
                    var titles = dfn.getDfnTitles( { isDefinition: true } );
                    titles.forEach( function( item ) {
                        if (!conf.definitionMap[item]) {
                            conf.definitionMap[item] = [];
                        }
                        conf.definitionMap[item].push($(dfn[0]));
                        });
                });
                cb();
            }
        };
    }
);
