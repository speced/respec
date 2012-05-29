
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
//  - overrideCopyright: provides markup to completely override the copyright
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
                if (p.uri) ret += "<a href='" + p.uri + "'>"+ p.name + "</a>";
                else       ret += p.name;
                if (p.company) {
                    ret += ", ";
                    if (p.companyURL) ret += "<a href='" + p.companyURL + "'>" + p.company + "</a>";
                    else              ret += p.company;
                }
                if (p.mailto) {
                    ret += ", <span class='ed_mailto'><a href='mailto:" + p.mailto + "'>" + p.mailto + "</a></span>";
                }
                if (p.note) ret += " (" + p.note + ")";
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
            }
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
                conf.multipleAlternates = conf.alternateFormats && conf.alternateFormats.length > 1;
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
                conf.isRec = (conf.isRecTrack && conf.specStatus === "REC");
                conf.isUnofficial = conf.specStatus === "unofficial";
                conf.prependW3C = !conf.isUnofficial;
                conf.isXGR = (conf.specStatus === "XGR");
                // configuration done — yay!
                
                // insert into document
                var h = Handlebars.compile(headersTmpl)
                ,   out = h(conf)
                ;
                $("body", doc).prepend($(out));

                msg.pub("end", "w3c/headers");
                cb();
            }
        };
    }
);
