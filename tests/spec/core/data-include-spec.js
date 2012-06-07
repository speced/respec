describe("W3C — Data Include", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    // this does not test much, someone for whom this is important should provide more tests
    it("should include an external file", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: $("<section id='includes'><div data-include='spec/core/inc.html'></div></section>") }, 
                      function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("#includes", doc);
            expect($sec.find("p").length).toEqual(1);
            expect($sec.find("p").text()).toEqual("INCLUDED");
            expect($sec.find("div > p").length).toEqual(1);
            expect($sec.find("div > p").attr("data-include")).toBeFalsy();
            flushIframes();
        });
    });
});
