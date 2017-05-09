/*jshint
    forin: false
*/
/*global hb*/

// Module w3c/headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level (required)
//  - specType: the short code for the specification type (required)
//  - shortName: the small name that is used after /TR/ in published reports (required)
//  - editors: an array of people editing the document (at least one is required). People
//      are defined using:
//          - name: the person's name (required)
//          - url: URI for the person's home page
//          - company: the person's company
//          - companyURL: the URI for the person's company
//          - mailto: the person's email
//          - note: a note on the person (e.g. former editor)
//  - authors: an array of people who are contributing authors of the document.
//  - subtitle: a subtitle for the specification
//  - github: a link to the github repository used for the specification
//  - publishDate: the date to use for the publication, default to document.lastModified, and
//      failing that to now. The format is YYYY-MM-DD or a Date object.
//  - previousPublishDate: the date on which the previous version was published.
//  - previousMaturity: the specStatus of the previous version
//  - logos: a list of logos to use instead of the W3C logo, each of which being defined by:
//          - src: the URI to the logo (target of <img src=>)
//          - alt: alternate text for the image (<img alt=>), defaults to "Logo" or "Logo 1", "Logo 2", ...
//            if src is not specified, this is the text of the "logo"
//          - height: optional height of the logo (<img height=>)
//          - width: optional width of the logo (<img width=>)
//          - url: the URI to the organization represented by the logo (target of <a href=>)
//          - id: optional id for the logo, permits custom CSS (wraps logo in <span id=>)
//          - each logo element must specifiy either src or alt
//  - edDraftURI: the URI of the Editor's Draft for this document, if any. Required if
//      specStatus is set to "ED".
//  - additionalCopyrightHolders: a copyright owner in addition to W3C (or the only one if specStatus
//      is unofficial)
//  - overrideCopyright: provides markup to completely override the copyright
//  - thisVersion: the URI to the dated current version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - latestVersion: the URI to the latest (undated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - prevVersion: the URI to the previous (dated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - otherLinks: an array of other links that you might want in the header (e.g., link github, twitter, etc).
//         Example of usage: [{key: "foo", href:"https://b"}, {key: "bar", href:"https://"}].
//         Allowed values are:
//          - key: the key for the <dt> (e.g., "Bug Tracker"). Required.
//          - value: The value that will appear in the <dd> (e.g., "GitHub"). Optional.
//          - href: a URL for the value (e.g., "https://foo.com/issues"). Optional.
//          - class: a string representing CSS classes. Optional.

