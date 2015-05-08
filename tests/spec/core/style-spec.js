describe("Core — Style", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should have included a style element", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $s = $("style", doc);
            expect($s.length).toBeTruthy();
            expect($s.text()).toMatch(/rfc2119/);
            flushIframes();
        });
    });
});
