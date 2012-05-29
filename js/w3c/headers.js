
// Module w3c/headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
//  - shortName: the small name that is used after /TR/ in published reports (required)
//  - editors: an array of people editing the document (at least one is required). People
//      are defined using:
//          - name: the person's name (required)
//          - uri: URI for the person's home page
//          - company: the person's company
//          - companyURL: the URI for the person's company
//          - mailto: the person's email
//          - note: a note on the person (e.g. former editor)
//  - authors: an array of people who are contributing authors of the document.
//  - subtitle: a subtitle for the specification
//  - publishDate: the date to use for the publication, default to document.lastModified, and
//      failing that to now. The format is YYYY-MM-DD or a Date object.
//  - previousPublishDate: the date on which the previous version was published.
//  - previousMaturity: the specStatus of the previous version
//  - errata: the URI of the errata document, if any
//  - alternateFormats: a list of alternate formats for the document, each of which being
//      defined by:
//          - uri: the URI to the alternate
//          - label: a label for the alternate
//  - testSuiteURI: the URI to the test suite, if any
//  - implementationReportURI: the URI to the implementation report, if any
//  - noRecTrack: set to true if this document is not intended to be on the Recommendation track
//  - edDraftURI: the URI of the Editor's Draft for this document, if any. Required if
//      specStatus is set to "ED".
//  - additionalCopyrightHolders: a copyright owner in addition to W3C (or the only one if specStatus
//      is unofficial)
//  - copyrightStart: the year from which the copyright starts running
//  - prevED: the URI of the previous Editor's Draft if it has moved
//  - prevRecShortname: the short name of the previous Recommendation, if the name has changed
//  - prevRecURI: the URI of the previous Recommendation if not directly generated from 
//    prevRecShortname.
//  - xgrGroupShortName: short name (used in the URI) for Incubator Groups. Required for XGRs.
//      Probably obsolete.
//  - xgrDocShortName: short name (used in the URI) for the XG report itself, defaults to the name
//      of the group. Probably obsolete.



