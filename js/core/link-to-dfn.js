
// Module core/link-to-dfn
// Links <a> tags to elements with a matching title in conf.definitionMap.
define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/link-to-dfn");
                doc.normalize();
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var title = $ant.dfnTitle();
                    if (conf.definitionMap[title] && !(conf.definitionMap[title] instanceof Function)) {
                        $ant.attr("href", "#" + conf.definitionMap[title].prop("id")).addClass("internalDFN");
                    }
                    else {
                        // ignore WebIDL
                        if (!$ant.parents(".idl, dl.methods, dl.attributes, dl.constants, dl.constructors, dl.fields, dl.dictionary-members, span.idlMemberType, span.idlTypedefType, div.idlImplementsDesc").length) {
                            msg.pub("warn", "Found linkless <a> element with text '" + title + "' but no matching <dfn>.");
                        }
                        $ant.replaceWith($ant.contents());
                    }
                });
                msg.pub("end", "core/link-to-dfn");
                cb();
            }
        };
    }
);
