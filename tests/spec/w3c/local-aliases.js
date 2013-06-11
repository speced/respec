describe("W3C ? Aliased References", function () {
    var MAXOUT = 5000
        , basicConfig = {
            editors: [
                { name: "Robin Berjon" }
            ], specStatus: "WD",
            localBiblio: {
                "FOOBARGLOP": {
                    "aliasOf": "RFC2119"
                }
            }
        };
    it("aliased spec must be resolved", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='sample'><p>foo [[!FOOBARGLOP]] bar</p></section>") },
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
            expect($r.text()).toMatch(/RFC2119/);
            flushIframes();
        });
    });
});

