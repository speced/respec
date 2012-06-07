
// Module core/dfn
// Handles the processing and linking of <dfn> and <a> elements.
define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/dfn");
                doc.normalize();
                if (!conf.definitionMap) conf.definitionMap = {};
                $("dfn").each(function () {
                    var title = $(this).dfnTitle();
                    conf.definitionMap[title] = $(this).makeID("dfn", title);
                });
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var title = $ant.dfnTitle();
                    if (conf.definitionMap[title] && !(conf.definitionMap[title] instanceof Function)) {
                        $ant.attr("href", "#" + conf.definitionMap[title]).addClass("internalDFN");
                    }
                });
                msg.pub("end", "core/dfn");
                cb();
            }
        };
    }
);