define(
    ["core/utils", "text!w3c/templates/headers.html"],
    function (utils, headersTmpl) {
        Handlebars.registerHelper("showPeople", function (items) {
            var ret = "";
            for (var i = 0, n = items.length; i < n; i++) {
                var p = items[i];
                ret += "<dd>";
                if (p.url) ret += "<a href='" + p.url + "'>"+ p.name + "</a>";
                else       ret += pers.name;
                if (p.company) {
                    ret += ", ";
                    if (p.companyURL) ret += "<a href='" + p.companyURL + "'>" + p.company + "</a>";
                    else              ret += p.company;
                }
                if (p.mailto) {
                    ret += ", <span class='ed_mailto'><a href='mailto:" + p.mailto + "'>" + p.mailto + "</a></span>";
                }
                if (p.note) ret += " ( " + p.note + " )";
                ret += "</dd>\n";
            }
            return new Handlebars.SafeString(ret);
        });
        

        
        return {
            status2maturity:    {
                FPWD:           "WD"
            ,   LC:             "WD"
            ,   "FPWD-NOTE":    "WD"
            ,   "WD-NOTE":      "WD"
            ,   "LC-NOTE":      "LC"
            ,   "IG-NOTE":      "NOTE"
            ,   "WG-NOTE":      "NOTE"
            }
        ,   status2text: {
                NOTE:           "Note"
            ,   "WG-NOTE":      "Working Group Note"
            ,   "CG-NOTE":      "Co-ordination Group Note"
            ,   "IG-NOTE":      "Interest Group Note"
            ,   "Member-SUBM":  "Member Submission"
            ,   "Team-SUBM":    "Team Submission"
            ,   XGR:            "Incubator Group Report"
            ,   MO:             "Member-Only Document"
            ,   ED:             "Editor's Draft"
            ,   FPWD:           "Working Draft"
            ,   WD:             "Working Draft"
            ,   "FPWD-NOTE":    "Working Draft"
            ,   "WD-NOTE": 		"Working Draft"
            ,   "LC-NOTE":      "Working Draft"
            ,   LC:             "Working Draft"
            ,   CR:             "Candidate Recommendation"
            ,   PR:             "Proposed Recommendation"
            ,   PER:            "Proposed Edited Recommendation"
            ,   REC:            "Recommendation"
            ,   RSCND:          "Rescinded Recommendation"
            ,   unofficial:     "Unofficial Draft"
            ,   base:           "Document"
            ,   finding:        "TAG Finding"
            ,   "draft-finding": "Draft TAG Finding"
            }
        ,   status2long:    {
                FPWD:           "First Public Working Draft"
            ,   "FPWD-NOTE":    "First Public Working Draft"
            ,   LC:             "Last Call Working Draft"
            ,   "LC-NOTE":      "Last Call Working Draft"
            },
        ,   recTrackStatus: ["FPWD", "WD", "LC", "CR", "PR", "PER", "REC"]
        ,   noTrackStatus:  ["MO", "unofficial", "base", "XGR", "finding", "draft-finding"]
            
        ,   run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/headers");
                
                // validate configuration and derive new configuration values
                if (!conf.specStatus) msg.pub("error", "Missing required configuration: specStatus");
                if (!conf.shortName) msg.pub("error", "Missing required configuration: shortName");
                conf.title = doc.title || "No Title";
                if (!conf.subtitle) conf.subtitle = "";
                if (!conf.publishDate) {
                    conf.publishDate = utils.parseLastModified(doc.lastModified);
                }
                else {
                    if (!(conf.publishDate instanceof Date)) conf.publishDate = utils.parseSimpleDate(conf.publishDate);
                }
                conf.publishYear = conf.publishDate.getFullYear();
                conf.publishHumanDate = utils.humanDate(conf.publishDate);
                conf.isNoTrack = $.inArray(conf.specStatus, this.noTrackStatus) >= 0;
                conf.isRecTrack = conf.noRecTrack ? false : $.inArray(conf.specStatus, this.recTrackStatus) >= 0;
                conf.isTagFinding = conf.specStatus === "finding" || conf.specStatus === "draft-finding";
                if (!conf.shortName) error("Missing required configuration: shortName");
                if (!conf.edDraftURI) {
                    conf.edDraftURI = "";
                    if (conf.specStatus === "ED") msg.pub("warn", "Editor's Drafts should set edDraftURI.");
                }
                conf.maturity = (this.status2maturity[conf.specStatus]) ? this.status2maturity[conf.specStatus] : conf.specStatus;
                var publishSpace = "TR";
                if (conf.specStatus === "Member-SUBM") publishSpace = "Submission";
                else if (conf.specStatus === "Team-SUBM") publishSpace = "TeamSubmission";
                conf.thisVersion =  "http://www.w3.org/" + publishSpace + "/" + conf.publishDate.getFullYear() + 
                                    "/" + conf.maturity + "-" + conf.shortName + "-" + utils.concatDate(conf.publishDate) + "/";
                if (conf.specStatus === "ED") conf.thisVersion = conf.edDraftURI;
                conf.latestVersion = "http://www.w3.org/" + publishSpace + "/" + conf.shortName + "/";
                if (conf.specStatus === "XGR") {
                    if (!conf.xgrGroupShortName) msg.pub("error", "Document is an XGR but xgrGroupShortName is not specified");
                    if (!conf.xgrDocShortName) conf.xgrDocShortName = conf.xgrGroupShortName;
                    conf.thisVersion = "http://www.w3.org/2005/Incubator/" + conf.xgrGroupShortName + 
                                       "/XGR-" + conf.xgrDocShortName + "-" + utils.concatDate(conf.publishDate) + "/";
                    conf.latestVersion = "http://www.w3.org/2005/Incubator/" + conf.xgrGroupShortName + 
                                       "/XGR-" + conf.xgrDocShortName + "/";
                }
                else if (conf.isTagFinding) {
                    conf.latestVersion = "http://www.w3.org/2001/tag/doc/" + conf.shortName;
                    conf.thisVersion = conf.latestVersion + "-" + utils.concatDate(conf.publishDate, "-");
                }
                if (conf.previousPublishDate) {
                    if (!conf.previousMaturity && !conf.isTagFinding)
                        msg.pub("error", "previousPublishDate is set, but not previousMaturity");
                    if (!(conf.previousPublishDate instanceof Date)) 
                        conf.previousPublishDate = utils.parseSimpleDate(conf.previousPublishDate);
                    var pmat = (this.status2maturity[conf.previousMaturity]) ? this.status2maturity[conf.previousMaturity] : 
                                                                               conf.previousMaturity;
                    if (conf.isTagFinding) {
                        conf.prevVersion = conf.latestVersion + "-" + utils.concatDate(conf.previousPublishDate, "-");
                    }
                    else {
                        conf.prevVersion = "http://www.w3.org/TR/" + conf.previousPublishDate.getFullYear() + "/" + pmat + "-" +
                                           conf.shortName + "-" + utils.concatDate(conf.previousPublishDate) + "/";
                    }
                }
                else {
                    if (conf.specStatus !== "FPWD" && conf.specStatus !== "ED" && !conf.noRecTrack && !conf.isNoTrack)
                        msg.pub("error", "Document on track but no previous version.");
                    conf.prevVersion = "";
                }
                if (conf.prevRecShortname && !conf.prevRecURI) conf.prevRecURI = "http://www.w3.org/TR/" + conf.prevRecShortname;
                if (!conf.editors || conf.editors.length === 0) msg.pub("error", "At least one editor is required");
                var peopCheck = function (i, it) {
                    if (!it.name) msg.pub("error", "All authors and editors must have a name.");
                };
                $.each(conf.editors, peopCheck);
                $.each(conf.authors || [], peopCheck);
                conf.multipleEditors = conf.editors.length > 1;
                conf.multipleAuthors = conf.authors && conf.authors.length > 1;
                $.each(conf.alternateFormats || [], function (i, it) {
                    if (!it.uri || !it.label) error("All alternate formats must have a uri and a label.");
                });
                conf.multipleAlternates = conf.alternateFormats.length > 1;
                conf.alternatesHTML = utils.joinAnd(conf.alternateFormats, function (alt) {
                    return "<a href='" + alt.uri + "'>" + alt.label + "</a>";
                });
                if (conf.copyrightStart && conf.copyrightStart == conf.publishYear) conf.copyrightStart = "";
                for (var k in this.status2text) {
                    if (this.status2long[k]) continue;
                    this.status2long[k] = this.status2text[k];
                }
                conf.longStatus = this.status2long[conf.specStatus];
                conf.showThisVersion =  (!conf.isNoTrack || conf.specStatus === "XGR" || conf.isTagFinding);
                conf.showPreviousVersion = (conf.specStatus !== "FPWD" && conf.specStatus !== "ED" && 
                                           !conf.isNoTrack && !conf.noRecTrack);
                if (conf.isTagFinding) conf.showPreviousVersion = conf.previousPublishDate ? true : false;
                conf.notYetRec = (conf.isRecTrack && conf.specStatus !== "REC");
                conf.prependW3C = !(conf.specStatus === "unofficial" || conf.isTagFinding);
                conf.isXGR = (conf.specStatus === "XGR");
                // configuration done — yay!

                msg.pub("end", "w3c/headers");
                cb();
            }
        };
    }
);

