describe("Core - Utils", function () {
    var MAXOUT = 5000, utils, $;

    beforeEach(function () {
        runs(function () {
            require.config({ baseUrl: "../js/" });
            require(["jquery", "core/utils"], function (jq, u) {
                $ = jq;
                utils = u;
            });
        });
        waitsFor(function () { return utils; }, MAXOUT);
    });

    // linkCSS()
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

    // $.renameElement()
    it("should rename the element", function () {
        runs(function () {
            var $div = $("<div><p><a></a></p><b>some text</b></div>").appendTo($("body"));
            $div.find("p").renameElement("span");
            $div.find("b").renameElement("i");
            expect($div.find("span").length).toEqual(1);
            expect($div.find("i").text()).toEqual("some text");
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

    // isoDate
    it("should produce an ISO date", function () {
        runs(function () {
            expect(utils.isoDate("2013-06-25")).toMatch(/2013-06-2[45]T/) ;
            var d = new Date();
            d.setFullYear(2013);
            d.setMonth(5);
            d.setDate(25);
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            expect(utils.isoDate(d)).toMatch(/2013-06-2[45]T/);
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

    // xmlEscape
    it("should escape properly", function () {
        runs(function () {
            expect(utils.xmlEscape("&<>\"")).toEqual("&amp;&lt;&gt;&quot;");
        });
    });

    // norm
    it("should normalise text", function () {
        runs(function () {
            expect(utils.norm("  a   b   ")).toEqual("a b");
        });
    });

    // $.dfnTitle()
    it("should find the definition title", function () {
        runs(function () {
            var $dfn = $("<dfn title='DFN'><abbr title='ABBR'>TEXT</abbr></dfn>").appendTo($("body"));
            expect($dfn.dfnTitle()).toEqual("dfn");
            $dfn.removeAttr("title");
            expect($dfn.dfnTitle()).toEqual("abbr");
            $dfn.find("abbr").removeAttr("title");
            expect($dfn.dfnTitle()).toEqual("text");
            $dfn.remove();
        });
    });

    // $.makeID()
    it("should create the proper ID", function () {
        runs(function () {
            expect($("<p id='ID'></p>").makeID()).toEqual("ID");
            expect($("<p title='TITLE'></p>").makeID()).toEqual("title");
            expect($("<p>TEXT</p>").makeID()).toEqual("text");
            expect($("<p></p>").makeID(null, "PASSED")).toEqual("passed");
            expect($("<p></p>").makeID("PFX", "PASSED")).toEqual("PFX-passed");
            expect($("<p>TEXT</p>").makeID("PFX")).toEqual("PFX-text");
            var $p = $("<p>TEXT</p>");
            $p.makeID();
            expect($p.attr("id")).toEqual("text");
            expect($("<p>  A--Bé9\n C</p>").makeID()).toEqual("a--b-9-c");
            expect($("<p></p>").makeID()).toEqual("generatedID");
            expect($("<p>2017</p>").makeID()).toEqual("x2017");
            var $div = $("<div><p id='a'></p><p id='a-1'></p><span>A</span></div>").appendTo($("body"));
            expect($div.find("span").makeID()).toEqual("a-2");
            $div.remove();
        });
    });

    // $.allTextNodes()
    it("should find all the text nodes", function () {
        runs(function () {
            var tns = $("<div>aa<span>bb</span><p>cc<i>dd</i></p><pre>nope</pre></div>").allTextNodes(["pre"]);
            expect(tns.length).toEqual(4);
            var str = "";
            for (var i = 0, n = tns.length; i < n; i++) str += tns[i].nodeValue;
            expect(str).toEqual("aabbccdd");
        });
    });
});
