describe("Core — Definitions", function () {
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
    it("should process definitions", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='dfn'><dfn>text</dfn><a>text</a></section><section id='sotd'><p>Custom SOTD</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#dfn", doc);
            expect($sec.find("dfn").attr("id")).toEqual("dfn-text");
            expect($sec.find("a").attr("href")).toEqual("#dfn-text");
            flushIframes();
        });
    });
});