makeNormalHeaders:    function () {

    var header = "<div class='head'><p>";
    if (this.specStatus != "unofficial")
        header += "<a href='http://www.w3.org/'><img width='72' height='48' src='http://www.w3.org/Icons/w3c_home' alt='W3C'/></a>";
    if (this.specStatus == 'XGR') 
        header += "<a href='http://www.w3.org/2005/Incubator/XGR/'><img alt='W3C Incubator Report' src='http://www.w3.org/2005/Incubator/images/XGR' height='48' width='160'/></a>";
    if ( this.doRDFa ) {
        header +=
            "<h1 property='dcterms:title' class='title' id='title'>" + this.title + "</h1>" ;
        if (this.subtitle) {
            header += "<h2 property='bibo:subtitle' id='subtitle'>" + this.subtitle + "</h2>" ;
        }
        header +=
            "<h2 property='dcterms:issued' datatype='xsd:dateTime' content='" + this._ISODate(this.publishDate) + "'>" + (this.specStatus == "unofficial" ? "" : "W3C ") + 
            this.status2text[this.specStatus] + " " + this._humanDate(this.publishDate) + "</h2><dl>";
    } else {
        header +=
            "<h1 class='title' id='title'>" + this.title + "</h1>" ;
        if (this.subtitle) {
            header += "<h2 id='subtitle'>" + this.subtitle + "</h2>" ;
        }
        header +=
            "<h2>" + (this.specStatus == "unofficial" ? "" : "W3C ") + 
            this.status2text[this.specStatus] + " " + this._humanDate(this.publishDate) + "</h2><dl>";
    }
    if (!this.isNoTrack) {
        header += "<dt>This version:</dt><dd><a href='" + thisVersion + "'>" + thisVersion + "</a></dd>" + 
                  "<dt>Latest published version:</dt><dd>" + latestVersion + "</dd>"; 
        if (this.edDraftURI) {
            header += "<dt>Latest editor's draft:</dt><dd><a href='" + this.edDraftURI + "'>" + this.edDraftURI + "</a></dd>";
        }
    }
    if (this.testSuiteURI) {
     header += "<dt>Test suite:</dt><dd><a href='" + this.testSuiteURI + "'>" + this.testSuiteURI + "</a></dd>";
    }
    if (this.implementationReportURI) {
     header += "<dt>Implementation report:</dt><dd><a href='" + this.implementationReportURI + "'>" + this.implementationReportURI + "</a></dd>";
    }
    if (this.specStatus != "FPWD" && this.specStatus != "FPWD-NOTE" &&
        !this.isNoTrack) {
        if (!this.prevED) {
            header += "<dt>Previous version:</dt><dd>" + prevVersion + "</dd>";
        } else {
            header += "<dt>Previous editor's draft:</dt><dd>" + prevED + "</dd>";
        }
    }

    if (this.prevRecShortname) {
        var prevRecURI = "http://www.w3.org/TR/" + this.prevRecShortname + "/";
        header += "<dt>Latest recommendation:</dt><dd>" + 
            '<a href="' + prevRecURI + '">' + prevRecURI + "</a></dd>";
    }

    if(this.editors.length == 0) {
        header += "<dt>" + "Editor" + ":</dt>";
        error("There must be at least one editor.");
    }
    header += this.showPeople("Editor", this.editors);
    header += this.showPeople("Author", this.authors);
    header += "</dl>";

    if (this.errata) {
        header += '<p>Please refer to the <a href="' + this.errata + '">errata</a> for this document, which may include some normative corrections.</p>';
    }

    if (this.alternateFormats.length > 0) {
        var len = this.alternateFormats.length ;
        if (len == 1) {
            header += '<p>This document is also available in this non-normative format: ';
        } else {
            header += '<p>This document is also available in these non-normative formats: ';
        }
        for (var f = 0; f < len; f++) {
            if (f > 0) {
                if ( len == 2) {
                    header += ' ';
                } else {
                    header += ', ' ;
                }
                if (f == len - 1) {
                    header += 'and ';
                }
            }
            var ref = this.alternateFormats[f] ;
            header += "<a href='" + ref.uri + "'>" + ref.label + "</a>" ;
        }
        header += '.</p>';
    }

    if (this.specStatus == "REC")
        header += '<p>The English version of this specification is the only normative version. Non-normative <a href="http://www.w3.org/Consortium/Translation/">translations</a> may also be available.</p>';

    if (this.specStatus == "unofficial") {
        var copyright;
        if (this.additionalCopyrightHolders) copyright = "<p class='copyright'>" + this.additionalCopyrightHolders + "</p>";
        else if (this.overrideCopyright) copyright = this.overrideCopyright;
        else copyright = "<p class='copyright'>This document is licensed under a <a class='subfoot' href='http://creativecommons.org/licenses/by/3.0/' rel='license'>Creative Commons Attribution 3.0 License</a>.</p>";
        header += copyright;
    }
    else {
        if (this.overrideCopyright) {
            header += this.overrideCopyright;
        }
        else {
            header += "<p class='copyright'>";
            if (this.doRDFa) {
                header += "<a rel='license' href='http://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> &copy; ";
            }
            else {
                header += "<a href='http://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> &copy; ";
            }
            if (this.copyrightStart) {
                header += this.copyrightStart + '-';
            }
            header += this.publishDate.getFullYear();
            if (this.additionalCopyrightHolders) header += " " + this.additionalCopyrightHolders + " &amp;";
            if (this.doRDFa) {
                header += " <span rel='dcterms:publisher'><span typeof='foaf:Organization'><a rel='foaf:homepage' property='foaf:name' content='World Wide Web Consortium' href='http://www.w3.org/'><acronym title='World Wide Web Consortium'>W3C</acronym></a><sup>&reg;</sup></span></span> ";
            } else {
                header += " <a href='http://www.w3.org/'><acronym title='World Wide Web Consortium'>W3C</acronym></a><sup>&reg;</sup> ";
            }
            header +=
                "(<a href='http://www.csail.mit.edu/'><acronym title='Massachusetts Institute of Technology'>MIT</acronym></a>, " +
                "<a href='http://www.ercim.eu/'><acronym title='European Research Consortium for Informatics and Mathematics'>ERCIM</acronym></a>, " +
                "<a href='http://www.keio.ac.jp/'>Keio</a>), All Rights Reserved. " +
                "W3C <a href='http://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer'>liability</a>, " + 
                "<a href='http://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks'>trademark</a> and " +
                "<a href='http://www.w3.org/Consortium/Legal/copyright-documents'>document use</a> rules apply.</p>";

        }
    }
    header += "<hr/></div>";
    return header;
},

