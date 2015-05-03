describe("Core - Inlines", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        ,   doRDFa:  false
        };
    it("should process all inline content", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig,
                        body: "<section id='inlines'><p><acronym title='ACRO-TIT'>ACRO</acronym> ACRO</p><p>" +
                              "<abbr title='ABBR-TIT'>ABBR</abbr> ABBR</p><p>MUST and NOT RECOMMENDED</p>" +
                              "<p>[[!DAHU]] [[REX]]</p></section>"
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $inl = $("#inlines", doc)
            ,   $nr = $("#normative-references", doc)
            ,   $ir = $("#informative-references", doc)
            ;
            expect($inl.find("acronym[title='ACRO-TIT']:contains('ACRO')").length).toEqual(2);
            expect($inl.find("abbr[title='ABBR-TIT']:contains('ABBR')").length).toEqual(2);
            expect($inl.find("cite a:contains('DAHU')").attr("href")).toEqual("#bib-DAHU");
            expect($inl.find("cite a:contains('REX')").attr("href")).toEqual("#bib-REX");
            expect($nr.find("dl dt").length).toEqual(1);
            expect($nr.find("dl dt:contains('[DAHU]')").length).toEqual(1);
            expect($ir.find("dl dt").length).toEqual(1);
            expect($ir.find("dl dt:contains('[REX]')").length).toEqual(1);
            flushIframes();
        });
    });
});
