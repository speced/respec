describe("W3C — RDFa", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Shane McCarron" }]
        ,   shortName: "some-spec"
        ,   publicationDate: "2013-06-25"
        ,   previousPublishDate: "2012-06-07"
        ,   previousMaturity:  "REC"
        ,   specStatus: "PER"
        ,   wgPatentURI:  "http://www.w3.org/2004/01/pp-impl/44350/status"
        ,   doRDFa: "1.1"
        }
    ,   noConfig = {
            editors:    [{ name: "Shane McCarron" }]
        ,   shortName: "some-spec"
        ,   publicationDate: "2013-06-25"
        ,   previousPublishDate: "2012-06-07"
        ,   previousMaturity:  "REC"
        ,   specStatus: "PER"
        ,   doRDFa: false
        };
    it("should set the document information", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("html", doc);
            expect($c.attr('prefix')).toMatch(/bibo:/);
            expect($c.attr('prefix')).toMatch(/w3p:/);
            expect($c.attr('typeof')).toMatch(/w3p:PER/);
            expect($c.attr('typeof')).toMatch(/bibo:Document/);
            expect($c.attr('property')).toEqual("dcterms:language") ;
            expect($c.attr('content')).toEqual("en") ;
            expect($c.attr('about')).toEqual("") ;
            flushIframes();
        });
    });
    it("should set the patent rules", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("#sotd_patent", doc);
            expect($c.attr('about')).toEqual("");
            expect($c.attr('rel')).toEqual("w3p:patentRules");
            flushIframes();
        });
    });
    it("should do nothing when disabled", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: noConfig, body: $("<section id='sotd'>Some unique SOTD content</section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $c = $("html", doc);
            expect($c.attr('prefix')).toEqual(undefined);
            expect($c.attr('typeof')).toEqual(undefined);
            expect($c.attr('property')).toEqual(undefined);
            expect($c.attr('content')).toEqual(undefined) ;
            expect($c.attr('about')).toEqual(undefined) ;
            flushIframes();
        });
    });
});