makeHeaders:    function () {
    var header;
    if (this.specStatus === "finding" || this.specStatus === "draft-finding") header = this.makeTAGHeaders();
    else header = this.makeNormalHeaders();
    var tmp = sn.element("div");
    tmp.innerHTML = header;
    document.body.insertBefore(tmp.firstChild, document.body.firstChild);
},



makeTAGHeaders:    function () {
    var base = "http://www.w3.org/2001/tag/doc/",
        latestVersion = base + this.shortName,
        thisVersion = latestVersion + "-" + this._concatDate(this.publishDate, "-"),
        header = "<div class='head'><p>" +
                 "<a href='http://www.w3.org/'><img width='72' height='48' src='http://www.w3.org/Icons/w3c_home' alt='W3C'/></a>";
    header += "<h1 class='title' id='title'>" + this.title + "</h1>";
    if (this.subtitle) header += "<h2 id='subtitle'>" + this.subtitle + "</h2>";
    header += "<h2>" + this.status2text[this.specStatus] + " " + this._humanDate(this.publishDate) + "</h2><dl>";
    header += "<dt>This version:</dt><dd><a href='" + thisVersion + "'>" + thisVersion + "</a></dd>\n" + 
              "<dt>Latest published version:</dt><dd><a href='" + latestVersion + "'>" + latestVersion + "</a></dd>"; 
    if (this.edDraftURI) {
        header += "<dt>Latest editor's draft:</dt><dd><a href='" + this.edDraftURI + "'>" + this.edDraftURI + "</a></dd>";
    }
    if (this.previousPublishDate) {
        var prevVersion = latestVersion + "-" + this._concatDate(this.previousPublishDate, "-");
        header += "<dt>Previous version:</dt><dd><a href='" + prevVersion + "'>" + prevVersion + "</a></dd>"; 
    }
    if(this.editors.length == 0) {
        header += "<dt>" + "Editor" + ":</dt>";
        error("There must be at least one editor.");
    }
    header += this.showPeople("Editor", this.editors);
    header += this.showPeople("Author", this.authors);
    header += "</dl><p class='copyright'>";
    header += 
        "<a href='http://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> &copy; " ;
    if (this.copyrightStart && this.copyrightStart != this.publishDate.getFullYear()) header += this.copyrightStart + '-';
    header += this.publishDate.getFullYear();
    header += " <a href='http://www.w3.org/'><acronym title='World Wide Web Consortium'>W3C</acronym></a><sup>&reg;</sup> " +
        "(<a href='http://www.csail.mit.edu/'><acronym title='Massachusetts Institute of Technology'>MIT</acronym></a>, " +
        "<a href='http://www.ercim.eu/'><acronym title='European Research Consortium for Informatics and Mathematics'>ERCIM</acronym></a>, " +
        "<a href='http://www.keio.ac.jp/'>Keio</a>), All Rights Reserved. " +
        "W3C <a href='http://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer'>liability</a>, " + 
        "<a href='http://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks'>trademark</a> and " +
        "<a href='http://www.w3.org/Consortium/Legal/copyright-documents'>document use</a> rules apply." +
        "</p><hr/></div>";
    return header;
},
