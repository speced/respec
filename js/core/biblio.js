
// Module core/biblio
// Handles bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

define(
    [],
    function () {
        var getRefKeys = function (conf) {
            var informs = conf.informativeReferences
            ,   norms = conf.normativeReferences
            ,   del = []
            ,   getKeys = function (obj) {
                    var res = [];
                    for (var k in obj) res.push(k);
                    return res;
                }
            ;
            for (var k in informs) if (norms[k]) del.push(k);
            for (var i = 0; i < del.length; i++) delete informs[del[i]];
            return {
                informativeReferences: getKeys(informs),
                normativeReferences: getKeys(norms)
            };
        };
        var REF_STATUSES = {
            "NOTE":     "W3C Note"
        ,   "WG-NOTE":  "W3C Working Group Note"
        ,   "ED":       "W3C Editor's Draft"
        ,   "FPWD":     "W3C First Public Working Draft"
        ,   "WD":       "W3C Working Draft"
        ,   "LCWD":     "W3C Last Call Working Draft"
        ,   "CR":       "W3C Candidate Recommendation"
        ,   "PR":       "W3C Proposed Recommendation"
        ,   "PER":      "W3C Proposed Edited Recommendation"
        ,   "REC":      "W3C Recommendation"
        };
        var stringifyRef = function(ref) {
            if (typeof ref === "string") return ref;
            var output = "";
            if (ref.authors && ref.authors.length) {
                output += ref.authors.join("; ");
                if (ref.etAl) output += " et al";
                output += ". ";
            }
            output += '<a href="' + ref.href + '"><cite>' + ref.title + "</cite></a>. ";
            if (ref.date) output += ref.date + ". ";
            if (ref.status) output += (REF_STATUSES[ref.status] || ref.status) + ". ";
            output += 'URL: <a href="' + ref.href + '">' + ref.href + "</a>";
            return output;
        };
        var bibref = function (conf, msg) {
            // this is in fact the bibref processing portion
            var badrefs = {}
            ,   refs = getRefKeys(conf)
            ,   informs = refs.informativeReferences
            ,   norms = refs.normativeReferences
            ,   aliases = {}
            ;

            if (!informs.length && !norms.length && !conf.refNote) return;
            var $refsec = $("<section id='references' class='appendix'><h2>References</h2></section>").appendTo($("body"));
            if (conf.refNote) $("<p></p>").html(conf.refNote).appendTo($refsec);

            var types = ["Normative", "Informative"];
            for (var i = 0; i < types.length; i++) {
                var type = types[i]
                ,   refs = (type == "Normative") ? norms : informs;
                if (!refs.length) continue;
                var $sec = $("<section><h3></h3></section>")
                                .appendTo($refsec)
                                .find("h3")
                                    .text(type + " references")
                                .end()
                                ;
                $sec.makeID(null, type + " references");
                refs.sort();
                var $dl = $("<dl class='bibliography'></dl>").appendTo($sec);
                if (conf.doRDFa !== false) $dl.attr("about", "");
                for (var j = 0; j < refs.length; j++) {
                    var ref = refs[j];
                    $("<dt></dt>")
                        .attr({ id:"bib-" + ref })
                        .text("[" + ref + "]")
                        .appendTo($dl)
                        ;
                    var $dd = $("<dd></dd>").appendTo($dl);
                    if (this.doRDFa !== false) {
                        if (type === "Normative") $dd.attr("rel", "dcterms:requires");
                        else $dd.attr("rel", "dcterms:references");
                    }
                    var refcontent = conf.biblio[ref]
                    ,   circular = {}
                    ,   key = ref;
                    circular[ref] = true;
                    while (refcontent && refcontent.aliasOf) {
                        if (circular[refcontent.aliasOf]) {
                            refcontent = null;
                            msg.pub("error", "Circular reference in biblio DB between [" + ref + "] and [" + key + "].");
                        }
                        else {
                            key = refcontent.aliasOf;
                            refcontent = conf.biblio[key];
                            circular[key] = true;
                        }
                    }
                    aliases[key] = aliases[key] || [];
                    if (aliases[key].indexOf(ref) < 0) aliases[key].push(ref);
                    if (refcontent) {
                        $dd.html(stringifyRef(refcontent) + "\n");
                    }
                    else {
                        if (!badrefs[ref]) badrefs[ref] = 0;
                        badrefs[ref]++;
                        $dd.html("<em style='color: #f00'>Reference not found.</em>\n");
                    }
                }
            }
            for (var k in aliases) {
                if (aliases[k].length > 1) {
                    msg.pub("warn", "[" + k + "] is referenced in " + aliases[k].length + " ways (" + aliases[k].join(", ") + "). This causes duplicate entries in the reference section.");
                }
            }
            for (var item in badrefs) {
                if (badrefs.hasOwnProperty(item)) msg.pub("error", "Bad reference: [" + item + "] (appears " + badrefs[item] + " times)");
            }
        };
        
        return {
            stringifyRef: stringifyRef,
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/biblio");
                var refs = getRefKeys(conf)
                ,   localAliases = []
                ,   finish = function () {
                        msg.pub("end", "core/biblio");
                        cb();
                    }
                ;
                if (conf.localBiblio) {
                    for (var k in conf.localBiblio) {
                        if (typeof conf.localBiblio[k].aliasOf !== "undefined") {
                            localAliases.push(conf.localBiblio[k].aliasOf);
                        }
                    }
                }
                refs = refs.normativeReferences
                                .concat(refs.informativeReferences)
                                .concat(localAliases);
                if (refs.length) {
                    var url = "https://specref.jit.su/bibrefs?refs=" + refs.join(",");
                    $.ajax({
                        dataType:   "json"
                    ,   url:        url
                    ,   success:    function (data) {
                            conf.biblio = data || {};
                            // override biblio data
                            if (conf.localBiblio) {
                                for (var k in conf.localBiblio) conf.biblio[k] = conf.localBiblio[k];
                            }
                            bibref(conf, msg);
                            finish();
                        }
                    ,   error:      function (xhr, status, error) {
                            msg.pub("error", "Error loading references from '" + url + "': " + status + " (" + error + ")");
                            finish();
                        }
                    });
                }
                else finish();
            }
        };
    }
);