"use strict";
define(
    [
        "handlebars.runtime"
    ,   "core/utils"
    ,   "core/pubsubhub"
    ,   "templates"
    ],
    function (hb, utils, pubsubhub, tmpls) {
        var headersTmpl = tmpls["headers.html"];
        var sotdTmpl = tmpls["sotd.html"];

        hb.registerHelper("showPeople", function (name, items) {
            // stuff to handle RDFa
            var re = "", rp = "", rm = "", rn = "", rwu = "", rpu = "", bn = "",
            editorid = "", propSeeAlso = "";
            if (this.doRDFa) {
                if (name === "Editor") {
                    bn = "_:editor0";
                    re = " property='bibo:editor' resource='" + bn + "'";
                    rp = " property='rdf:first' typeof='foaf:Person'";
                }
                else if (name === "Author") {
                    rp = " property='dc:contributor' typeof='foaf:Person'";
                }
                rn = " property='foaf:name'";
                rm = " property='foaf:mbox'";
                rwu = " property='foaf:workplaceHomepage'";
                rpu = " property='foaf:homepage'";
                propSeeAlso = " property='rdfs:seeAlso'";
            }
            var ret = "";
            for (var i = 0, n = items.length; i < n; i++) {
                var p = items[i];
                if (p.w3cid) {
                    editorid = " data-editor-id='" + parseInt(p.w3cid, 10) + "'";
                }
                if (this.doRDFa) {
                  ret += "<dd class='p-author h-card vcard' " + re + editorid + "><span" + rp + ">";
                  if (name === "Editor") {
                    // Update to next sequence in rdf:List
                    bn = (i < n - 1) ? ("_:editor" + (i + 1)) : "rdf:nil";
                    re = " resource='" + bn + "'";
                  }
                } else {
                  ret += "<dd class='p-author h-card vcard'" + editorid + ">";
                }
                if (p.url) {
                    if (this.doRDFa) {
                        ret += "<meta" + rn + " content='" + p.name + "'><a class='u-url url p-name fn' " + rpu + " href='" + p.url + "'>" + p.name + "</a>";
                    }
                    else ret += "<a class='u-url url p-name fn' href='" + p.url + "'>" + p.name + "</a>";
                }
                else {
                    ret += "<span" + rn + " class='p-name fn'>" + p.name + "</span>";
                }
                if (p.company) {
                    ret += ", ";
                    if (p.companyURL) ret += "<a" + rwu + " class='p-org org h-org h-card' href='" + p.companyURL + "'>" + p.company + "</a>";
                    else ret += p.company;
                }
                if (p.mailto) {
                    ret += ", <span class='ed_mailto'><a class='u-email email' " + rm + " href='mailto:" + p.mailto + "'>" + p.mailto + "</a></span>";
                }
                if (p.note) ret += " (" + p.note + ")";
                if (p.extras) {
                    var self = this;
                    var resultHTML = p.extras
                      // Remove empty names
                      .filter(function (extra) {
                        return extra.name && extra.name.trim();
                      })
                      // Convert to HTML
                      .map(function (extra) {
                        var span = document.createElement('span');
                        var textContainer = span;
                        if (extra.class) {
                          span.className = extra.class;
                        }
                        if (extra.href) {
                          var a = document.createElement('a');
                          span.appendChild(a);
                          a.href = extra.href;
                          textContainer = a;
                          if (self.doRDFa) {
                            a.setAttribute('property', 'rdfs:seeAlso');
                          }
                        }
                        textContainer.innerHTML = extra.name;
                        return span.outerHTML;
                      })
                      .join(', ');
                    ret += ", " + resultHTML;
                }
                if (this.doRDFa) {
                  ret += "</span>\n";
                  if (name === "Editor") ret += "<span property='rdf:rest' resource='" + bn + "'></span>\n";
                }
                ret += "</dd>\n";
            }
            return new hb.SafeString(ret);
        });

        hb.registerHelper("showLogos", function (items) {
            var ret = "<p>";
            for (var i = 0, n = items.length; i < n; i++) {
                var p = items[i];
                if (p.url) ret += "<a href='" + p.url + "'>";
                if (p.id)  ret += "<span id='" + p.id + "'>";
                if (p.src) {
                    ret += "<img src='" + p.src + "'";
                    if (p.width)  ret += " width='" + p.width + "'";
                    if (p.height) ret += " height='" + p.height + "'";
                    if (p.alt) ret += " alt='" + p.alt + "'";
                    else if (items.length == 1) ret += " alt='Logo'";
                    else ret += " alt='Logo " + (i + 1) + "'";
                    ret += ">";
                }
                else if (p.alt) ret += p.alt;
                if (p.url) ret += "</a>";
                if (p.id) ret += "</span>";
            }
            ret += "</p>";
            return new hb.SafeString(ret);
        });
        
        hb.registerHelper("switch", function(value, options) {
            this._switch_value_ = value;
            this._switch_break_ = false;
            var html = options.fn(this);
            delete this._switch_break_;
            delete this._switch_value_;
            return html;
        });
        
        hb.registerHelper("case", function(value, options) {
            var args = Array.prototype.slice.call(arguments);
            var options    = args.pop();
            var caseValues = args;
        
            if (this._switch_break_ || caseValues.indexOf(this._switch_value_) === -1) {
                return '';
            } else {
                this._switch_break_ = true;
                }
            return options.fn(this);
            });
        
        hb.registerHelper("default", function(options) {
            if (!this._switch_break_) {
            return options.fn(this);
            }
        });
        
        return {
            status2text: {
                "GN-WV":         "Werkversie"
            ,   "GN-CV":         "Consultatieversie"
            ,   "GN-VV":         "Versie ter vaststelling"
            ,   "GN-DEF":        "Vastgestelde versie"
            ,   "GN-BASIS":      "Document"
            }
        ,   type2text: {
                "NO": "Norm" 
            ,   "ST": "Standaard"
            ,   "IM": "Informatiemodel"
            ,   "PR": "Praktijkrichtlijn"
            ,   "HR": "Handreiking"
            ,   "WA": "Werkafspraak"
            }
        ,   noTrackStatus:  ["GN-BASIS"]
        ,   run:    function (conf, doc, cb) {
                conf.specStatus = (conf.specStatus) ? conf.specStatus.toUpperCase() : "";
                conf.specType = (conf.specType) ? conf.specType.toUpperCase() : "";
                conf.isBasic = (conf.specStatus === "GN-BASIS");
                conf.isRegular = (!conf.isBasic);
                conf.isNoTrack = $.inArray(conf.specStatus, this.noTrackStatus) >= 0;
                conf.isOfficial = (conf.specStatus === "GN-DEF")
                //Some errors
                if (!conf.specStatus) pubsubhub.pub("error", "Missing required configuration: specStatus");
                if (conf.isRegular && !conf.specType) pubsubhub.pub("error", "Missing required configuration: specType");
                if (!conf.edDraftURI && !conf.isOfficial && !conf.isBasic) pubsubhub.pub("error", "Missing required configuration: edDraftURI");
                if (conf.isRegular && !conf.shortName) pubsubhub.pub("error", "Missing required configuration: shortName");
                if (!conf.isOfficial && !conf.github) pubsubhub.pub("error", "Missing required configuration: github")
                //Titles
                conf.title = doc.title || "No Title";
                if (!conf.subtitle) conf.subtitle = "";
                //Publishdate
                if (!conf.publishDate) {
                    conf.publishDate = utils.parseLastModified(doc.lastModified);
                }
                else {
                    if (!(conf.publishDate instanceof Date)) conf.publishDate = utils.parseSimpleDate(conf.publishDate);
                }
                conf.publishYear = conf.publishDate.getFullYear();
                conf.publishHumanDate = utils.humanDate(conf.publishDate, "nl");
                //Version URLs
                if (!conf.edDraftURI) {
                    conf.edDraftURI = "";
                    if (conf.specStatus === "GN-WV") pubsubhub.pub("warn", "Editor's Drafts should set edDraftURI.");
                }
                var publishSpace = "st";             
                if (conf.isRegular) conf.thisVersion =  "http://www.geostandaarden.nl/" + publishSpace + "/" +
                                                        conf.specType.toLowerCase() + "-" + conf.shortName + "/";
                if (conf.isRegular) conf.latestVersion = "http://www.geostandaarden.nl/" + publishSpace + "/" + 
                                                        conf.publishDate.getFullYear() + "/" + 
                                                        conf.specType.toLowerCase() + "-" + conf.shortName + "-" + utils.concatDate(conf.publishDate) + "/";
                //Authors & Editors
                if (!conf.editors || conf.editors.length === 0) pubsubhub.pub("error", "At least one editor is required");
                var peopCheck = function (it) {
                    if (!it.name) pubsubhub.pub("error", "All authors and editors must have a name.");
                };
                if (conf.editors) {
                    conf.editors.forEach(peopCheck);
                }
                if (conf.authors) {
                    conf.authors.forEach(peopCheck);
                }
                conf.multipleEditors = conf.editors && conf.editors.length > 1;
                conf.multipleAuthors = conf.authors && conf.authors.length > 1;
                conf.textStatus = this.status2text[conf.specStatus];
                conf.typeStatus = this.type2text[conf.specType];
                //Annotate html element with RFDa
                if (conf.doRDFa === undefined) conf.doRDFa = true;
                if (conf.doRDFa) {
                    if (conf.rdfStatus) $("html").attr("typeof", "bibo:Document " + conf.rdfStatus );
                    else $("html").attr("typeof", "bibo:Document ");
                    var prefixes = "bibo: http://purl.org/ontology/bibo/ w3p: http://www.w3.org/2001/02pd/rec54#";
                    $("html").attr("prefix", prefixes);
                    $("html>head").prepend($("<meta lang='' property='dc:language' content='en'>"));
                }  
                //headersTmpl
                var bp;
                bp = headersTmpl(conf);
                $("body", doc).prepend($(bp)).addClass("h-entry");
                //SotD
                var $sotd = $("#sotd");
                conf.sotdCustomParagraph = $sotd.html();
                $sotd.remove();
                var sotd = sotdTmpl(conf);
                if (sotd) $(sotd).insertAfter($("#abstract"));
                cb();
            }
        };
    }
);
