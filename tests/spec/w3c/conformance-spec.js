describe("W3C — Conformance", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        ,   doRDFa:  false
        };
    it("should include an h2 and inject its content", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='conformance'><p>CONFORMANCE</p></section><section><h2>my section</h2><p>No terms are used except SHOULD.</p></section>") }, 
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
    it("should include only referenced 2119 terms", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='conformance'><p>CONFORMANCE</p></section><section><h2>my section</h2><p>Terms are MUST, SHOULD, SHOULD NOT, and SHOULD  NOT.</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#conformance", doc);
            var $d = $(".rfc2119", $c) ;
            expect($d.length).toEqual(3);
            flushIframes();
        });
    });
    it("should omit the 2119 reference when there are no terms", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='conformance'><p>CONFORMANCE</p></section><section><h2>my section</h2><p>Terms are not used.</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#conformance", doc);
            var $d = $(".rfc2119", $c) ;
            expect($d.length).toEqual(0);
            flushIframes();
        });
    });
});
