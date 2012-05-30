describe("W3C — un-HTML5", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should have renamed all the sections to div.section", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("section", doc).length == 0).toBeTruthy();
            expect($("div.section", doc).length > 0).toBeTruthy();
            flushIframes();
        });
    });
});
