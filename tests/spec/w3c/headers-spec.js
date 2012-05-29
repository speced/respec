function loadWithConfig (conf, check) {
    var config = [];
    for (var k in conf) config.push(k + "=" + conf[k]);
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

    //  - shortName
        // check this version
        // check latest version
    //  - editors
        // check singular with one, plural with two
        // check with name, uri, company, companyURL, mailto, note — and just name
    //  - authors
        // check none and with two
    //  - subtitle
        // check none and with one
    //  - publishDate
        // check that it's there (we already check the method that makes it)
    //  - previousPublishDate
        // check none and with one
    //  - previousMaturity
        // check what happens to previous version with this
    //  - errata
        // check none and with one
    //  - alternateFormats
        // check none and with two
    //  - testSuiteURI
        // check none and with one
    //  - implementationReportURI
        // check none and with one
    //  - edDraftURI
        // check none and with one
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
    //  - prevED
        // check none and with one
    //  - prevRecShortname
    //  - prevRecURI
        // check none
        // check short name
        // check uri



    // it("should style according to spec status", function () {
    //     var status = "FPWD   WD-NOTE finding unofficial     base RSCND".split(/\s+/)
    //     ,   uris   = "W3C-WD W3C-WD  base    w3c-unofficial base W3C-RSCND".split(/\s+/)
    //     ;
    //     for (var i = 0, n = status.length; i < n; i++) {
    //         loadWithStatus(status[i], uris[i]);
    //     }
    // });
});
