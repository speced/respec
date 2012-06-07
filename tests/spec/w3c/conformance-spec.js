describe("W3C — Conformance", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should include an h2 and inject its content", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='conformance'><p>CONFORMANCE</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#conformance", doc);
            expect($c.find("h2").length).toEqual(1);
            expect($c.find("h2").text()).toMatch(/\d+\.\s+Conformance/);
            expect($c.find("p").length).toEqual(3);
            expect($c.find("p").text()).toMatch("non-normative");
            expect($c.find("p").last().text()).toMatch("CONFORMANCE");
            flushIframes();
        });
    });
});
