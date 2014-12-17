
// Module core/dfn
// Finds all <dfn> elements, gives them IDs, and populates conf.definitionMap to identify them.
define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/dfn");
                doc.normalize();
                if (!conf.definitionMap) conf.definitionMap = {};
                $("dfn").each(function () {
                    var dfn = $(this);
                    var title = dfn.dfnTitle();
                    if (conf.definitionMap[title]) msg.pub("error", "Duplicate definition of '" + title + "'");
                    dfn.makeID("dfn", title);
                    conf.definitionMap[title] = dfn;
                });
                msg.pub("end", "core/dfn");
                cb();
            }
        };
    }
);
