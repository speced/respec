describe("Core — Default Root Attribute", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should apply en and ltr defaults", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig }, function (rsdoc) { doc = rsdoc; });
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
            makeRSDoc({ config: basicConfig, htmlAttrs: { dir: "rtl" } }, function (rsdoc) { doc = rsdoc; });
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
            makeRSDoc({ config: basicConfig, htmlAttrs: { lang: "fr" } }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("html", doc).attr("lang")).toEqual("fr");
            expect($("html", doc).attr("dir")).toBeUndefined();
            flushIframes();
        });
    });
});
