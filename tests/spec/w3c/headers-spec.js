function loadWithConfig (conf, check) {
    var config = [];
    for (var k in conf) {
        config.push(k + "=" + encodeURI($.isArray(conf[k]) ? JSON.stringify(conf[k]) : conf[k]).replace(/=/g, "%3D"));
    }
    var $ifr = $("<iframe width='800' height='200' style='display: none'></iframe>")
    ,   loaded = false
    ,   MAXOUT = 5000
    ,   incr = function (ev) {
            if (ev.data && ev.data.topic == "end-all") loaded = true;
        }
    ;
    $ifr.attr("src", "spec/core/simple.html?" + config.join(";"));
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
// we're definitely not testing SotD much

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
        loadWithConfig({ specStatus: "REC", doRDFa: false, "editors[]": [{
                name:       "NAME"
            ,   url:        "http://URI"
            ,   company:    "COMPANY"
            ,   companyURL: "http://COMPANY"
            ,   mailto:     "EMAIL"
            ,   note:       "NOTE"
            ,   w3cid:       "1234"
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
                expect($dd.get(0).dataset.editorId).toEqual("1234");
                expect($dd.text()).toMatch(/\(NOTE\)/);
        });
        loadWithConfig({ specStatus: "REC", doRDFa: false, "editors[]": [{ name: "NAME1" }, { name: "NAME2" }] }, function ($ifr) {
            expect($("dt:contains('Editors:')", $ifr[0].contentDocument).length).toEqual(1);
            expect($("dt:contains('Editor:')", $ifr[0].contentDocument).length).toEqual(0);
            var $dd = $("dt:contains('Editors:')", $ifr[0].contentDocument).next("dd");
            expect($dd.text()).toEqual("NAME1");
            expect($dd.next("dd").text()).toEqual("NAME2");
        });
    });

    // authors
    it("should take authors into account", function () {
        loadWithConfig({ specStatus: "REC", doRDFa: false, "authors[]": [{ name: "NAME1" }] }, function ($ifr) {
            expect($("dt:contains('Authors:')", $ifr[0].contentDocument).length).toEqual(0);
            expect($("dt:contains('Author:')", $ifr[0].contentDocument).length).toEqual(1);
            var $dd = $("dt:contains('Author:')", $ifr[0].contentDocument).next("dd");
            expect($dd.text()).toEqual("NAME1");
        });
        loadWithConfig({ specStatus: "REC", doRDFa: false, "authors[]": [{ name: "NAME1" }, { name: "NAME2" }] }, function ($ifr) {
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

    // additionalCopyrightHolders
    it("should take additionalCopyrightHolders into account", function () {
        loadWithConfig({ specStatus: "REC", additionalCopyrightHolders: "XXX" }, function ($ifr) {
            expect($(".head .copyright", $ifr[0].contentDocument).text()).toMatch(/XXX\s+&\s+W3C/);
        });
        loadWithConfig({ specStatus: "unofficial", additionalCopyrightHolders: "XXX" }, function ($ifr) {
            expect($(".head .copyright", $ifr[0].contentDocument).text()).toEqual("XXX");
        });
        loadWithConfig({ specStatus: "REC", additionalCopyrightHolders: "<span class='test'>XXX</span>" }, function ($ifr) {
            expect($(".head .copyright .test", $ifr[0].contentDocument).text()).toEqual("XXX");
        });
    });

    // overrideCopyright
    it("should take overrideCopyright into account", function () {
        loadWithConfig({ overrideCopyright: "<p class='copyright2'>XXX</p>" }, function ($ifr) {
            expect($(".head .copyright", $ifr[0].contentDocument).length).toEqual(0);
            expect($(".head .copyright2", $ifr[0].contentDocument).length).toEqual(1);
            expect($(".head .copyright2", $ifr[0].contentDocument).text()).toEqual("XXX");
        });
    });

    // copyrightStart
    it("should take copyrightStart into account", function () {
        loadWithConfig({ publishDate: "2012-03-15", copyrightStart: "1977" }, function ($ifr) {
            expect($(".head .copyright", $ifr[0].contentDocument).text()).toMatch(/1977-2012/);
        });
        loadWithConfig({ publishDate: "2012-03-15", copyrightStart: "2012" }, function ($ifr) {
            expect($(".head .copyright", $ifr[0].contentDocument).text()).not.toMatch(/2012-2012/);
        });
    });

    // prevRecShortname & prevRecURI
    it("should take prevRecShortname and prevRecURI into account", function () {
        loadWithConfig({ prevRecURI: "URI" }, function ($ifr) {
            expect($("dt:contains('Latest Recommendation:')", $ifr[0].contentDocument).next("dd").text()).toEqual("URI");
        });
        loadWithConfig({ prevRecShortname: "SN" }, function ($ifr) {
            expect($("dt:contains('Latest Recommendation:')", $ifr[0].contentDocument).next("dd").text())
                .toEqual("http://www.w3.org/TR/SN");
        });
    });

    // wg, wgURI, wgPatentURI, wgPublicList
    it("should take wg configurations into account", function () {
        loadWithConfig({ wg: "WGNAME", wgURI: "WGURI", wgPatentURI: "WGPATENT", wgPublicList: "WGLIST", subjectPrefix: "[The Prefix]" }, function ($ifr) {
            var $sotd = $("#sotd", $ifr[0].contentDocument);
            expect($sotd.find("p:contains('CUSTOM PARAGRAPH')").length).toEqual(1);
            expect($sotd.find("a:contains('WGNAME')").length).toEqual(1);
            expect($sotd.find("a:contains('WGNAME')").attr("href")).toEqual("WGURI");
            expect($sotd.find("a:contains('WGLIST@w3.org')").length).toEqual(1);
            expect($sotd.find("a:contains('WGLIST@w3.org')").attr("href")).toEqual("mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D");
            expect($sotd.find("a:contains('subscribe')").attr("href")).toEqual("mailto:WGLIST-request@w3.org?subject=subscribe");
            expect($sotd.find("a:contains('archives')").attr("href")).toEqual("http://lists.w3.org/Archives/Public/WGLIST/");
            expect($sotd.find("a:contains('disclosures')").attr("href")).toEqual("WGPATENT");
        });
        loadWithConfig({ "wg[]": ["WGNAME1", "WGNAME2"], "wgURI[]": ["WGURI1", "WGURI2"], 
                         "wgPatentURI[]": ["WGPATENT1", "WGPATENT2"], wgPublicList: "WGLIST" }, function ($ifr) {
            var $sotd = $("#sotd", $ifr[0].contentDocument);
            expect($sotd.find("a:contains('WGNAME1')").length).toEqual(2);
            expect($sotd.find("a:contains('WGNAME2')").length).toEqual(2);
            expect($sotd.find("a:contains('WGNAME1')").first().attr("href")).toEqual("WGURI1");
            expect($sotd.find("a:contains('WGNAME1')").last().attr("href")).toEqual("WGPATENT1");
            expect($sotd.find("a:contains('WGNAME2')").first().attr("href")).toEqual("WGURI2");
            expect($sotd.find("a:contains('WGNAME2')").last().attr("href")).toEqual("WGPATENT2");
            expect($sotd.find("a:contains('disclosures')").length).toEqual(0);
        });
    });

    // perEnd
    it("should correctly flag a PER", function () {
        loadWithConfig({ previousMaturity: "REC", previousPublishDate: "2014-01-01", prevRecURI: "http://www.example.com/rec.html", implementationReportURI: "http://www.example.com/report.html", perEnd: "2014-12-01", specStatus: "PER", wg: "WGNAME", wgURI: "WGURI", wgPublicList: "WGLIST", subjectPrefix: "[The Prefix]" }, function ($ifr) {
            var $sotd = $("#sotd", $ifr[0].contentDocument);
            var $f = $($sotd.find("p:contains('Proposed Edited Recommendation')")) ;
            expect($f.length).toEqual(2);
            var $p = $f[0];
            expect($("a:contains('questionnaires')", $p).length).toEqual(1);
        });
    });

    // sotdAfterWGinfo
    it("should relocate custom sotd", function () {
        loadWithConfig({ sotdAfterWGinfo: true, wg: "WGNAME", wgURI: "WGURI", wgPublicList: "WGLIST", subjectPrefix: "[The Prefix]" }, function ($ifr) {
            var $sotd = $("#sotd", $ifr[0].contentDocument);
            var $f = $($sotd.find("p:contains('CUSTOM PARAGRAPH')")) ;
            expect($f.length).toEqual(1);
            var $p = $f.prev() ;
            expect($("a:contains('WGNAME')", $p).length).toEqual(1);
            expect($("a:contains('WGNAME')", $p).attr("href")).toEqual("WGURI");
            expect($("a:contains('WGLIST@w3.org')", $p).attr("href")).toEqual("mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D");
        });
    });

    // charterDisclosureURI
    it("should take charterDisclosureURI into account", function () {
        loadWithConfig({ specStatus: "IG-NOTE", charterDisclosureURI: "URI" }, function ($ifr) {
            expect($("#sotd a:contains('charter')", $ifr[0].contentDocument).attr("href")).toEqual("URI");
        });
    });

    // addPatentNote
    it("should take addPatentNote into account", function () {
        loadWithConfig({ addPatentNote: "<strong>PATENTNOTE</strong>" }, function ($ifr) {
            expect($("#sotd p strong", $ifr[0].contentDocument).text()).toEqual("PATENTNOTE");
        });
    });

    // CG/BG
    it("should handle CG-BG status", function () {
        loadWithConfig({ specStatus: "CG-DRAFT", wg: "WGNAME", wgURI: "http://WG", wgPublicList: "WGLIST", subjectPrefix: "[The Prefix]" }, function ($ifr) {
            var $c = $(".head .copyright", $ifr[0].contentDocument);
            expect($c.find("a[href='http://WG']").length).toEqual(1);
            expect($c.find("a:contains(WGNAME)").length).toEqual(1);
            expect($c.find("a[href='https://www.w3.org/community/about/agreements/cla/']").length).toEqual(1);
            expect($(".head h2", $ifr[0].contentDocument).text()).toMatch(/Draft Community Group Report/);
            var $sotd = $("#sotd", $ifr[0].contentDocument);
            expect($sotd.find("a[href='http://WG']").length).toEqual(1);
            expect($sotd.find("a:contains(WGNAME)").length).toEqual(1);
            expect($sotd.find("a[href='https://www.w3.org/community/about/agreements/cla/']").length).toEqual(1);
            expect($sotd.find("a:contains('WGLIST@w3.org')").length).toEqual(1);
            expect($sotd.find("a:contains('WGLIST@w3.org')").attr("href")).toEqual("mailto:WGLIST@w3.org?subject=%5BThe%20Prefix%5D");
            expect($sotd.find("a:contains('subscribe')").attr("href")).toEqual("mailto:WGLIST-request@w3.org?subject=subscribe");
            expect($sotd.find("a:contains('archives')").attr("href")).toEqual("http://lists.w3.org/Archives/Public/WGLIST/");
        });
        loadWithConfig({ specStatus: "BG-FINAL", wg: "WGNAME", wgURI: "http://WG", 
                         thisVersion: "http://THIS", latestVersion: "http://LATEST" }, function ($ifr) {
            expect($(".head .copyright a[href='https://www.w3.org/community/about/agreements/fsa/']", $ifr[0].contentDocument).length).toEqual(1);
            expect($(".head h2", $ifr[0].contentDocument).text()).toMatch(/Final Business Group Report/);
            expect($("dt:contains('This version:')", $ifr[0].contentDocument).next("dd").text()).toMatch(/http:\/\/THIS/);
            expect($("dt:contains('Latest published version:')", $ifr[0].contentDocument).next("dd").text()).toMatch(/http:\/\/LATEST/);
            var $sotd = $("#sotd", $ifr[0].contentDocument);
            expect($sotd.find("a[href='http://WG']").length).toEqual(1);
            expect($sotd.find("a:contains(WGNAME)").length).toEqual(1);
            expect($sotd.find("a[href='https://www.w3.org/community/about/agreements/final/']").length).toEqual(1);
        });
    });


});
