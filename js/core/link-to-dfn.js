
// Module core/link-to-dfn
// Gives definitions in conf.definitionMap IDs and links <a> tags to the matching definitions.
define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/link-to-dfn");
                doc.normalize();
                var titles = {};
                Object.keys(conf.definitionMap).forEach(function(title) {
                    titles[title] = {};
                    conf.definitionMap[title].forEach(function(dfn) {
                        if (dfn.attr('data-idl') === undefined) {
                                // Non-IDL definitions aren't "for" an interface.
                            dfn.removeAttr('data-dfn-for');
                        }
                        var dfn_for = dfn.attr('data-dfn-for') || "";
                        if (dfn_for in titles[title]) {
                            msg.pub("error", "Duplicate definition of '" + (dfn_for ? dfn_for + "/" : "") + title + "'");
                        }
                        titles[title][dfn_for] = dfn;
                        if (dfn.attr('data-idl')) {
                            dfn.makeID("dom", (dfn_for ? dfn_for + "-" : "") + title);
                        } else {
                            dfn.makeID("dfn", title);
                        }
                    });
                });
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var title = $ant.dfnTitle();
                    var link_for = ($ant.attr("for") || $ant.closest("[link-for]").attr("link-for") || "").toLowerCase();
                    if (titles[title] && titles[title][link_for]) {
                        $ant.attr("href", "#" + titles[title][link_for].prop("id")).addClass("internalDFN");
                    }
                    else {
                        // ignore WebIDL
                        if (!$ant.parents(".idl, dl.methods, dl.attributes, dl.constants, dl.constructors, dl.fields, dl.dictionary-members, span.idlMemberType, span.idlTypedefType, div.idlImplementsDesc").length) {
                            msg.pub("warn", "Found linkless <a> element with text '" + (link_for ? link_for + "/" : "") + title + "' but no matching <dfn>.");
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
