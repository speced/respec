function loadWithConfig (conf, check) {
    var config = [];
    for (var k in conf) {
        config.push(k + "=" + ($.isArray(conf[k]) ? JSON.stringify(conf[k]) : conf[k]));
    }
    var $ifr = $("<iframe width='800' height='200' style='display: none' src='spec/core/simple.html?" + config.join(";") + "'></iframe>")
    ,   loaded = false
    ,   MAXOUT = 5000
    ,   incr = function (ev) {
            if (ev.data && ev.data.topic == "end-all") loaded = true, console.log("OK");
        }
    ;
    runs(function () {
        window.addEventListener("message", incr, false);
        $ifr.appendTo($("body"));
    });
    waitsFor(function () { return loaded; }, MAXOUT);
    runs(function () {
        check($ifr);
        $ifr.remove();
        loaded = false;
        window.removeEventListener("message", incr, false);
    });
}

// the matrix of features here is such that we're not testing everything
// however the intent is that as bugs are found, we add tests for them

describe("W3C — Headers", function () {
    // specStatus
    it("should take specStatus into account", function () {
        loadWithConfig({ specStatus: "ED" }, function ($ifr) {
            expect($(".head h2", $ifr[0].contentDocument).text()).toMatch(/W3C Editor's Draft/);
        });
        loadWithConfig({ specStatus: "RSCND" }, function ($ifr) {
            expect($(".head h2", $ifr[0].contentDocument).text()).toMatch(/W3C Rescinded Recommendation/);
        });
    });

    // shortName
    it("should take shortName into account", function () {
        loadWithConfig({ specStatus: "REC", shortName: "xxx" }, function ($ifr) {
            expect($("dt:contains('This version:')", $ifr[0].contentDocument).next("dd").text()).toMatch(/\/REC-xxx-/);
            expect($("dt:contains('Latest published version:')", $ifr[0].contentDocument).next("dd").text()).toMatch(/\/TR\/xxx\//);
        });
    });

    // editors
    it("should take editors into account", function () {
        loadWithConfig({ specStatus: "REC", "editors[]": [{
                name:       "NAME"
            ,   uri:        "http://URI"
            ,   company:    "COMPANY"
            ,   companyURL: "http://COMPANY"
            ,   mailto:     "EMAIL"
            ,   note:       "NOTE"
            }] }, function ($ifr) {
                expect($("dt:contains('Editors:')", $ifr[0].contentDocument).length).toEqual(0);
                expect($("dt:contains('Editor:')", $ifr[0].contentDocument).length).toEqual(1);
                var $dd = $("dt:contains('Editor:')", $ifr[0].contentDocument).next("dd");
                expect($dd.find("a[href='http://URI']").length).toEqual(1);
                expect($dd.find("a[href='http://URI']").text()).toEqual("NAME");
                expect($dd.find("a[href='http://COMPANY']").length).toEqual(1);
                expect($dd.find("a[href='http://COMPANY']").text()).toEqual("COMPANY");
                expect($dd.find("a[href='mailto:EMAIL']").length).toEqual(1);
                expect($dd.find("a[href='mailto:EMAIL']").text()).toEqual("EMAIL");
                expect($dd.text()).toMatch(/\(NOTE\)/);
        });
        loadWithConfig({ specStatus: "REC", "editors[]": [{ name: "NAME1" }, { name: "NAME2" }] }, function ($ifr) {
                expect($("dt:contains('Editors:')", $ifr[0].contentDocument).length).toEqual(1);
                expect($("dt:contains('Editor:')", $ifr[0].contentDocument).length).toEqual(0);
                var $dd = $("dt:contains('Editors:')", $ifr[0].contentDocument).next("dd");
                expect($dd.text()).toEqual("NAME1");
                expect($dd.next("dd").text()).toEqual("NAME2");
        });
    });

    // authors
    it("should take authors into account", function () {
        loadWithConfig({ specStatus: "REC", "authors[]": [{ name: "NAME1" }] }, function ($ifr) {
                expect($("dt:contains('Authors:')", $ifr[0].contentDocument).length).toEqual(0);
                expect($("dt:contains('Author:')", $ifr[0].contentDocument).length).toEqual(1);
                var $dd = $("dt:contains('Author:')", $ifr[0].contentDocument).next("dd");
                expect($dd.text()).toEqual("NAME1");
        });
        loadWithConfig({ specStatus: "REC", "authors[]": [{ name: "NAME1" }, { name: "NAME2" }] }, function ($ifr) {
                expect($("dt:contains('Authors:')", $ifr[0].contentDocument).length).toEqual(1);
                expect($("dt:contains('Author:')", $ifr[0].contentDocument).length).toEqual(0);
                var $dd = $("dt:contains('Authors:')", $ifr[0].contentDocument).next("dd");
                expect($dd.text()).toEqual("NAME1");
                expect($dd.next("dd").text()).toEqual("NAME2");
        });
    });

    // subtitle
    it("should take subtitle into account", function () {
        loadWithConfig({ specStatus: "REC" }, function ($ifr) {
                expect($("#subtitle", $ifr[0].contentDocument).length).toEqual(0);
        });
        loadWithConfig({ specStatus: "REC", "subtitle": "SUB" }, function ($ifr) {
                expect($("#subtitle", $ifr[0].contentDocument).length).toEqual(1);
                expect($("#subtitle", $ifr[0].contentDocument).text()).toEqual("SUB");
        });
    });

    // publishDate
    it("should take publishDate into account", function () {
        loadWithConfig({ publishDate: "1977-03-15" }, function ($ifr) {
                expect($("h2:contains('15 March 1977')", $ifr[0].contentDocument).length).toEqual(1);
        });
    });

    // previousPublishDate & previousMaturity
    it("should take previousPublishDate and previousMaturity into account", function () {
        loadWithConfig({ specStatus: "REC", publishDate: "2017-03-15", 
                         previousPublishDate: "1977-03-15", previousMaturity: "CR" }, function ($ifr) {
                expect($("dt:contains('Previous version:')", $ifr[0].contentDocument).next("dd").text())
                    .toMatch(/\/1977\/CR-[^\/]+-19770315\//);
        });
    });

    // errata
    it("should take errata into account", function () {
        loadWithConfig({ specStatus: "REC", errata: "ERR" }, function ($ifr) {
                expect($(".head a:contains('errata')", $ifr[0].contentDocument).attr("href")).toEqual("ERR");
        });
    });

    // alternateFormats
    it("should take alternateFormats into account", function () {
        loadWithConfig({ specStatus: "FPWD", "alternateFormats[]": [{ uri: "URI", label: "LABEL" }] }, function ($ifr) {
                expect($(".head a:contains('LABEL')", $ifr[0].contentDocument).attr("href")).toEqual("URI");
        });
    });

    // testSuiteURI
    it("should take testSuiteURI into account", function () {
        loadWithConfig({ specStatus: "REC", testSuiteURI: "URI" }, function ($ifr) {
                expect($("dt:contains('Test suite:')", $ifr[0].contentDocument).next("dd").text()).toEqual("URI");
        });
    });

    // implementationReportURI
    it("should take implementationReportURI into account", function () {
        loadWithConfig({ specStatus: "REC", implementationReportURI: "URI" }, function ($ifr) {
                expect($("dt:contains('Implementation report:')", $ifr[0].contentDocument).next("dd").text()).toEqual("URI");
        });
    });

    // edDraftURI
    it("should take edDraftURI into account", function () {
        loadWithConfig({ specStatus: "WD", edDraftURI: "URI" }, function ($ifr) {
                expect($("dt:contains('Latest editor\'s draft:')", $ifr[0].contentDocument).next("dd").text()).toEqual("URI");
        });
    });

    // prevED
    it("should take prevED into account", function () {
        loadWithConfig({ specStatus: "ED", prevED: "URI" }, function ($ifr) {
                expect($("dt:contains('Previous editor\'s draft:')", $ifr[0].contentDocument).next("dd").text()).toEqual("URI");
        });
    });

    //  - additionalCopyrightHolders
        // use markup
        // check with one, unofficial
        // check with one, other
    //  - overrideCopyright
        // check none and with one
    //  - copyrightStart
        // check with one equalling current year
        // check without
        // check with one in the past
    //  - prevRecShortname
    //  - prevRecURI
        // check none
        // check short name
        // check uri
});
