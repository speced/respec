describe("W3C - un-HTML5", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should have renamed all the HTML5 elements to div.elName", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body:   "<section><figure><figcaption></figcaption></figure></section>"
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("section", doc).length).toEqual(0);
            expect($("div.section", doc).length).toBeGreaterThan(0);
            expect($("figure", doc).length).toEqual(0);
            expect($("div.figure", doc).length).toBeGreaterThan(0);
            expect($("figcaption", doc).length).toEqual(0);
            expect($("div.figcaption", doc).length).toBeGreaterThan(0);
            flushIframes();
        });
    });
});
