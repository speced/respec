// these options are there for the XPath emulation code, which uses them
// they can be dropped when it is (same for global Document)
/*jshint
    bitwise: false,
    boss:   true
*/
/*global berjon, respecEvent, shortcut, respecConfig, Node, Document */

// RESPEC
(function () {
    if (typeof(berjon) == "undefined") window.berjon = {};
    var sn;
    function _errEl () {
        var err = document.getElementById("respec-err");
        if (err) return err.firstElementChild;
        err = sn.element("div",
                            { id: "respec-err",
                              style: "position: fixed; width: 350px; top: 10px; right: 10px; border: 3px double #f00; background: #fff",
                              "class": "removeOnSave" },
                            document.body);
        return sn.element("ul", {}, err);
    }
    function error (str) {
        if (window.respecEvent) respecEvent.pub("error", str);
        sn.element("li", { style: "color: #c00" }, _errEl(), str);
    }
    function warning (str) {
        if (window.respecEvent) respecEvent.pub("warn", str);
        sn.element("li", { style: "color: #666" }, _errEl(), str);
    }
    berjon.respec = function () {};
    berjon.respec.prototype = {
        loadAndRun:    function (cb, msg, conf, doc, cb, msg) {
            var scripts = document.querySelectorAll("script[src]");
            // XXX clean this up
            var rs, base = "";
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].src;
                if (/\/js\/require\.js$/.test(src)) {
                    rs = scripts[i];
                    base = src.replace(/js\/require\.js$/, "");
                }
            }
            // base = respecConfig.respecBase;
            var loaded = [];
            var deps = ["js/simple-node.js", "js/shortcut.js", "bibref/biblio.js"];
            var head = document.getElementsByTagName('head')[0];
            var obj = this;
            var loadHandler = function (ev) {
                loaded.push(ev.target.src);
                if (loaded.length == deps.length) {
                    sn = new berjon.simpleNode({
                        "":     "http://www.w3.org/1999/xhtml",
                        "x":    "http://www.w3.org/1999/xhtml"
                    }, document);
                    obj.run(conf, doc, cb, msg);
                    msg.pub("end", "w3c/legacy");
                    cb();
                }
            };
            // the fact that we hand-load is temporary, and will be fully replaced by RequireJS
            // in the meantime, we need to avoid loading these if we are using the built (bundled)
            // version. So we do some basic detection and decline to load.
            if (!berjon.simpleNode && !berjon.biblio) {
                for (var i = 0; i < deps.length; i++) {
                    var dep = deps[i];
                    var sel = document.createElement('script');
                    sel.type = 'text/javascript';
                    sel.src = base + dep;
                    sel.setAttribute("class", "remove");
                    sel.onload = loadHandler;
                    head.appendChild(sel);
                }
            }
            else {
                sn = new berjon.simpleNode({
                    "":     "http://www.w3.org/1999/xhtml",
                    "x":    "http://www.w3.org/1999/xhtml"
                }, document);
                obj.run(conf, doc, cb, msg);
                msg.pub("end", "w3c/legacy");
                cb();
            }
        },

        run:    function (conf, doc, cb, msg) {
            try {
                this.extractConfig();
                this.bibref(conf, doc, cb, msg);
                this.webIDL();

                // if (this.doMicroData) this.makeMicroData();
                if (this.doRDFa) this.makeRDFa();

                // shortcuts
                var obj = this;
                // shortcut.add("Alt+H", function () { obj.toHTML(); });
                // shortcut.add("Shift+Alt+H", function () { obj.toHTMLSource(); });
                shortcut.add("Ctrl+Shift+Alt+S", function () { obj.showSaveOptions(); });
                shortcut.add("Esc", function () { obj.hideSaveOptions(); });
            }
            catch (e) {
                error("Processing error: " + e);
                if (typeof(console) != "undefined" && console.log) console.log(e);
            }
        },

        makeRDFa:  function () {
            var abs = document.getElementById("abstract");
            if (abs) {
                var rel = 'dcterms:abstract' ;
                var ref = abs.getAttribute('property') ;
                if (ref) {
                    rel = ref + ' ' + rel ;
                }
                abs.setAttribute('property', rel) ;
                abs.setAttribute('datatype', '') ;
            }
            // annotate sections with Section data
            var secs = document.querySelectorAll("section");
            for (var i = 0; i < secs.length; i++) {
                // if the section has an id, use that.  if not, look at the first child for an id
                var about = '' ;
                // the first child should be a header - that's what we will annotate
                var fc = secs[i].firstElementChild;
                var ref = secs[i].getAttribute('id') ;
                if ( ref ) {
                    about = '#' + ref ;
                } else {
                    if (fc) {
                        ref = fc.getAttribute('id') ;
                        if (ref) {
                            about = '#' + ref;
                        }
                    }
                }
                if (about !== '') {
                    secs[i].setAttribute('typeof', 'bibo:Chapter') ;
                    secs[i].setAttribute('resource', about) ;
                    secs[i].setAttribute('rel', "bibo:chapter" ) ;
                }
            }
        },

        saveMenu: null,
        showSaveOptions:    function () {
            var obj = this;
            this.saveMenu = sn.element("div",
                            { style: "position: fixed; width: 400px; top: 10px; padding: 1em; border: 5px solid #90b8de; background: #fff" },
                            document.body);
            sn.element("h4", {}, this.saveMenu, "Save Options");
            var butH = sn.element("button", {}, this.saveMenu, "Save as HTML");
            butH.onclick = function () { obj.hideSaveOptions(); obj.toHTML(); };
            var butS = sn.element("button", {}, this.saveMenu, "Save as HTML (Source)");
            butS.onclick = function () { obj.hideSaveOptions(); obj.toHTMLSource(); };
            var butS = sn.element("button", {}, this.saveMenu, "Save as XHTML");
            butS.onclick = function () { obj.hideSaveOptions(); obj.toXHTML(); };
            var butS = sn.element("button", {}, this.saveMenu, "Save as XHTML (Source)");
            butS.onclick = function () { obj.hideSaveOptions(); obj.toXHTMLSource(); };
            if (this.diffTool && (this.previousDiffURI || this.previousURI) ) {
                var butD = sn.element("button", {}, this.saveMenu, "Diffmark");
                butD.onclick = function () { obj.hideSaveOptions(); obj.toDiffHTML(); };
            }

        },

        hideSaveOptions:    function () {
            if (!this.saveMenu) return;
            this.saveMenu.parentNode.removeChild(this.saveMenu);
        },

        toString:    function () {
            var str = "<!DOCTYPE html";
            var dt = document.doctype;
            if (dt && dt.publicId) {
                str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
            }
            else { // when HTML5 is allowed we can remove this
                str += " PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'";
            }
            str += ">\n";
            str += "<html";
            var ats = document.documentElement.attributes;
            var prefixAtr = '' ;

            for (var i = 0; i < ats.length; i++) {
                var an = ats[i].name;
                if (an == "xmlns" || an == "xml:lang") continue;
                if (an == "prefix") {
                    prefixAtr = ats[i].value;
                    continue;
                }
                str += " " + an + "=\"" + this._esc(ats[i].value) + "\"";
            }
            if (this.doRDFa) {
                if (prefixAtr !== '') prefixAtr += ' ';
                if (this.doRDFa != "1.1") {
                    prefixAtr += "dcterms: http://purl.org/dc/terms/ bibo: http://purl.org/ontology/bibo/ foaf: http://xmlns.com/foaf/0.1/ xsd: http://www.w3.org/2001/XMLSchema#";
                } else {
                    prefixAtr += "bibo: http://purl.org/ontology/bibo/";
                }
                str += " prefix=\"" + this._esc(prefixAtr) + "\"";
                str += " typeof=\"bibo:Document\"";
            }

            str += ">\n";
            str += document.documentElement.innerHTML;
            str += "</html>";
            return str;
        },

        toXML:        function () {
            var str = "<?xml version='1.0' encoding='UTF-8'?>\n<!DOCTYPE html";
            var dt = document.doctype;
            if (dt && dt.publicId) {
                str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
            }
            else {
                if (this.doRDFa) {
                    if (this.doRDFa == "1.1") {
                        // use the standard RDFa 1.1 doctype
                        str += " PUBLIC '-//W3C//DTD XHTML+RDFa 1.1//EN' 'http://www.w3.org/MarkUp/DTD/xhtml-rdfa-2.dtd'";
                    } else {
                        // use the standard RDFa doctype
                        str += " PUBLIC '-//W3C//DTD XHTML+RDFa 1.0//EN' 'http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd'";
                    }
                } else {
                    str += " PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'";
                }
            }
            str += ">\n";
            str += "<html";
            var ats = document.documentElement.attributes;
            var prefixAtr = '' ;

            var hasxmlns = false;
            for (var i = 0; i < ats.length; i++) {
                var an = ats[i].name;
                if (an == "lang") continue;
                if (an == "xmlns") hasxmlns = true;
                if (an == "prefix") {
                    prefixAtr = ats[i].value;
                    continue;
                }
                str += " " + an + "=\"" + this._esc(ats[i].value) + "\"";
            }
            if (!hasxmlns) str += ' xmlns="http://www.w3.org/1999/xhtml"';
            if (this.doRDFa) {
                if (this.doRDFa != "1.1") {
                    str += " xmlns:dcterms='http://purl.org/dc/terms/' xmlns:bibo='http://purl.org/ontology/bibo/' xmlns:foaf='http://xmlns.com/foaf/0.1/' xmlns:xsd='http://www.w3.org/2001/XMLSchema#'";
                    // there was already some prefix information
                    if (prefixAtr !== '') {
                        var list = prefixAtr.split(/\s+/) ;
                        for (var i = 0; i < list.length; i += 2) {
                            var n = list[i] ;
                            n = n.replace(/:$/,'');
                            str += ' xmlns:'+n+'="' + list[i+1] + '"';
                        }
                    }
                    str += ' version="XHTML+RDFa 1.0"';
                } else {
                    if (prefixAtr !== '') {
                        str += " prefix='" + prefixAtr + " bibo: http://purl.org/ontology/bibo/'" ;
                    } else {
                        str += " prefix='bibo: http://purl.org/ontology/bibo/'" ;
                    }
                }
            }
            str += " typeof=\"bibo:Document\"";
            str += ">\n";
            // walk the entire DOM tree grabbing nodes and emitting them - possibly modifying them
            // if they need the funny closing tag
            var pRef = this ;
            var selfClosing = {};
            "br img input area base basefont col isindex link meta param hr".split(" ").forEach(function (n) {
                selfClosing[n] = true;
            });
            var noEsc = [false];
            var dumpNode = function (node) {
                var out = '';
                // if the node is the document node.. process the children
                if ( node.nodeType == 9 || ( node.nodeType == 1 && node.nodeName.toLowerCase() == 'html' ) ) {
                    for (var i = 0; i < node.childNodes.length; i++) out += dumpNode(node.childNodes[i]) ;
                }
                // element
                else if (1 === node.nodeType) {
                    var ename = node.nodeName.toLowerCase() ;
                    out += '<' + ename ;
                    for (var i = 0; i < node.attributes.length; i++) {
                        var atn = node.attributes[i];
                        out += " " + atn.name + "=\"" + pRef._esc(atn.value) + "\"";
                    }
                    if (selfClosing[ename]) {
                        out += ' />';
                    }
                    else {
                        out += '>';
                        // XXX removing this, as it does not seem correct at all
                        // if ( ename == 'pre' ) {
                        //     out += "\n" + node.innerHTML;
                        // }
                        // else {
                            // console.log("NAME: " + ename);
                            noEsc.push(ename === "style" || ename === "script");
                            // console.log(noEsc);
                            for (var i = 0; i < node.childNodes.length; i++) out += dumpNode(node.childNodes[i]);
                            noEsc.pop();
                        // }
                        out += '</' + ename + '>';
                    }
                }
                // comments
                else if (8 === node.nodeType) {
                    out += "\n<!-- " + node.nodeValue + " -->\n";
                }
                // text or cdata
                else if (3 === node.nodeType || 4 === node.nodeType) {
                    // console.log("TEXT: " + noEsc[noEsc.length - 1]);
                    out += noEsc[noEsc.length - 1] ? node.nodeValue : pRef._esc(node.nodeValue);
                }
                // we don't handle other types for the time being
                else {
                    warning("Cannot handle serialising nodes of type: " + node.nodeType);
                }
                return out;
            };
            str += dumpNode(document.documentElement) ;
            str += "</html>";
            return str;
        },

        toDiffHTML:  function () {
            // create a diff marked version against the previousURI
            // strategy - open a window in which there is a form with the
            // data needed for diff marking - submit the form so that the response populates
            // page with the diff marked version
            var base = window.location.href;
            base = base.replace(/\/[^\/]*$/, "/");
            var str = "<!DOCTYPE html>\n";
            str += "<html";
            var ats = document.documentElement.attributes;
            for (var i = 0; i < ats.length; i++) {
                str += " " + ats[i].name + "=\"" + this._esc(ats[i].value) + "\"";
            }
            str += ">\n";
            str += "<head><title>diff form</title></head>\n";
            str += "<body><form name='form' method='POST' action='" + this.diffTool + "'>\n";
            str += "<input type='hidden' name='base' value='" + base + "'>\n";
            if (this.previousDiffURI) {
                str += "<input type='hidden' name='oldfile' value='" + this.previousDiffURI + "'>\n";
            } else {
                str += "<input type='hidden' name='oldfile' value='" + this.previousURI + "'>\n";
            }
            str += '<input type="hidden" name="newcontent" value="' + this._esc(this.toString()) + '">\n';
            str += '<p>Please wait...</p>';
            str += "</form></body></html>\n";


            var x = window.open() ;
            x.document.write(str) ;
            x.document.close() ;
            x.document.form.submit() ;
        },

        toHTML:    function () {
            var x = window.open();
            x.document.write(this.toString());
            x.document.close();
        },

        toHTMLSource:    function () {
            var x = window.open();
            x.document.write("<pre>" + this._esc(this.toString()) + "</pre>");
            x.document.close();
        },

        toXHTML:    function () {
            var x = window.open();
            x.document.write(this.toXML()) ;
            x.document.close();
        },

        toXHTMLSource:    function () {
            var x = window.open();
            x.document.write("<pre>" + this._esc(this.toXML()) + "</pre>");
            x.document.close();
        },

        // --- METADATA -------------------------------------------------------
        extractConfig:    function () {
            var cfg = respecConfig || {};
            if (!cfg.noIDLSorting) cfg.noIDLSorting = false;
            if (cfg.tocIntroductory === undefined) cfg.tocIntroductory = false;
            if (!cfg.maxTocLevel) cfg.maxTocLevel = 0;
            if (!cfg.diffTool) cfg.diffTool = 'http://www5.aptest.com/standards/htmldiff/htmldiff.pl';
            if (!cfg.doRDFa) cfg.doRDFa = false;
            for (var k in cfg) {
                if (this.hasOwnProperty(k)) this[k] = cfg[k];
            }
        },

        // --- INLINE PROCESSING ----------------------------------------------------------------------------------
        bibref:    function (conf, doc, cb, msg) {
            // this is in fact the bibref processing portion
            var badrefs = {}
            ,   badrefcount = 0
            ,   informs = conf.informativeReferences
            ,   norms = conf.normativeReferences
            ;

            var del = [];
            for (var k in informs) if (norms[k]) del.push(k);
            for (var i = 0; i < del.length; i++) delete informs[del[i]];

            var refsec = sn.element("section", { id: "references", "class": "appendix" }, document.body);
            sn.element("h2", {}, refsec, "References");
            if (this.refNote) {
                var refnote = sn.element("p", {}, refsec);
                refnote.innerHTML = this.refNote;
            }
            var getKeys = function (obj) {
                var res = [];
                for (var k in obj) res.push(k);
                return res;
            };

            var types = ["Normative", "Informative"];
            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                var refs = (type == "Normative") ? getKeys(norms) : getKeys(informs);
                var sec = sn.element("section", {}, refsec);
                sn.makeID(sec, null, type + " references");
                sn.element("h3", {}, sec, type + " references");
                refs.sort();
                if (refs.length) {
                    var dl = sn.element("dl", { "class": "bibliography" }, sec);
                    if (this.doRDFa) {
                        dl.setAttribute('about', '') ;
                    }
                    for (var j = 0; j < refs.length; j++) {
                        var ref = refs[j];
                        sn.element("dt", { id: "bib-" + ref }, dl, "[" + ref + "]");
                        var dd = sn.element("dd", {}, dl);
                        if (this.doRDFa) {
                            if (type == 'Normative') {
                                dd.setAttribute('rel','dcterms:requires');
                            } else {
                                dd.setAttribute('rel','dcterms:references');
                            }
                        }
                        if (berjon.biblio[ref]) dd.innerHTML = berjon.biblio[ref] + "\n";
                        else {
                            if (!badrefs[ref]) badrefs[ref] = 0;
                            badrefs[ref]++;
                            badrefcount++;
                            dd.innerHTML = "<em>Reference not found.</em>\n";
                        }
                    }
                }
                else {
                    sn.element("p", {}, sec, "No " + type.toLowerCase() + " references.");
                }
            }
            
            if(badrefcount > 0) {
                error("Got " + badrefcount + " tokens looking like a reference, not in biblio DB: ");
                for (var item in badrefs) {
                    if (badrefs.hasOwnProperty(item)) error("Bad ref: " + item + ", count = " + badrefs[item]);
                }
            }

        },

        // --- WEB IDL --------------------------------------------------------------------------------------------
        webIDL:    function () {
            var idls = document.querySelectorAll(".idl");
            var infNames = [];
            for (var i = 0; i < idls.length; i++) {
                var idl = idls[i];
                var w = new berjon.WebIDLProcessor({ noIDLSorting: this.noIDLSorting });
                var inf = w.definition(idl);
                var df = w.makeMarkup();
                idl.parentNode.replaceChild(df, idl);
                if (inf.type == "interface" || inf.type == "exception" ||
                    inf.type == "dictionary" || inf.type == "typedef" ||
                    inf.type == "callback" || inf.type == "enum") infNames.push(inf.id);
            }
            document.normalize();
            var ants = document.querySelectorAll("a:not([href])");
            for (var i = 0; i < ants.length; i++) {
                var ant = ants[i];
                if (sn.hasClass(ant, "externalDFN")) continue;
                var name = ant.textContent;
                if (infNames.indexOf(name) >= 0) {
                    ant.setAttribute("href", "#idl-def-" + name);
                    // ant.setAttribute("class", "idlType");
                    sn.addClass(ant, "idlType");
                    ant.innerHTML = "<code>" + name + "</code>";
                }
            }
        },

        // --- HELPERS --------------------------------------------------------------------------------------------
        _esc:    function (s) {
            s = s.replace(/&/g,'&amp;');
            s = s.replace(/>/g,'&gt;');
            s = s.replace(/"/g,'&quot;');
            s = s.replace(/</g,'&lt;');
            return s;
        }
    };

    berjon.WebIDLProcessor = function (cfg) {
        this.parent = { type: "module", id: "outermost", children: [] };
        if (!cfg) cfg = {};
        for (var k in cfg) if (cfg.hasOwnProperty(k)) this[k] = cfg[k];
    };
    berjon.WebIDLProcessor.prototype = {
        definition:    function (idl) {
            var def = { children: [] };
            var str = idl.getAttribute("title");
            str = this.parseExtendedAttributes(str, def);
            if      (str.indexOf("interface") === 0 || str.indexOf("partial") === 0) this.processInterface(def, str, idl);
            else if (str.indexOf("exception") === 0) this.exception(def, str, idl);
            else if (str.indexOf("dictionary") === 0) this.dictionary(def, str, idl);
            else if (str.indexOf("callback") === 0) this.callback(def, str, idl);
            else if (str.indexOf("enum") === 0) this.processEnum(def, str, idl);
            else if (str.indexOf("typedef") === 0)   this.typedef(def, str, idl);
            else if (/\bimplements\b/.test(str))     this.processImplements(def, str, idl);
            else    error("Expected definition, got: " + str);
            this.parent.children.push(def); // this should be done at the caller level
            this.processMembers(def, idl);
            return def;
        },

        processInterface:  function (inf, str, idl) {
            inf.type = "interface";
            var match = /^\s*(partial\s+)?interface\s+([A-Za-z][A-Za-z0-9]*)(?:\s+:\s*([^{]+)\s*)?/.exec(str);
            if (match) {
                inf.partial = !!match[1];
                inf.id = match[2];
                inf.refId = this._id(inf.id);
                if (idl.getAttribute('data-merge')) {
                    inf.merge = [];
                    var merge = idl.getAttribute('data-merge').split(' ');
                    for (var i = 0; i < merge.length; i++) inf.merge.push(merge[i]);
                }
                if (match[3]) inf.superclasses = match[3].split(/\s*,\s*/);
            }
            else {
                error("Expected interface, got: " + str);
            }
            return inf;
        },

        dictionary:  function (inf, str, idl) {
            inf.type = "dictionary";
            var match = /^\s*dictionary\s+([A-Za-z][A-Za-z0-9]*)(?:\s+:\s*([^{]+)\s*)?/.exec(str);
            if (match) {
                inf.id = match[1];
                inf.refId = this._id(inf.id);
                if (match[2]) inf.superclasses = match[2].split(/\s*,\s*/);
            }
            else {
                error("Expected dictionary, got: " + str);
            }
            return inf;
        },

        callback:  function (inf, str, idl) {
            inf.type = "callback";
            var match = /^\s*callback\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*\b(.*?)\s*$/.exec(str);
            if (match) {
                inf.id = match[1];
                inf.refId = this._id(inf.id);
                var type = match[2];
                inf.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    inf.nullable = true;
                }
                inf.array = false;
                if (/\[\]$/.test(type)) {
                    type = type.replace(/\[\]$/, "");
                    inf.array = true;
                }
                inf.datatype = type;
            }
            else {
                error("Expected callback, got: " + str);
            }
            return inf;
        },

        processEnum:  function (inf, str, idl) {
            inf.type = "enum";
            var match = /^\s*enum\s+([A-Za-z][A-Za-z0-9]*)\s*$/.exec(str);
            if (match) {
                inf.id = match[1];
                inf.refId = this._id(inf.id);
            }
            else {
                error("Expected enum, got: " + str);
            }
            return inf;
        },

        exception:  function (exc, str, idl) {
            exc.type = "exception";
            var match = /^\s*exception\s+([A-Za-z][A-Za-z0-9]*)\s*/.exec(str);
            if (match) {
                exc.id = match[1];
                exc.refId = this._id(exc.id);
            }
            else error("Expected exception, got: " + str);
            return exc;
        },

        typedef:    function (tdf, str, idl) {
            tdf.type = "typedef";
            tdf.extendedAttributes = null; // remove them in case some were there by mistake
            var match = /^\s*typedef\s+(.+)\s+(\S+)\s*$/.exec(str);
            if (match) {
                var type = match[1];
                tdf.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    tdf.nullable = true;
                }
                tdf.array = false;
                if (/\[\]$/.test(type)) {
                    type = type.replace(/\[\]$/, "");
                    tdf.array = true;
                }
                tdf.datatype = type;
                tdf.id = match[2];
                tdf.refId = this._id(tdf.id);
                tdf.description = sn.documentFragment();
                sn.copyChildren(idl, tdf.description);
            }
            else {
                error("Expected typedef, got: " + str);
            }
            return tdf;
        },

        processImplements: function (imp, str, idl) {
            imp.type = "implements";
            imp.extendedAttributes = null; // remove them in case some were there by mistake
            var match = /^\s*(.+?)\s+implements\s+(.+)\s*$/.exec(str);
            if (match) {
                imp.id = match[1];
                imp.refId = this._id(imp.id);
                imp.datatype = match[2];
                imp.description = sn.documentFragment();
                sn.copyChildren(idl, imp.description);
            }
            else {
                error("Expected implements, got: " + str);
            }
            return imp;
        },

        processMembers:    function (obj, el) {
            var exParent = this.parent;
            this.parent = obj;
            var dts = sn.findNodes("./dt", el);
            for (var i = 0; i < dts.length; i++) {
                var dt = dts[i];
                var dd = dt.nextElementSibling; // we take a simple road
                var mem;
                if (obj.type == "exception") {
                    mem = this.exceptionMember(dt, dd);
                }
                else if (obj.type == "dictionary") {
                    mem = this.dictionaryMember(dt, dd);
                }
                else if (obj.type == "callback") {
                    mem = this.callbackMember(dt, dd);
                }
                else if (obj.type == "enum") {
                    mem = this.processEnumMember(dt, dd);
                }
                else {
                    mem = this.interfaceMember(dt, dd);
                }
                obj.children.push(mem);
            }
            this.parent = exParent;
        },

        parseConst:    function (mem, str) {
            // CONST
            var match = /^\s*const\s+\b([^=]+\??)\s+([^=\s]+)\s*=\s*(.*)$/.exec(str);
            if (match) {
                mem.type = "constant";
                var type = match[1];
                mem.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    mem.nullable = true;
                }
                mem.datatype = type;
                mem.id = match[2];
                mem.refId = this._id(mem.id);
                mem.value = match[3];
                return true;
            }
            return false;
        },

        exceptionMember:    function (dt, dd) {
            var mem = { children: [] };
            var str = this._norm(dt.textContent);
            mem.description = sn.documentFragment();
            sn.copyChildren(dd, mem.description);
            str = this.parseExtendedAttributes(str, mem);

            if (this.parseConst(mem, str)) return mem;

            // FIELD
            var match = /^\s*(.*?)\s+(\S+)\s*$/.exec(str);
            if (match) {
                mem.type = "field";
                var type = match[1];
                mem.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    mem.nullable = true;
                }
                mem.array = false;
                if (/\[\]$/.test(type)) {
                    type = type.replace(/\[\]$/, "");
                    mem.array = true;
                }
                mem.datatype = type;
                mem.id = match[2];
                mem.refId = this._id(mem.id);
                return mem;
            }

            // NOTHING MATCHED
            error("Expected exception member, got: " + str);
        },

        dictionaryMember:    function (dt, dd) {
            var mem = { children: [] };
            var str = this._norm(dt.textContent);
            mem.description = sn.documentFragment();
            sn.copyChildren(dd, mem.description);
            str = this.parseExtendedAttributes(str, mem);

            // MEMBER
            var match = /^\s*([^=]+\??)\s+([^=\s]+)(?:\s*=\s*(.*))?$/.exec(str);
            // var match = /^\s*(.*?)\s+(\S+)\s*$/.exec(str);
            if (match) {
                mem.type = "member";
                var type = match[1];
                mem.id = match[2];
                mem.refId = this._id(mem.id);
                mem.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    mem.nullable = true;
                }
                mem.array = false;
                if (/\[\]$/.test(type)) {
                    type = type.replace(/\[\]$/, "");
                    mem.array = true;
                }
                mem.datatype = type;
                return mem;
            }

            // NOTHING MATCHED
            error("Expected dictionary member, got: " + str);
        },

        callbackMember:    function (dt, dd) {
            var mem = { children: [] };
            var str = this._norm(dt.textContent);
            mem.description = sn.documentFragment();
            sn.copyChildren(dd, mem.description);
            str = this.parseExtendedAttributes(str, mem);

            // MEMBER
            var match = /^\s*\b(.*?)\s+([A-Za-z][A-Za-z0-9]*)\s*$/.exec(str);
            if (match) {
                mem.type = "member";
                var type = match[1];
                mem.id = match[2];
                mem.refId = this._id(mem.id);
                mem.defaultValue = match[3];
                mem.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    mem.nullable = true;
                }
                mem.array = false;
                if (/\[\]$/.test(type)) {
                    type = type.replace(/\[\]$/, "");
                    mem.array = true;
                }
                mem.optional = false;
                var pkw = type.split(/\s+/)
                ,   idx = pkw.indexOf("optional")
                ;
                if (idx > -1) {
                    mem.optional = true;
                    pkw.splice(idx, 1);
                    type = pkw.join(" ");
                }
                mem.datatype = type;
                return mem;
            }

            // NOTHING MATCHED
            error("Expected callback member, got: " + str);
        },

        processEnumMember:    function (dt, dd) {
            var mem = { children: [] };
            var str = this._norm(dt.textContent);
            mem.description = sn.documentFragment();
            sn.copyChildren(dd, mem.description);
            str = this.parseExtendedAttributes(str, mem);

            // MEMBER
            mem.type = "member";
            mem.id = str;
            mem.refId = this._id(mem.id);
            return mem;
        },

        interfaceMember:    function (dt, dd) {
            var mem = { children: [] };
            var str = this._norm(dt.textContent);
            var extPrm = (sn.findNodes("dl[@class='parameters']", dd))[0];
            var excepts = sn.findNodes("*[@class='exception']", dd);
            var hadId = false;
            if (dd.id) hadId = true;
            else dd.id = "temporaryIDJustForCSS";
            dd.refId = this._id(dd.id);
            // var sgrs = sn.findNodes("*[@class='setraises' or @class='getraises' or]", dd);
            var sgrs = document.querySelectorAll("#" + dd.id + " .getraises, #" + dd.id + " .setraises");
            if (!hadId) dd.removeAttribute("id");
            mem.description = sn.documentFragment();
            sn.copyChildren(dd, mem.description);
            str = this.parseExtendedAttributes(str, mem);
            var match;

            // ATTRIBUTE
            match = /^\s*(?:(readonly)\s+)?attribute\s+\b(.*?)\s+(\S+)\s*$/.exec(str);
            if (match) {
                mem.type = "attribute";
                mem.readonly = (match[1] == "readonly");
                var type = match[2];
                mem.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    mem.nullable = true;
                }
                mem.array = false;
                if (/\[\]$/.test(type)) {
                    type = type.replace(/\[\]$/, "");
                    mem.array = true;
                }
                mem.datatype = type;
                mem.id = match[3];
                mem.refId = this._id(mem.id);
                mem.raises = [];
                if (sgrs.length) {
                    for (var i = 0; i < sgrs.length; i++) {
                        var el = sgrs[i];
                        var exc = {
                            id:     el.getAttribute("title"),
                            onSet:  sn.hasClass(el, "setraises"),
                            onGet:  sn.hasClass(el, "getraises")
                        };
                        if (el.localName.toLowerCase() == "dl") {
                            exc.type = "codelist";
                            exc.description = [];
                            var dts = sn.findNodes("./dt", el);
                            for (var j = 0; j < dts.length; j++) {
                                var dt = dts[j];
                                var dd = dt.nextElementSibling;
                                var c = { id: dt.textContent, description: sn.documentFragment() };
                                sn.copyChildren(dd, c.description);
                                exc.description.push(c);
                            }
                        }
                        else if (el.localName.toLowerCase() == "div") {
                            exc.type = "simple";
                            exc.description = sn.documentFragment();
                            sn.copyChildren(el, exc.description);
                        }
                        else {
                            error("Do not know what to do with exceptions being raised defined outside of a div or dl.");
                        }
                        el.parentNode.removeChild(el);
                        mem.raises.push(exc);
                    }
                }

                return mem;
            }

            if (this.parseConst(mem, str)) return mem;

            // METHOD
            match = /^\s*\b(.*?)\s+\b(\S+)\s*\(\s*(.*)\s*\)\s*$/.exec(str);
            if (match) {
                mem.type = "method";
                var type = match[1];
                mem.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    mem.nullable = true;
                }
                mem.array = false;
                if (/\[\]$/.test(type)) {
                    type = type.replace(/\[\]$/, "");
                    mem.array = true;
                }
                mem.datatype = type;
                mem.id = match[2];
                mem.refId = this._id(mem.id);
                mem.params = [];
                var prm = match[3];
                mem.raises = [];

                if (excepts.length) {
                    for (var i = 0; i < excepts.length; i++) {
                        var el = excepts[i];
                        var exc = { id: el.getAttribute("title") };
                        if (el.localName.toLowerCase() == "dl") {
                            exc.type = "codelist";
                            exc.description = [];
                            var dts = sn.findNodes("./dt", el);
                            for (var j = 0; j < dts.length; j++) {
                                var dt = dts[j];
                                var dd = dt.nextElementSibling;
                                var c = { id: dt.textContent, description: sn.documentFragment() };
                                sn.copyChildren(dd, c.description);
                                exc.description.push(c);
                            }
                        }
                        else if (el.localName.toLowerCase() == "div") {
                            exc.type = "simple";
                            exc.description = sn.documentFragment();
                            sn.copyChildren(el, exc.description);
                        }
                        else {
                            error("Do not know what to do with exceptions being raised defined outside of a div or dl.");
                        }
                        el.parentNode.removeChild(el);
                        mem.raises.push(exc);
                    }
                }

                if (extPrm) {
                    extPrm.parentNode.removeChild(extPrm);
                    var dts = sn.findNodes("./dt", extPrm);
                    for (var i = 0; i < dts.length; i++) {
                        var dt = dts[i];
                        var dd = dt.nextElementSibling; // we take a simple road
                        var prm = dt.textContent;
                        var p = {};
                        prm = this.parseExtendedAttributes(prm, p);
                        var match = /^\s*\b(.+?)\s+([^\s]+)\s*$/.exec(prm);
                        if (match) {
                            var type = match[1];
                            p.nullable = false;
                            if (/\?$/.test(type)) {
                                type = type.replace(/\?$/, "");
                                p.nullable = true;
                            }
                            p.array = false;
                            if (/\[\]$/.test(type)) {
                                type = type.replace(/\[\]$/, "");
                                p.array = true;
                            }
                            p.datatype = type;
                            p.id = match[2];
                            p.refId = this._id(p.id);
                            p.description = sn.documentFragment();
                            sn.copyChildren(dd, p.description);
                            mem.params.push(p);
                        }
                        else {
                            error("Expected parameter definition, got: " + prm);
                            break;
                        }
                    }
                }
                else {
                    while (prm.length) {
                        var p = {};
                        prm = this.parseExtendedAttributes(prm, p);
                        // either up to end of string, or up to ,
                        var re = /^\s*(?:in\s+)?\b([^,]+)\s+\b([^,\s]+)\s*(?:,)?\s*/;
                        var match = re.exec(prm);
                        if (match) {
                            prm = prm.replace(re, "");
                            var type = match[1];
                            p.nullable = false;
                            if (/\?$/.test(type)) {
                                type = type.replace(/\?$/, "");
                                p.nullable = true;
                            }
                            p.array = false;
                            if (/\[\]$/.test(type)) {
                                type = type.replace(/\[\]$/, "");
                                p.array = true;
                            }
                            p.datatype = type;
                            p.id = match[2];
                            p.refId = this._id(p.id);
                            mem.params.push(p);
                        }
                        else {
                            error("Expected parameter list, got: " + prm);
                            break;
                        }
                    }
                }

                // apply optional
                var isOptional = false;
                for (var i = 0; i < mem.params.length; i++) {
                    var p = mem.params[i];
                    var pkw = p.datatype.split(/\s+/);
                    var idx = pkw.indexOf("optional");
                    if (idx > -1) {
                        isOptional = true;
                        pkw.splice(idx, 1);
                        p.datatype = pkw.join(" ");
                    }
                    p.optional = isOptional;
                }

                return mem;
            }

            // NOTHING MATCHED
            error("Expected interface member, got: " + str);
        },

        parseExtendedAttributes:    function (str, obj) {
            str = str.replace(/^\s*\[([^\]]+)\]\s+/, function (x, m1) { obj.extendedAttributes = m1; return ""; });
            return str;
        },

        makeMarkup:    function () {
            var df = sn.documentFragment();
            var pre = sn.element("pre", { "class": "idl" }, df);
            pre.innerHTML = this.writeAsWebIDL(this.parent, 0);
            df.appendChild(this.writeAsHTML(this.parent));
            return df;
        },

        writeAsHTML:    function (obj) {
            if (obj.type == "module") {
                if (obj.id == "outermost") {
                    if (obj.children.length > 1) error("We currently only support one structural level per IDL fragment");
                    return this.writeAsHTML(obj.children[0]);
                }
                else {
                    warning("No HTML can be generated for module definitions.");
                    return sn.element("span");
                }
            }
            else if (obj.type == "typedef") {
                var cnt;
                if (obj.description && obj.description.childNodes.length) {
                    cnt = [obj.description];
                }
                else {
                    // yuck -- should use a single model...
                    var tdt = sn.element("span", { "class": "idlTypedefType" }, null);
                    tdt.innerHTML = this.writeDatatype(obj.datatype);
                    cnt = [ sn.text("Throughout this specification, the identifier "),
                            sn.element("span", { "class": "idlTypedefID" }, null, obj.id),
                            sn.text(" is used to refer to the "),
                            sn.text(obj.array ? "array of " : ""),
                            tdt,
                            sn.text(obj.nullable ? " (nullable)" : ""),
                            sn.text(" type.")];
                }
                return sn.element("div", { "class": "idlTypedefDesc" }, null, cnt);
            }
            else if (obj.type == "implements") {
                var cnt;
                if (obj.description && obj.description.childNodes.length) {
                    cnt = [obj.description];
                }
                else {
                    cnt = [ sn.text("All instances of the "),
                            sn.element("code", {}, null, [sn.element("a", {}, null, obj.id)]),
                            sn.text(" type are defined to also implement the "),
                            sn.element("a", {}, null, obj.datatype),
                            sn.text(" interface.")];
                    cnt = [sn.element("p", {}, null, cnt)];
                }
                return sn.element("div", { "class": "idlImplementsDesc" }, null, cnt);
            }

            else if (obj.type == "exception") {
                var df = sn.documentFragment();
                var curLnk = "widl-" + obj.refId + "-";
                var types = ["field", "constant"];
                var filterFunc = function (it) { return it.type == type; }
                ,   sortFunc = function (a, b) {
                        if (a.id < b.id) return -1;
                        if (a.id > b.id) return 1;
                        return 0;
                }
                ;
                for (var i = 0; i < types.length; i++) {
                    var type = types[i];
                    var things = obj.children.filter(filterFunc);
                    if (things.length === 0) continue;
                    if (!this.noIDLSorting) {
                        things.sort(sortFunc);
                    }

                    var sec = sn.element("section", {}, df);
                    var secTitle = type;
                    secTitle = secTitle.substr(0, 1).toUpperCase() + secTitle.substr(1) + "s";
                    sn.element("h2", {}, sec, secTitle);
                    var dl = sn.element("dl", { "class": type + "s" }, sec);
                    for (var j = 0; j < things.length; j++) {
                        var it = things[j];
                        var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                        sn.element("code", {}, dt, it.id);
                        var desc = sn.element("dd", {}, dl, [it.description]);
                        if (type == "field") {
                            sn.text(" of type ", dt);
                            if (it.array) sn.text("array of ", dt);
                            var span = sn.element("span", { "class": "idlFieldType" }, dt);
                            var matched = /^sequence<(.+)>$/.exec(it.datatype);
                            if (matched) {
                                sn.text("sequence<", span);
                                sn.element("a", {}, span, matched[1]);
                                sn.text(">", span);
                            }
                            else {
                                sn.element("a", {}, span, it.datatype);
                            }
                            if (it.nullable) sn.text(", nullable", dt);
                        }
                        else if (type == "constant") {
                            sn.text(" of type ", dt);
                            sn.element("span", { "class": "idlConstType" }, dt, [sn.element("a", {}, null, it.datatype)]);
                            if (it.nullable) sn.text(", nullable", dt);
                        }
                    }
                }
                return df;
            }

            else if (obj.type == "dictionary") {
                var df = sn.documentFragment();
                var curLnk = "widl-" + obj.refId + "-";
                var things = obj.children;
                var cnt;
                if (things.length === 0) return df;
                if (!this.noIDLSorting) {
                    things.sort(function (a, b) {
                        if (a.id < b.id) return -1;
                        if (a.id > b.id) return 1;
                          return 0;
                    });
                }

                var sec = sn.element("section", {}, df);
                cnt = [sn.text("Dictionary "),
                       sn.element("a", { "class": "idlType" }, null, obj.id),
                       sn.text(" Members")];
                sn.element("h2", {}, sec, cnt);
                var dl = sn.element("dl", { "class": "dictionary-members" }, sec);
                for (var j = 0; j < things.length; j++) {
                    var it = things[j];
                    var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                    sn.element("code", {}, dt, it.id);
                    var desc = sn.element("dd", {}, dl, [it.description]);
                    sn.text(" of type ", dt);
                    if (it.array) sn.text("array of ", dt);
                    var span = sn.element("span", { "class": "idlMemberType" }, dt);
                    var matched = /^sequence<(.+)>$/.exec(it.datatype);
                    if (matched) {
                        sn.text("sequence<", span);
                        sn.element("a", {}, span, matched[1]);
                        sn.text(">", span);
                    }
                    else {
                        sn.element("a", {}, span, it.datatype);
                    }
                    if (it.nullable) sn.text(", nullable", dt);
                    if (it.defaultValue) {
                        sn.text(", defaulting to ", dt);
                        sn.element("code", {}, dt, [sn.text(it.defaultValue)]);
                    }
                }
                return df;
            }

            else if (obj.type == "callback") {
                var df = sn.documentFragment();
                var curLnk = "widl-" + obj.refId + "-";
                var things = obj.children;
                var cnt;
                if (things.length === 0) return df;

                var sec = sn.element("section", {}, df);
                cnt = [sn.text("Callback "),
                       sn.element("a", { "class": "idlType" }, null, obj.id),
                       sn.text(" Parameters")];
                sn.element("h2", {}, sec, cnt);
                var dl = sn.element("dl", { "class": "callback-members" }, sec);
                for (var j = 0; j < things.length; j++) {
                    var it = things[j];
                    var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                    sn.element("code", {}, dt, it.id);
                    var desc = sn.element("dd", {}, dl, [it.description]);
                    sn.text(" of type ", dt);
                    if (it.array) sn.text("array of ", dt);
                    var span = sn.element("span", { "class": "idlMemberType" }, dt);
                    var matched = /^sequence<(.+)>$/.exec(it.datatype);
                    if (matched) {
                        sn.text("sequence<", span);
                        sn.element("a", {}, span, matched[1]);
                        sn.text(">", span);
                    }
                    else {
                        sn.element("a", {}, span, it.datatype);
                    }
                    if (it.nullable) sn.text(", nullable", dt);
                    if (it.defaultValue) {
                        sn.text(", defaulting to ", dt);
                        sn.element("code", {}, dt, [sn.text(it.defaultValue)]);
                    }
                }
                return df;
            }

            else if (obj.type == "enum") {
                var df = sn.documentFragment();
                var curLnk = "widl-" + obj.refId + "-";
                var things = obj.children;
                if (things.length === 0) return df;

                var sec = sn.element("table", { "class": "simple" }, df);
                sn.element("tr", {}, sec, [sn.element("th", { colspan: 2 }, null, [sn.text("Enumeration description")])]);
                for (var j = 0; j < things.length; j++) {
                    var it = things[j];
                    var tr = sn.element("tr", {}, sec)
                    ,   td1 = sn.element("td", {}, tr)
                    ;
                    sn.element("code", {}, td1, it.id);
                    sn.element("td", {}, tr, [it.description]);
                }
                return df;
            }

            else if (obj.type == "interface") {
                var df = sn.documentFragment();
                var curLnk = "widl-" + obj.refId + "-";
                var types = ["attribute", "method", "constant"];
                var filterFunc = function (it) { return it.type == type; }
                ,   sortFunc = function (a, b) {
                        if (a.id < b.id) return -1;
                        if (a.id > b.id) return 1;
                        return 0;
                    }
                ;
                for (var i = 0; i < types.length; i++) {
                    var type = types[i];
                    var things = obj.children.filter(filterFunc);
                    if (things.length === 0) continue;
                    if (!this.noIDLSorting) {
                        things.sort(sortFunc);
                    }

                    var sec = sn.element("section", {}, df);
                    var secTitle = type;
                    secTitle = secTitle.substr(0, 1).toUpperCase() + secTitle.substr(1) + "s";
                    sn.element("h2", {}, sec, secTitle);
                    var dl = sn.element("dl", { "class": type + "s" }, sec);
                    for (var j = 0; j < things.length; j++) {
                        var it = things[j];
                        var id = (type == "method") ? this.makeMethodID(curLnk, it) : sn.idThatDoesNotExist(curLnk + it.refId);
                        var dt = sn.element("dt", { id: id }, dl);
                        sn.element("code", {}, dt, it.id);
                        var desc = sn.element("dd", {}, dl, [it.description]);
                        if (type == "method") {
                            if (it.params.length) {
                                var table = sn.element("table", { "class": "parameters" }, desc);
                                var tr = sn.element("tr", {}, table);
                                ["Parameter", "Type", "Nullable", "Optional", "Description"].forEach(function (tit) { sn.element("th", {}, tr, tit); });
                                for (var k = 0; k < it.params.length; k++) {
                                    var prm = it.params[k];
                                    var tr = sn.element("tr", {}, table);
                                    sn.element("td", { "class": "prmName" }, tr, prm.id);
                                    var tyTD = sn.element("td", { "class": "prmType" }, tr);
                                    var matched = /^sequence<(.+)>$/.exec(prm.datatype);
                                    if (matched) {
                                        sn.element("code", {}, tyTD, [  sn.text("sequence<"),
                                                                        sn.element("a", {}, null, matched[1]),
                                                                        sn.text(">")]);
                                    }
                                    else {
                                        var cnt = [sn.element("a", {}, null, prm.datatype)];
                                        if (prm.array) cnt.push(sn.text("[]"));
                                        sn.element("code", {}, tyTD, cnt);
                                    }
                                    if (prm.nullable) sn.element("td", { "class": "prmNullTrue" }, tr, "\u2714");
                                    else              sn.element("td", { "class": "prmNullFalse" }, tr, "\u2718");
                                    if (prm.optional) sn.element("td", { "class": "prmOptTrue" }, tr, "\u2714");
                                    else              sn.element("td", { "class": "prmOptFalse" }, tr, "\u2718");
                                    var cnt = prm.description ? [prm.description] : "";
                                    sn.element("td", { "class": "prmDesc" }, tr, cnt);
                                }
                            }
                            else {
                                sn.element("div", {}, desc, [sn.element("em", {}, null, "No parameters.")]);
                            }
                            var reDiv = sn.element("div", {}, desc);
                            sn.element("em", {}, reDiv, "Return type: ");
                            var matched = /^sequence<(.+)>$/.exec(it.datatype);
                            if (matched) {
                                sn.element("code", {}, reDiv, [ sn.text("sequence<"),
                                                                sn.element("a", {}, null, matched[1]),
                                                                sn.text(">")]);
                            }
                            else {
                                var cnt = [sn.element("a", {}, null, it.datatype)];
                                if (it.array) cnt.push(sn.text("[]"));
                                sn.element("code", {}, reDiv, cnt);
                            }
                            if (it.nullable) sn.text(", nullable", reDiv);
                        }
                        else if (type == "attribute") {
                            sn.text(" of type ", dt);
                            if (it.array) sn.text("array of ", dt);
                            var span = sn.element("span", { "class": "idlAttrType" }, dt);
                            var matched = /^sequence<(.+)>$/.exec(it.datatype);
                            if (matched) {
                                sn.text("sequence<", span);
                                sn.element("a", {}, span, matched[1]);
                                sn.text(">", span);
                            }
                            else {
                                sn.element("a", {}, span, it.datatype);
                            }
                            if (it.readonly) sn.text(", readonly", dt);
                            if (it.nullable) sn.text(", nullable", dt);
                        }
                        else if (type == "constant") {
                            sn.text(" of type ", dt);
                            sn.element("span", { "class": "idlConstType" }, dt, [sn.element("a", {}, null, it.datatype)]);
                            if (it.nullable) sn.text(", nullable", dt);
                        }
                    }
                }
                if (typeof obj.merge !== "undefined" && obj.merge.length > 0) {
                    // hackish: delay the execution until the DOM has been initialized, then merge
                    setTimeout(function () {
                        for (var i = 0; i < obj.merge.length; i++) {
                            var idlInterface = document.querySelector("#idl-def-" + obj.refId),
                                idlDictionary = document.querySelector("#idl-def-" + obj.merge[i]);
                            idlDictionary.parentNode.parentNode.removeChild(idlDictionary.parentNode);
                            idlInterface.appendChild(document.createElement("br"));
                            idlInterface.appendChild(idlDictionary);
                        }
                    }, 0);
                }
                return df;
            }
        },

        makeMethodID:    function (cur, obj) {
            var id = cur + obj.refId + "-" + obj.datatype + "-";
            var params = [];
            for (var i = 0, n = obj.params.length; i < n; i++) {
                var prm = obj.params[i];
                params.push(prm.datatype + (prm.array ? "Array" : "") + "-" + prm.id);
            }
            id += params.join("-");
            return sn.sanitiseID(id);
            // return sn.idThatDoesNotExist(id);
        },

        writeAsWebIDL:    function (obj, indent) {
            if (obj.type == "module") {
                if (obj.id == "outermost") {
                    var str = "";
                    for (var i = 0; i < obj.children.length; i++) str += this.writeAsWebIDL(obj.children[i], indent);
                    return str;
                }
                else {
                    var str = "<span class='idlModule'>";
                    if (obj.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>]\n";
                    str += this._idn(indent) + "module <span class='idlModuleID'>" + obj.id + "</span> {\n";
                    for (var i = 0; i < obj.children.length; i++) str += this.writeAsWebIDL(obj.children[i], indent + 1);
                    str += this._idn(indent) + "};</span>\n";
                    return str;
                }
            }
            else if (obj.type == "typedef") {
                var nullable = obj.nullable ? "?" : "";
                var arr = obj.array ? "[]" : "";
                return  "<span class='idlTypedef' id='idl-def-" + obj.refId + "'>typedef <span class='idlTypedefType'>" +
                        this.writeDatatype(obj.datatype) +
                        "</span>" + arr + nullable + " <span class='idlTypedefID'>" + obj.id + "</span>;</span>";
            }
            else if (obj.type == "implements") {
                return  "<span class='idlImplements'><a>" + obj.id + "</a> implements <a>" + obj.datatype + "</a>;";
            }
            else if (obj.type == "interface") {
                var str = "<span class='idlInterface' id='idl-def-" + obj.refId + "'>";
                if (obj.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>]\n";
                str += this._idn(indent);
                if (obj.partial) str += "partial ";
                str += "interface <span class='idlInterfaceID'>" + obj.id + "</span>";
                if (obj.superclasses && obj.superclasses.length) str += " : " +
                                                    obj.superclasses.map(function (it) {
                                                                            return "<span class='idlSuperclass'><a>" + it + "</a></span>";
                                                                        })
                                                                    .join(", ");
                str += " {\n";
                // we process attributes and methods in place
                var maxAttr = 0, maxMeth = 0, maxConst = 0, hasRO = false;
                obj.children.forEach(function (it, idx) {
                    var len = it.datatype.length;
                    if (it.nullable) len = len + 1;
                    if (it.array) len = len + 2;
                    if (it.type == "attribute") maxAttr = (len > maxAttr) ? len : maxAttr;
                    else if (it.type == "method") maxMeth = (len > maxMeth) ? len : maxMeth;
                    else if (it.type == "constant") maxConst = (len > maxConst) ? len : maxConst;
                    if (it.type == "attribute" && it.readonly) hasRO = true;
                });
                var curLnk = "widl-" + obj.refId + "-";
                for (var i = 0; i < obj.children.length; i++) {
                    var ch = obj.children[i];
                    if (ch.type == "attribute") str += this.writeAttribute(ch, maxAttr, indent + 1, curLnk, hasRO);
                    else if (ch.type == "method") str += this.writeMethod(ch, maxMeth, indent + 1, curLnk);
                    else if (ch.type == "constant") str += this.writeConst(ch, maxConst, indent + 1, curLnk);
                }
                str += this._idn(indent) + "};</span>\n";
                return str;
            }
            else if (obj.type == "exception") {
                var str = "<span class='idlException' id='idl-def-" + obj.refId + "'>";
                if (obj.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>]\n";
                str += this._idn(indent) + "exception <span class='idlExceptionID'>" + obj.id + "</span> {\n";
                var maxAttr = 0, maxConst = 0;
                obj.children.forEach(function (it, idx) {
                    var len = it.datatype.length;
                    if (it.nullable) len = len + 1;
                    if (it.array) len = len + 2;
                    if (it.type == "field")   maxAttr = (len > maxAttr) ? len : maxAttr;
                    else if (it.type == "constant") maxConst = (len > maxConst) ? len : maxConst;
                });
                var curLnk = "widl-" + obj.refId + "-";
                for (var i = 0; i < obj.children.length; i++) {
                    var ch = obj.children[i];
                    if (ch.type == "field") str += this.writeField(ch, maxAttr, indent + 1, curLnk);
                    else if (ch.type == "constant") str += this.writeConst(ch, maxConst, indent + 1, curLnk);
                }
                str += this._idn(indent) + "};</span>\n";
                return str;
            }
            else if (obj.type == "dictionary") {
                var str = "<span class='idlDictionary' id='idl-def-" + obj.refId + "'>";
                if (obj.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>]\n";
                str += this._idn(indent) + "dictionary <span class='idlDictionaryID'>" + obj.id + "</span>";
                if (obj.superclasses && obj.superclasses.length) str += " : " +
                                                    obj.superclasses.map(function (it) {
                                                                            return "<span class='idlSuperclass'><a>" + it + "</a></span>";
                                                                        })
                                                                    .join(", ");
                str += " {\n";
                var max = 0;
                obj.children.forEach(function (it, idx) {
                    var len = it.datatype.length;
                    if (it.nullable) len = len + 1;
                    if (it.array) len = len + 2;
                    max = (len > max) ? len : max;
                });
                var curLnk = "widl-" + obj.refId + "-";
                for (var i = 0; i < obj.children.length; i++) {
                    var ch = obj.children[i];
                    str += this.writeMember(ch, max, indent + 1, curLnk);
                }
                str += this._idn(indent) + "};</span>\n";
                return str;
            }
            else if (obj.type == "callback") {
                var str = "<span class='idlCallback' id='idl-def-" + obj.refId + "'>";
                if (obj.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>]\n";
                str += this._idn(indent) + "callback <span class='idlCallbackID'>" + obj.id + "</span>";
                str += " = ";
                var nullable = obj.nullable ? "?" : "";
                var arr = obj.array ? "[]" : "";
                str += "<span class='idlCallbackType'>" + this.writeDatatype(obj.datatype) + arr + nullable + "</span> ";
                str += "(";

                var self = this;
                str += obj.children.map(function (it) {
                                            var nullable = it.nullable ? "?" : "";
                                            var optional = it.optional ? "optional " : "";
                                            var arr = it.array ? "[]" : "";
                                            var prm = "<span class='idlParam'>";
                                            if (it.extendedAttributes) prm += "[<span class='extAttr'>" + it.extendedAttributes + "</span>] ";
                                            prm += optional + "<span class='idlParamType'>" + self.writeDatatype(it.datatype) + arr + nullable + "</span> " +
                                            "<span class='idlParamName'>" + it.id + "</span>" +
                                            "</span>";
                                            return prm;
                                        })
                                  .join(", ");
                str += ");</span>\n";
                return str;
            }
            else if (obj.type == "enum") {
                var str = "<span class='idlEnum' id='idl-def-" + obj.refId + "'>";
                if (obj.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>]\n";
                str += this._idn(indent) + "enum <span class='idlEnumID'>" + obj.id + "</span> {\n";

                for (var i = 0; i < obj.children.length; i++) {
                    var ch = obj.children[i];
                    str += this._idn(indent + 1) + '"<span class="idlEnumItem">' + ch.id + '</span>"';
                    if (i < obj.children.length - 1) str += ",";
                    str += "\n";
                }
                str += this._idn(indent) + "};</span>\n";
                return str;
            }
        },

        writeField:    function (attr, max, indent, curLnk) {
            var str = "<span class='idlField'>";
            if (attr.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + attr.extendedAttributes + "</span>]\n";
            str += this._idn(indent);
            var pad = max - attr.datatype.length;
            if (attr.nullable) pad = pad - 1;
            if (attr.array) pad = pad - 2;
            var nullable = attr.nullable ? "?" : "";
            var arr = attr.array ? "[]" : "";
            str += "<span class='idlFieldType'>" + this.writeDatatype(attr.datatype) + arr + nullable + "</span> ";
            for (var i = 0; i < pad; i++) str += " ";
            str += "<span class='idlFieldName'><a href='#" + curLnk + attr.refId + "'>" + attr.id + "</a></span>";
            str += ";</span>\n";
            return str;
        },

        writeAttribute:    function (attr, max, indent, curLnk, hasRO) {
            var sets = [], gets = [];
            if (attr.raises.length) {
                for (var i = 0; i < attr.raises.length; i++) {
                    var exc = attr.raises[i];
                    if (exc.onGet) gets.push(exc);
                    if (exc.onSet) sets.push(exc);
                }
            }

            var str = "<span class='idlAttribute'>";
            if (attr.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + attr.extendedAttributes + "</span>]\n";
            str += this._idn(indent);
            if (hasRO) {
                if (attr.readonly) str += "readonly ";
                else               str += "         ";
            }
            str += "attribute ";
            var pad = max - attr.datatype.length;
            if (attr.nullable) pad = pad - 1;
            if (attr.array) pad = pad - 2;
            var nullable = attr.nullable ? "?" : "";
            var arr = attr.array ? "[]" : "";
            str += "<span class='idlAttrType'>" + this.writeDatatype(attr.datatype) + arr + nullable + "</span> ";
            for (var i = 0; i < pad; i++) str += " ";
            str += "<span class='idlAttrName'><a href='#" + curLnk + attr.refId + "'>" + attr.id + "</a></span>";
            str += ";</span>\n";
            return str;
        },

        writeMethod:    function (meth, max, indent, curLnk) {
            var str = "<span class='idlMethod'>";
            if (meth.extendedAttributes) str += this._idn(indent) + "[<span class='extAttr'>" + meth.extendedAttributes + "</span>]\n";
            str += this._idn(indent);
            var pad = max - meth.datatype.length;
            if (meth.nullable) pad = pad - 1;
            if (meth.array) pad = pad - 2;
            var nullable = meth.nullable ? "?" : "";
            var arr = meth.array ? "[]" : "";
            str += "<span class='idlMethType'>" + this.writeDatatype(meth.datatype) + arr + nullable + "</span> ";
            for (var i = 0; i < pad; i++) str += " ";
            var id = this.makeMethodID(curLnk, meth);
            // str += "<span class='idlMethName'><a href='#" + curLnk + meth.refId + "'>" + meth.id + "</a></span> (";
            str += "<span class='idlMethName'><a href='#" + id + "'>" + meth.id + "</a></span> (";
            var obj = this;
            str += meth.params.map(function (it) {
                                        var nullable = it.nullable ? "?" : "";
                                        var optional = it.optional ? "optional " : "";
                                        var arr = it.array ? "[]" : "";
                                        var prm = "<span class='idlParam'>";
                                        if (it.extendedAttributes) prm += "[<span class='extAttr'>" + it.extendedAttributes + "</span>] ";
                                        prm += optional + "<span class='idlParamType'>" + obj.writeDatatype(it.datatype) + arr + nullable + "</span> " +
                                        "<span class='idlParamName'>" + it.id + "</span>" +
                                        "</span>";
                                        return prm;
                                    })
                              .join(", ");
            str += ")";
            // if (meth.raises.length) {
            //     str += " raises ("
            //     str += meth.raises.map(function (it) { return "<span class='idlRaises'><a>" + it.id + "</a></span>"; })
            //                       .join(", ");
            //     str += ")";
            // }
            str += ";</span>\n";
            return str;
        },

        writeConst:    function (cons, max, indent, curLnk) {
            var str = "<span class='idlConst'>";
            str += this._idn(indent);
            str += "const ";
            var pad = max - cons.datatype.length;
            if (cons.nullable) pad = pad - 1;
            var nullable = cons.nullable ? "?" : "";
            str += "<span class='idlConstType'><a>" + cons.datatype + "</a>" + nullable + "</span> ";
            for (var i = 0; i < pad; i++) str += " ";
            str += "<span class='idlConstName'><a href='#" + curLnk + cons.refId + "'>" + cons.id + "</a></span> = " +
                   "<span class='idlConstValue'>" + cons.value + "</span>;</span>\n";
            return str;
        },

        writeMember:    function (memb, max, indent, curLnk) {
            var str = "<span class='idlMember'>";
            str += this._idn(indent);
            var pad = max - memb.datatype.length;
            if (memb.nullable) pad = pad - 1;
            if (memb.array) pad = pad - 2;
            var nullable = memb.nullable ? "?" : "";
            var arr = memb.array ? "[]" : "";
            str += "<span class='idlMemberType'>" + this.writeDatatype(memb.datatype) + arr + nullable + "</span> ";
            for (var i = 0; i < pad; i++) str += " ";
            str += "<span class='idlMemberName'><a href='#" + curLnk + memb.refId + "'>" + memb.id + "</a></span>";
            if (memb.defaultValue) str += " = <span class='idlMemberValue'>" + memb.defaultValue + "</span>";
            str += ";</span>\n";
            return str;
        },

        writeDatatype:    function (dt) {
            // if (/sequence/.test(dt) || /dict/.test(dt)) {
                // console.log(dt);
            // }
            var matched = /^sequence<(.+)>$/.exec(dt);
            if (matched) {
                return "sequence&lt;<a>" + matched[1] + "</a>&gt;";
            }
            else {
                return "<a>" + dt + "</a>";
            }
        },

        _idn:    function (lvl) {
            var str = "";
            for (var i = 0; i < lvl; i++) str += "    ";
            return str;
        },

        // XXX make this generally available (refactoring)
        _norm:    function (str) {
            str = str.replace(/^\s+/, "").replace(/\s+$/, "");
            return str.split(/\s+/).join(" ");
        },

        _id:    function (id) {
            return id.replace(/[^a-zA-Z_\-]/g, "");
        }
    };
}());
// EORESPEC

