describe("Core — Utils", function () {
    var MAXOUT = 5000, utils;

    // linkCSS()
    it("should add a link element", function () {
        runs(function () {
            require(["../../../js/core/utils"], function (u) { utils = u; });
        });
        waitsFor(function () { return utils; }, MAXOUT);
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

    // $.renameElement()
    it("should rename the element", function () {
        runs(function () {
            var $div = $("<div><p><a></a></p></div>").appendTo($("body"));
            $div.find("p").renameElement("span");
            expect($div.find("span").length == 1).toBeTruthy();
            $div.remove();
        });
    });

    // lead0
    it("should prepend 0 only when needed", function () {
        runs(function () {
            expect(utils.lead0("1")).toEqual("01");
            expect(utils.lead0("01")).toEqual("01");
        });
    });

    // concatDate
    it("should format the date as needed", function () {
        runs(function () {
            var d = new Date();
            d.setFullYear(1977);
            d.setMonth(2);
            d.setDate(15);
            expect(utils.concatDate(d)).toEqual("19770315");
            expect(utils.concatDate(d, "-")).toEqual("1977-03-15");
        });
    });

    // parseSimpleDate
    it("should parse a simple date", function () {
        runs(function () {
            var d = utils.parseSimpleDate("1977-03-15");
            expect(d.getFullYear()).toEqual(1977);
            expect(d.getMonth()).toEqual(2);
            expect(d.getDate()).toEqual(15);
        });
    });

    // parseLastModified
    it("should parse a date in lastModified format", function () {
        runs(function () {
            var d = utils.parseLastModified("03/15/1977 13:05:42");
            expect(d.getFullYear()).toEqual(1977);
            expect(d.getMonth()).toEqual(2);
            expect(d.getDate()).toEqual(15);
        });
    });

    // humanDate
    it("should produce a human date", function () {
        runs(function () {
            expect(utils.humanDate("1977-03-15")).toEqual("15 March 1977");
            var d = new Date();
            d.setFullYear(1977);
            d.setMonth(2);
            d.setDate(15);
            expect(utils.humanDate(d)).toEqual("15 March 1977");
        });
    });

    // joinAnd
    it("should join with proper commas and 'and'", function () {
        runs(function () {
            expect(utils.joinAnd([])).toEqual("");
            expect(utils.joinAnd(["x"])).toEqual("x");
            expect(utils.joinAnd(["x", "x"])).toEqual("x and x");
            expect(utils.joinAnd(["x", "x", "x"])).toEqual("x, x, and x");
            expect(utils.joinAnd(["x", "x", "x", "x"])).toEqual("x, x, x, and x");
            expect(utils.joinAnd(["x", "x", "x", "x"], function (str) { return str.toUpperCase(); })).toEqual("X, X, X, and X");
        });
    });
});