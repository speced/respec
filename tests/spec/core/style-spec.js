describe("Core — Style", function () {
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
    it("should have included a style element", function () {
        var doc;
        runs(function () {
            makeRSDoc({ body: body, config: basicConfig }, function (rsdoc) { doc = rsdoc; });
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
