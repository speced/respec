describe("Core — Examples", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should process examples", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<section><pre class='example' title='EX'>\n  {\n    CONTENT\n  }\n  </pre></section>")
                    },
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $ex = $("pre.example", doc)
            ,   $div = $ex.parent("div")
            ;
            expect($div.hasClass("example")).toBeTruthy();
            expect($div.find("div.example-title").length).toEqual(1);
            expect($div.find("div.example-title").text()).toEqual("Example 1: EX");
            expect($ex.attr("title")).toBeUndefined();
            expect($ex.text()).toEqual("{\n  CONTENT\n}");
            flushIframes();
        });
    });
});
