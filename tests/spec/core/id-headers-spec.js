describe("Core - ID headers", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        ,   shortName: "mydoc"
        ,   previousURI:  "http://www.example.com"
        ,   previousMaturity: "WD"
        ,   previousPublishDate:  "2014-01-01"
        }
    ;
    it("should have set ID on header", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: "<section><p>BLAH</p><h6>FOO</h6></section><section id='sotd'>Custom SOTD</section>" }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $s = $("section h2:contains('FOO')", doc);
            expect($s.attr("id")).toEqual("foo");
            flushIframes();
        });
    });
});
