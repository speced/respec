describe("Core — Remove ReSpec", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should have removed all artefacts", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($(".remove", doc).length == 0).toBeTruthy();
            expect($("script[data-requiremodule]", doc).length == 0).toBeTruthy();
            flushIframes();
        });
    });
});
