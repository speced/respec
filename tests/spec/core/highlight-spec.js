describe("Core — Highlight", function () {
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
    it("should process highlights", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<section><pre class='example highlight'>function () {\n  alert('foo');\n}</pre></section>" +
                                "<section id='sotd'>Custom SOTD</section>")
                    }, 
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $ex = $("pre.example", doc);
            expect($ex.hasClass("sh_javascript")).toBeFalsy();
            expect($ex.hasClass("highlight")).toBeTruthy();
            expect($ex.hasClass("prettyprint")).toBeTruthy();
            expect($ex.find("span.str").length).toBeGreaterThan(0);
            flushIframes();
        });
    });
});
