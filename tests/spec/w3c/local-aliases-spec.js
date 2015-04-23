describe("W3C — Aliased References", function () {
    var MAXOUT = 5000
        , basicConfig = {
            editors: [
                { name: "Robin Berjon" }
            ]
            ,   specStatus: "WD"
            ,   shortName: "mydoc"
            ,   previousURI:  "http://www.example.com"
            ,   previousMaturity: "WD"
            ,   previousPublishDate:  "2014-01-01"
            ,   localBiblio: {
                "FOOBARGLOP": {
                    "aliasOf": "RFC2119"
                }
                }
            }
        ,   body = "<section id='sotd'>Custom SOTD</section>"
        ;
    it("aliased spec must be resolved", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='sample'><p>foo [[!FOOBARGLOP]] bar</p></section>" + body) },
                function (rsdoc) {
                    doc = rsdoc;
                });
        });
        waitsFor(function () {
            return doc;
        }, MAXOUT);
        runs(function () {
            var $r = $("#bib-FOOBARGLOP + dd", doc);
            expect($r.length).toBeTruthy();
            expect($r.text()).toMatch(/2119/);
            flushIframes();
        });
    });
});

