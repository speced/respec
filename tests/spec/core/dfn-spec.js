describe("Core — Definitions", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should process definitions", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, 
                        body: $("<section id='dfn'><dfn>text</dfn><a>text</a></section>") },
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
    it("should make links <code> when their definitions are <code>", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body:
                        $("<section id='dfn'>" +
                            "<code><dfn>outerCode</dfn></code>" +
                            "<pre><dfn>outerPre</dfn></pre>" +
                            "<dfn><code>innerCode</code></dfn>" +
                            "<dfn><code>partial</code> inner code</dfn>" +
                            "<a>outerCode</a>" +
                            "<a>outerPre</a>" +
                            "<a>innerCode</a>" +
                            "<a>partial inner code</a>" +
                            "</section>") },
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#dfn", doc);
            expect($sec.find("a:contains('outerCode')").contents()[0].nodeName).toEqual("CODE");
            expect($sec.find("a:contains('outerPre')").contents()[0].nodeName).toEqual("CODE");
            expect($sec.find("a:contains('innerCode')").contents()[0].nodeName).toEqual("CODE");
            expect($sec.find("a:contains('partial')").contents()[0].nodeName).toEqual("#text");
            flushIframes();
        });
    });
    it("should process aliases", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, 
                        body: $("<section id='dfn'>" +
                                "<dfn title='text|text 1|text  2|text 3 '>text</dfn>" +
                                "<a>text</a>" +
                                "</section>") },
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#dfn", doc);
            expect($sec.find("dfn").attr("data-lt")).toEqual("text|text 1|text 2|text 3");
            expect($sec.find("dfn").attr("data-dfn-type")).toEqual("dfn");
            flushIframes();
        });
    });
    it("should allow defined dfn-type ", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, 
                        body: $("<section id='dfn'>" +
                                "<dfn dfn-type='myType'>text</dfn>" +
                                "<a>text</a>" +
                                "</section>") },
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#dfn", doc);
            expect($sec.find("dfn").attr("data-dfn-type")).toEqual("myType");
            flushIframes();
        });
    });
});
