
// Module core/dfn
// Finds all <dfn> elements and populates conf.definitionMap to identify them.
define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/dfn");
                doc.normalize();
                $("[dfn-for]").each(function() {
                    this.setAttribute("data-dfn-for", this.getAttribute("dfn-for").toLowerCase());
                    this.removeAttribute("dfn-for");
                });
                if (!conf.definitionMap) conf.definitionMap = {};
                $("dfn").each(function () {
                    var dfn = $(this);
                    if (dfn.attr("for")) {
                        dfn.attr("data-dfn-for", dfn.attr("for").toLowerCase());
                        dfn.removeAttr("for");
                    } else {
                        dfn.attr("data-dfn-for", (dfn.closest("[data-dfn-for]").attr("data-dfn-for") || "").toLowerCase());
                    }
                    var title = dfn.dfnTitle();
                    if (!conf.definitionMap[title]) {
                        conf.definitionMap[title] = [];
                    }
                    conf.definitionMap[title].push(dfn);
                });
                msg.pub("end", "core/dfn");
                cb();
            }
        };
    }
);
