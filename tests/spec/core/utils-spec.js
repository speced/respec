describe("Core — Utils", function () {
    var MAXOUT = 5000, utils;
    runs(function () {
        require(["../../../js/core/utils"], function (u) { utils = u; });
    });
    waitsFor(function () { return utils; }, MAXOUT);
    it("should add a link element", function () {
        runs(function () {
            utils.linkCSS(document, "BOGUS");
            expect($("link[href='BOGUS']").length == 1).toBeTruthy();
            $("link[href='BOGUS']").remove();
        });
    });
    it("should add several link elements", function () {
        runs(function () {
            utils.linkCSS(document, ["BOGUS", "BOGUS", "BOGUS"]);
            expect($("link[href='BOGUS']").length == 3).toBeTruthy();
            $("link[href='BOGUS']").remove();
        });
    });
});