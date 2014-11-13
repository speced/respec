
// Module core/dfn
// Handles the processing and linking of <dfn> and <a> elements.
// Note that each dfn has a "scope" that is determined from the
// dfnScope method in the Util module.  A definition can be 
// scoped with a local attribute or a parent attribute that 
// scopes the definitions into a vocabulary space.  See the 
// dfnScope method for more information.    
define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/dfn");
                doc.normalize();
                if (!conf.definitionMap) conf.definitionMap = {};
                if (!conf.exportedDefs) conf.exportedDefs = {};
                if (!conf.localDefs) conf.localDefs = {};
                $("dfn").each(function () {
                    var $t = $(this) ;
                    // find our scope
                    var scope = $t.dfnScope();
                    if (!conf.definitionMap[scope]) conf.definitionMap[scope] = {} ;
                    // should this be exported?
                    var x = $t.dfnExport( scope ) ;
                    // memorialize the state for later scraping
                    if (x) {
                        $t.attr('data-export', '') ;
                    }
                    else {
                        $t.attr('data-noexport', '') ;
                    }

                    // data-title is the primary way of
                    // declaring the ways this definition can be
                    // referenced
                    var a ;
                    if ($t.attr('data-title')) {
                        a = $t.dfnTitle('data-title') ;
                    }
                    // if there is no data-title attribute, then
                    // use the (legacy) regular title attribute or the
                    // contents
                    else {
                        a = $t.dfnTitle();
                        // set the data-title attribute so that 
                        // bikeshed and others can find us
                        $t.attr('data-title', a) ;
                    }

                    // Note - this permits aliases even in the
                    // regular title attribute
                    var titles = a.split(/\|/) ;
                    var prefix = 'dfn' ;
                    if ( scope != 'dfn' ) {
                        prefix += '-'+scope ;
                    }
                    var theID = $t.makeID(prefix, titles[0]);
                    $.each(titles, function (i, title) {
                        title = title.replace(/^\s+/, "").replace(/\s+$/, "");
                        if (conf.definitionMap[scope][title]) msg.pub("error", "Duplicate definition of '" + scope + ":" + title + "'");
                        conf.definitionMap[scope][title] = theID ;
                        if (x) {
                            conf.exportedDefs[scope+":"+title] = theID;
                        }
                    }) ;
                    if ($t.attr('local-title')) {
                        a = $t.dfnTitle('local-title');
                        if (a) {
                            titles = a.split(/\|/) ;
                            $.each(titles, function (i, title) {
                                title = title.replace(/^\s+/, "").replace(/\s+$/, "");
                                if (conf.definitionMap[scope][title]) msg.pub("error", "Duplicate definition of '" + scope + ":" + title + "'");
                                conf.definitionMap[scope][title] = theID ;
                            }) ;
                        }
                        $t.removeAttr('local-title') ;
                    }
                });
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var title = $ant.dfnTitle();
                    var scope = $ant.dfnScope() ;
                    if (conf.definitionMap[scope][title] && !(typeof conf.definitionMap[scope][title] == "function" )) {
                        $ant.attr("href", "#" + conf.definitionMap[scope][title]).addClass("internalDFN");
                    }
                    else {
                        // ignore WebIDL
                        if (!$ant.parents(".idl, dl.methods, dl.attributes, dl.constants, dl.constructors, dl.fields, dl.dictionary-members, span.idlMemberType, span.idlTypedefType, div.idlImplementsDesc").length) {
                            msg.pub("warn", "Found linkless <a> element with text '" + scope + ":" + title + "' but no matching <dfn>.");
                        }
                        $ant.replaceWith($ant.contents());
                    }
                });
                msg.pub("end", "core/dfn");
                cb();
            }
        };
    }
);
