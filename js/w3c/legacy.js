// these options are there for the XPath emulation code, which uses them
// they can be dropped when it is (same for global Document)
/*jshint
    bitwise: false,
    boss:   true
*/
/*global berjon, respecEvent, shortcut, respecConfig, Document */

// RESPEC
var sn;
(function () {
    if (typeof(berjon) == "undefined") window.berjon = {};
    function _errEl () {
        var id = "respec-err";
        var err = document.getElementById(id);
        if (err) return err.firstElementChild.nextElementSibling;
        err = sn.element("div",
                            { id: id,
                              style: "position: fixed; width: 350px; top: 10px; right: 10px; border: 3px double #f00; background: #fff",
                              "class": "removeOnSave" },
                            document.body);
        
        var hide = sn.element("p", {
            style: "float: right; margin: 2px; text-decoration: none"
        }, err);
        
        sn.text('[', hide);
        
        var a = sn.element("a", { href: "#" }, hide, 'x');
        
        a.onclick = function() {
            document.getElementById(id).style.display = 'none';
            return false;
        };
        
        sn.text(']', hide);
        
        return sn.element("ul", { style: "clear: both"}, err);
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
                this.overrideBiblio(conf);
                this.bibref(conf, doc, cb, msg);

                if (this.doRDFa) this.makeRDFa();

                // shortcuts
                var obj = this;
                shortcut.add("Ctrl+Shift+Alt+S", function () { obj.showSaveOptions(); });
                shortcut.add("Esc", function () { obj.hideSaveOptions(); });
            }
            catch (e) {
                msg.pub("error", "Processing error: " + e);
            }
        },
        
        overrideBiblio:     function (conf) {
            if (conf.localBiblio) {
                for (var k in conf.localBiblio) berjon.biblio[k] = conf.localBiblio[k];
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
            var cmt = document.createComment("[if lt IE 9]><script src='" + respecConfig.httpScheme + "://www.w3.org/2008/site/js/html5shiv.js'></script><![endif]");
            $("head").append(cmt);
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
                str += " typeof=\"bibo:Document\"";
            }
            str += ">\n";
            // walk the entire DOM tree grabbing nodes and emitting them - possibly modifying them
            // if they need the funny closing tag
            var pRef = this ;
            var selfClosing = {};
            "br img input area base basefont col isindex link meta param hr".split(" ").forEach(function (n) {
                selfClosing[n] = true;
            });
            var noEsc = [false];
            var cmt = document.createComment("[if lt IE 9]><script src='" + respecConfig.httpScheme + "://www.w3.org/2008/site/js/html5shiv.js'></script><![endif]");
            $("head").append(cmt);
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
                    out += "\n<!--" + node.nodeValue + "-->\n";
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
            if (!cfg.diffTool) cfg.diffTool = 'http://www5.aptest.com/standards/htmldiff/htmldiff.pl';
            if (!cfg.doRDFa) cfg.doRDFa = false;
            for (var k in cfg) {
                if (cfg.hasOwnProperty(k)) this[k] = cfg[k];
            }
        },

        // --- INLINE PROCESSING ----------------------------------------------------------------------------------
        bibref:    function (conf, doc, cb, msg) {
            // this is in fact the bibref processing portion
            var badrefs = {}
            ,   badrefcount = 0
            ,   informs = conf.informativeReferences
            ,   norms = conf.normativeReferences
            ,   aliases = {}
            ;

            function getKeys(obj) {
                var res = [];
                for (var k in obj) res.push(k);
                return res;
            }

            var del = [];
            for (var k in informs) if (norms[k]) del.push(k);
            for (var i = 0; i < del.length; i++) delete informs[del[i]];

            informs = getKeys(informs);
            norms = getKeys(norms);

            if (!informs.length && !norms.length && !this.refNote) return;
            var refsec = sn.element("section", { id: "references", "class": "appendix" }, document.body);
            sn.element("h2", {}, refsec, "References");
            if (this.refNote) {
                var refnote = sn.element("p", {}, refsec);
                refnote.innerHTML = this.refNote;
            }

            var types = ["Normative", "Informative"];
            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                var refs = (type == "Normative") ? norms : informs;
                if (!refs.length) continue;
                var sec = sn.element("section", {}, refsec);
                sn.makeID(sec, null, type + " references");
                sn.element("h3", {}, sec, type + " references");
                refs.sort();
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
                    
                    var refcontent = berjon.biblio[ref],
                        circular = {},
                        key = ref;
                    circular[ref] = true;
                    while (refcontent && refcontent.aliasOf) {
                        if (circular[refcontent.aliasOf]) {
                            refcontent = null;
                            error("Circular reference in biblio DB between [" + ref + "] and [" + key + "].");
                        } else {
                            key = refcontent.aliasOf;
                            refcontent = berjon.biblio[key];
                            circular[key] = true;
                        }
                    }
                    aliases[key] = aliases[key] || [];
                    if (aliases[key].indexOf(ref) < 0) aliases[key].push(ref);
                    
                    if (refcontent) {
                        dd.innerHTML = this.stringifyRef(refcontent) + "\n";
                    } else {
                        if (!badrefs[ref]) badrefs[ref] = 0;
                        badrefs[ref]++;
                        badrefcount++;
                        dd.innerHTML = "<em>Reference not found.</em>\n";
                    }
                }
            }
            for (var k in aliases) {
                if (aliases[k].length > 1) {
                    warning("[" + k + "] is referenced in " + aliases[k].length + " ways (" + aliases[k].join(", ") + "). This causes duplicate entries in the reference section.");
                }
            }
            
            if(badrefcount > 0) {
                error("Got " + badrefcount + " tokens looking like a reference, not in biblio DB: ");
                for (var item in badrefs) {
                    if (badrefs.hasOwnProperty(item)) error("Bad ref: " + item + ", count = " + badrefs[item]);
                }
            }

        },

        stringifyRef: function(ref) {
            if(typeof ref == 'string') return ref;
            var output = '';
            if(ref.authors && ref.authors.length) {
                output += ref.authors.join('; ');
                if(ref.etAl) output += ' et al';
                output += '. ';
            }
            output += '<a href="' + ref.href + '"><cite>' + ref.title + '</cite></a>. ';
            if(ref.date) output += ref.date + '. ';
            if(ref.status) output += this.getRefStatus(ref.status) + '. ';
            output += 'URL: <a href="' + ref.href + '">' + ref.href + '</a>';
            return output;
        },

        getRefStatus: function(status) {
            return this.REF_STATUSES[status] || status;
        },

        REF_STATUSES: {
            "NOTE": "W3C Note",
            "WG-NOTE": "W3C Working Group Note",
            "ED": "W3C Editor's Draft",
            "FPWD": "W3C First Public Working Draft",
            "WD": "W3C Working Draft",
            "LCWD": "W3C Last Call Working Draft",
            "CR": "W3C Candidate Recommendation",
            "PR": "W3C Proposed Recommendation",
            "REC": "W3C Recommendation",
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