// XPATH
// ReSpec XPath substitute JS workaround for UA's without DOM L3 XPath support
// By Travis Leithead (travil AT microsoft dotcom)
// (select APIs and behaviors specifically for ReSpec's usage of DOM L3 XPath; no more an no less)
// For IE, requires v.9+
(function () {
    if (!document.evaluate) {
        //////////////////////////////////////
        // interface XPathResult
        //////////////////////////////////////
        // Augments a generic JS Array to appear to be an XPathResult (thus allowing [] notation to work)
        window.XPathResult = function (list) {
            list.snapshotLength = list.length;
            list.snapshotItem = function (index) { return this[index]; };
            return list;
        };
        window.XPathResult.prototype.ORDERED_NODE_SNAPSHOT_TYPE = 7;
        window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7;

        //////////////////////////////////////
        // interface XPathEvaluator
        //////////////////////////////////////
        // Not exposed to the window (not needed)
        var XPathEvaluator = function (assignee) {
            var findElementsContainingContextNode = function (element, contextNode) {
                var allUpList = document.querySelectorAll(element);
                var resultSet = [];
                for (var i = 0, len = allUpList.length; i < len; i++) {
                    if (allUpList[i].compareDocumentPosition(contextNode) & 16)
                        resultSet.push(allUpList[i]);
                }
                return resultSet;
            };
            var allTextCache = null;
            var buildTextCacheUnderBody = function () {
                if (allTextCache == null) {
                    var iter = document.createNodeIterator(document.body, 4, function () { return 1; }, false);
                    allTextCache = [];
                    var n;
                    while (n = iter.nextNode()) {
                        allTextCache.push(n);
                    }
                }
                // Note: no cache invalidation for dynamic updates...
            };
            var getAllTextNodesUnderContext = function (contextNode) {
                buildTextCacheUnderBody();
                var candidates = [];
                for (var i = 0, len = allTextCache.length; i < len; i++) {
                    if (allTextCache[i].compareDocumentPosition(contextNode) & 8)
                        candidates.push(allTextCache[i]);
                }
                return candidates;
            };
            var findAncestorsOfContextNode = function (element, contextNode) {
                var allUpList = document.querySelectorAll(element);
                var candidates = [];
                for (var i = 0, len = allUpList.length; i < len; i++) {
                    if (allUpList[i].compareDocumentPosition(contextNode) & 16)
                        candidates.push(allUpList[i]);
                }
                return candidates;
            };
            var findSpecificChildrenOfContextNode = function (contextNode, selector) { // element.querySelectorAll(":scope > "+elementType)
                var allUpList = contextNode.querySelectorAll(selector);
                // Limit to children only...
                var candidates = [];
                for (var i = 0, len = allUpList.length; i < len; i++) {
                    if (allUpList[i].parentNode == contextNode)
                        candidates.push(allUpList[i]);
                }
                return candidates;
            };
            assignee.evaluate = function (xPathExpression, contextNode, resolverCallback, type, result) {
                // "ancestor::x:section|ancestor::section", sec
                if (xPathExpression == "ancestor::x:section|ancestor::section") // e.g., "section :scope" (but matching section)
                    return XPathResult(findElementsContainingContextNode("section", contextNode));
                else if (xPathExpression == "./x:section|./section") // e.g., ":scope > section"
                    return XPathResult(findSpecificChildrenOfContextNode(contextNode, "section"));
                else if (xPathExpression == "./x:section[not(@class='introductory')]|./section[not(@class='introductory')]") // e.g., ":scope > section:not([class='introductory'])"
                    return XPathResult(findSpecificChildrenOfContextNode(contextNode, "section:not([class='introductory'])"));
                else if (xPathExpression == ".//text()") // Not possible via Selectors API. Note that ":contains("...") can be used to find particular element containers of text
                    return XPathResult(getAllTextNodesUnderContext(contextNode));
                else if ((xPathExpression == "ancestor::abbr") || (xPathExpression == "ancestor::acronym")) // e.g., "abbr :scope, acronym :scope" (but match the element, not the scope)
                    return XPathResult(findAncestorsOfContextNode((xPathExpression == "ancestor::abbr") ? "abbr" : "acronym", contextNode));
                else if (xPathExpression == "./dt") // e.g., ":scope > dt"
                    return XPathResult(findSpecificChildrenOfContextNode(contextNode, "dt"));
                else if (xPathExpression == "dl[@class='parameters']")
                    return XPathResult(contextNode.querySelectorAll("dl[class='parameters']"));
                else if (xPathExpression == "*[@class='exception']")
                    return XPathResult(contextNode.querySelectorAll("[class='exception']"));
                else // Anything else (not supported)
                    return XPathResult([]);
            };
        };
        // Document implements XPathExpression
        if (window.Document) {
            XPathEvaluator(Document.prototype);
        }
        else // no prototype hierarchy support (or Document doesn't exist)
            XPathEvaluator(window.document);
    }
}());
// EOXPATH

define([], function () {
    return {
        run:    function (conf, doc, cb, msg) {
            msg.pub("start", "w3c/legacy");
            (new berjon.respec()).loadAndRun(cb, msg, conf, doc, cb, msg);
        }
    };
});
