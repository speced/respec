describe("Core — Definitions", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should process definitions", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='dfn'><dfn>text</dfn><a>text</a></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#dfn", doc);
            expect($sec.find("dfn").attr("id")).toEqual("dfn-text");
            expect($sec.find("a").attr("href")).toEqual("#dfn-text");
            expect($sec.attr("aria-labelledby")).toEqual("dfn-text");
            expect($sec.find("dfn").attr("aria-describedby")).toEqual("dfn");
            expect($sec.find("a").attr("aria-describedby")).toEqual("dfn");
            flushIframes();
        });
    });
    it("definition lists should have aria markup", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='test'><dl><dt><dfn>text</dfn></dt><dd>The definition of text</dd></dl></section><section id='prose'><p>Some content that references <a>text</a>.</p></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#test", doc)
            ,   $con = $("#prose", doc)
            ;
            expect($sec.find("dfn").attr("id")).toEqual("dfn-text");
            expect($sec.find("dfn").attr("aria-describedby")).toEqual("desc-text");
            expect($sec.find("dd").attr("aria-labelledby")).toEqual("dfn-text");
            expect($sec.find("dd").attr("role")).toEqual("definition");

            expect($con.find("a").attr("href")).toEqual("#dfn-text");
            expect($con.find("a").attr("aria-describedby")).toEqual("desc-text");
            expect($con.find("a").attr("aria-label")).toEqual("Definition: text");
            flushIframes();
        });
    });
});
