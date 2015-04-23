describe("Core — Default Root Attribute", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        ,   shortName: "mydoc"
        ,   previousURI:  "http://www.example.com"
        ,   previousMaturity: "WD"
        ,   previousPublishDate:  "2014-01-01"
        }
    ,   body = "<section id='sotd'>Custom SOTD</section>"
    ;
    it("should apply en and ltr defaults", function () {
        var doc;
        runs(function () {
            makeRSDoc({ body: body, config: basicConfig }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("html", doc).attr("lang")).toEqual("en");
            expect($("html", doc).attr("dir")).toEqual("ltr");
            flushIframes();
        });
    });
    it("should not override existing dir", function () {
        var doc;
        runs(function () {
            makeRSDoc({ body: body, config: basicConfig, htmlAttrs: { dir: "rtl" } }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("html", doc).attr("lang")).toEqual("en");
            expect($("html", doc).attr("dir")).toEqual("rtl");
            flushIframes();
        });
    });
    it("should not override existing lang and not set dir", function () {
        var doc;
        runs(function () {
            makeRSDoc({ body: body, config: basicConfig, htmlAttrs: { lang: "fr" } }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("html", doc).attr("lang")).toEqual("fr");
            expect($("html", doc).attr("dir")).toBeUndefined();
            flushIframes();
        });
    });
});
