/*global berjon, respecEvents, respecConfig */

// RESPEC
var sn;
(function () {
    window.setBerjonBiblio = function(payload) {
        berjon.biblio = payload;
    };
    if (typeof berjon === 'undefined') window.berjon = {};
    function error (str) {
        if (window.respecEvents) respecEvents.pub("error", str);
    }
    berjon.respec = function () {};
    berjon.respec.prototype = {
        loadAndRun:    function (conf, doc, cb, msg) {
            var count = 0;
            var base = this.findBase();
            var deps = [base + "js/simple-node.js"];
            var obj = this;

            function callback() {
                if (count <= 0) {
                    sn = new berjon.simpleNode({
                        "":     "http://www.w3.org/1999/xhtml",
                        "x":    "http://www.w3.org/1999/xhtml"
                    }, document);
                    obj.run(conf, doc, cb, msg);
                }
            }

            function loadHandler() {
                count--;
                callback();
            }

            var src, refs = this.getRefKeys(conf);
            refs = refs.normativeReferences.concat(refs.informativeReferences).concat(this.findLocalAliases(conf));
            if (refs.length) {
                count++;
                src = conf.httpScheme + "://specref.jit.su/bibrefs?callback=setBerjonBiblio&refs=" + refs.join(',');
                this.loadScript(src, loadHandler);
            }

            // the fact that we hand-load is temporary, and will be fully replaced by RequireJS
            // in the meantime, we need to avoid loading these if we are using the built (bundled)
            // version. So we do some basic detection and decline to load.
            if (!berjon.simpleNode) {
                for (var i = 0; i < deps.length; i++) {
                    count++;
                    this.loadScript(deps[i], loadHandler);
                }
            }

            callback();
        },
        findLocalAliases: function(conf) {
            var res = [];
            if (conf.localBiblio) {
                for (var k in conf.localBiblio) {
                    if (typeof conf.localBiblio[k].aliasOf !== 'undefined') {
                        res.push(conf.localBiblio[k].aliasOf);
                    }
                }
            }
            return res;
        },
        findBase: function() {
            var scripts = document.querySelectorAll("script[src]");
            // XXX clean this up
            var base = "", src;
            for (var i = 0; i < scripts.length; i++) {
                src = scripts[i].src;
                if (/\/js\/require.*\.js$/.test(src)) {
                    base = src.replace(/js\/require.*\.js$/, "");
                }
            }
            // base = respecConfig.respecBase;
            return base;
        },

        loadScript: function(src, cb) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.setAttribute("class", "remove");
            script.onload = cb;
            document.getElementsByTagName('head')[0].appendChild(script);
        },

        run:    function (conf, doc, cb, msg) {
            try {
                this.extractConfig();
                this.overrideBiblio(conf);
                this.bibref(conf, doc, cb, msg);

                if (this.doRDFa) this.makeRDFa();
            }
            catch (e) {
                msg.pub("error", "Processing error: " + e);
            }
            msg.pub("end", "w3c/legacy");
            cb();
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

        // --- METADATA -------------------------------------------------------
        extractConfig:    function () {
            var cfg = respecConfig || {};
            // note this change - the default is now to inject RDFa 1.1.  You can override it by
            // setting RDFa to false
            if (cfg.doRDFa === undefined) cfg.doRDFa = "1.1";
            for (var k in cfg) {
                if (cfg.hasOwnProperty(k)) this[k] = cfg[k];
            }
        },

        getRefKeys:    function (conf) {
            var informs = conf.informativeReferences
            ,   norms = conf.normativeReferences
            ,   del = []
            ;

            function getKeys(obj) {
                var res = [];
                for (var k in obj) res.push(k);
                return res;
            }

            for (var k in informs) if (norms[k]) del.push(k);
            for (var i = 0; i < del.length; i++) delete informs[del[i]];

            return {
                informativeReferences: getKeys(informs),
                normativeReferences: getKeys(norms)
            };
        },

        // --- INLINE PROCESSING ----------------------------------------------------------------------------------
        bibref:    function (conf) {
            // this is in fact the bibref processing portion
            var badrefs = {}
            ,   refs = this.getRefKeys(conf)
            ,   informs = refs.informativeReferences
            ,   norms = refs.normativeReferences
            ,   aliases = {}
            ;

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
                        dd.innerHTML = "<em>Reference not found.</em>\n";
                    }
                }
            }
            for (var k in aliases) {
                if (aliases[k].length > 1) {
                    respecEvents.pub("warn", "[" + k + "] is referenced in " + aliases[k].length + " ways (" + aliases[k].join(", ") + "). This causes duplicate entries in the reference section.");
                }
            }

            for (var item in badrefs) {
                if (badrefs.hasOwnProperty(item)) error("Bad reference: [" + item + "] (appears " + badrefs[item] + " times)");
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
            "PER": "W3C Proposed Edited Recommendation",
            "REC": "W3C Recommendation"
        }
    };
}());
// EORESPEC

define([], function () {
    return {
        run:    function (conf, doc, cb, msg) {
            msg.pub("start", "w3c/legacy");
            (new berjon.respec()).loadAndRun(conf, doc, cb, msg);
        }
    };
});
