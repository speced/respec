
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
                            // We want <dfn> definitions to take precedence over
                            // definitions from WebIDL. WebIDL definitions wind
                            // up as <span>s instead of <dfn>.
                            var oldIsDfn = titles[title][dfn_for].filter('dfn').length !== 0;
                            var newIsDfn = dfn.filter('dfn').length !== 0;
                            if (oldIsDfn && newIsDfn) {
                                // Only complain if the user provides 2 <dfn>s
                                // for the same term.
                                msg.pub("error", "Duplicate definition of '" + (dfn_for ? dfn_for + "/" : "") + title + "'");
                            }
                            if (oldIsDfn) {
                                // Don't overwrite <dfn> definitions.
                                return;
                            }
                        }
                        titles[title][dfn_for] = dfn;
                        if (dfn.attr('id') === undefined) {
                            if (dfn.attr('data-idl')) {
                                dfn.makeID("dom", (dfn_for ? dfn_for + "-" : "") + title);
                            } else {
                                dfn.makeID("dfn", title);
                            }
                        }
                    });
                });
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var linkTargets = $ant.linkTargets();
                    var foundDfn = linkTargets.some(function(target) {
                        if (titles[target.title] && titles[target.title][target.for_]) {
                            var dfn = titles[target.title][target.for_];
                            $ant.attr("href", "#" + dfn.prop("id")).addClass("internalDFN");
                            // If a definition is <code>, links to it should
                            // also be <code>.
                            //
                            // Note that contents().length===1 excludes
                            // definitions that have either other text, or other
                            // whitespace, inside the <dfn>.
                            if (dfn.closest('code,pre').length ||
                                (dfn.contents().length === 1 && dfn.children('code').length === 1)) {
                                $ant.wrapInner('<code></code>');
                            }
                            return true;
                        }
                        return false;
                    });
                    if (!foundDfn) {
                        // ignore WebIDL
                        if (!$ant.parents(".idl, dl.methods, dl.attributes, dl.constants, dl.constructors, dl.fields, dl.dictionary-members, span.idlMemberType, span.idlTypedefType, div.idlImplementsDesc").length) {
                            var link_for = linkTargets[0].for_;
                            var title = linkTargets[0].title;
                            msg.pub("warn", "Found linkless <a> element " + (link_for ? "for '" + link_for + "' " : "") + "with text '" + title + "' but no matching <dfn>.");
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
