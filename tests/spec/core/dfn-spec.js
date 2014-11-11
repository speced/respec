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
            expect($sec.find("dfn").attr("data-title")).toEqual("text");
            expect($sec.find("a").attr("href")).toEqual("#dfn-text");
            flushIframes();
        });
    });
    it("should allow aliases", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='dfn'><dfn data-title='text|the text|  more text'>text</dfn><a>more text</a></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#dfn", doc);
            expect($sec.find("dfn").attr("id")).toEqual("dfn-text");
            expect($sec.find("dfn").attr("data-title")).toEqual("text|the text|  more text");
            expect($sec.find("a").attr("href")).toEqual("#dfn-text");
            flushIframes();
        });
    });
    it("should allow scoping", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='dfn' data-dfn-type='myScope'><dfn data-title='text|the text|  more text'>text</dfn></section><section id='ref' data-dfn-type='myScope'><a>more text</a></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#dfn", doc);
            expect($sec.find("dfn").attr("id")).toEqual("dfn-myscope-text");
            var $ref = $("#ref", doc);
            expect($ref.find("a").attr("href")).toEqual("#dfn-myscope-text");
            flushIframes();
        });
    });
    it("should allow local aliases", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='dfn'><dfn data-local-title='local' title='text|the text|  more text'>text</dfn><a>local</a></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#dfn", doc);
            expect($sec.find("dfn").attr("id")).toEqual("dfn-text");
            expect($sec.find("dfn").attr("data-local-title")).toBeUndefined();
            expect($sec.find("a").attr("href")).toEqual("#dfn-text");
            flushIframes();
        });
    });
});
