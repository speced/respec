describe("Core - Structure", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        ,   shortName: "foo"
        ,   trace: true
//        ,   doRDFa:  false
        }
    ,   body = "<section class='introductory'><h2>INTRO</h2></section>" +
              "<section><h2>ONE</h2><section><h2>TWO</h2><section><h2>THREE</h2><section><h2>FOUR</h2>" +
              "<section><h2>FIVE</h2><section><h2>SIX</h2></section></section></section></section></section></section>" +
              "<section class='notoc'><h2>Not in TOC</h2></section>" +
              "<section class='appendix'><h2>ONE</h2><section><h2>TWO</h2><section><h2>THREE</h2><section>" +
              "<h2>FOUR</h2><section><h2>FIVE</h2><section><h2>SIX</h2><p>[[DAHUT]]</p><p>[[!HTML5]]</p></section></section></section>" +
              "</section></section></section>"
    ;

    it("should wrap sections in a main element", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: body }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $main = $("main", doc);
            expect($main.length).toEqual(1);
            expect($main.find('> section').length).toBeGreaterThan(7);
            flushIframes();
        });
    });

    it("should not override existing main elements irrespective of where they are declared", function () {
        var doc;
        var body = "<section id=abstract><h2>fooo</h2></section><main id='customMain'><section><h2>custom main</h2></section></main>";
        runs(function () {
            makeRSDoc({ config: basicConfig, body: body }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $main = $("main", doc);
            expect($main.length).toEqual(1);
            expect($main.attr('id')).toEqual("customMain");
            expect($main.find('> section').length).toBe(1);
            expect($main.find("> section > h2").text()).toEqual("1. custom main");
            flushIframes();
        });
    });

    it("should not override existing main elements", function () {
        var doc;
        var body = "<main id='customMain'><section><h2>custom main</h2></section></main>";
        runs(function () {
            makeRSDoc({ config: basicConfig, body: body }, function (rsdoc) {
                doc = rsdoc;
            });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $main = $("main", doc);
            expect($main.length).toEqual(1);
            expect($main.attr('id')).toEqual("customMain");
            expect($main.find('> section').length).toBe(1);
            expect($main.find("> section > h2").text()).toEqual("1. custom main");
            flushIframes();
        });
    });

    it("should not add a main when there is a role=main already in doc", function () {
        var doc;
        var body = "<div id='customMain' role=main>";
        body += "<section><h2>main 1</h2></section>";
        body += "<section><h2>main 2</h2></section>";
        body += "<section><h2>main 3</h2></section>";
        body += "</div>";
        runs(function () {
            makeRSDoc({ config: basicConfig, body: body }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect(doc.querySelector("main")).toEqual(null);
            var $main = $("*[role=main]", doc);
            expect($main.length).toEqual(1);
            expect($main.attr('id')).toEqual("customMain");
            expect($main.find('> section').length).toBeGreaterThan(2);
            expect(doc.querySelector("*[role=main] > section > h2").textContent).toEqual("1. main 1");
            flushIframes();
        });
    });

    it("should build a ToC with default values", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, body: body }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        // test default values
        runs(function () {
            var $toc = $("#toc", doc)
            ;
            expect($toc.find("h2").text()).toEqual("Table of Contents");
            expect($toc.find("h2 span").attr('resource')).toEqual('xhv:heading');
            expect($toc.find("h2 span").attr('property')).toEqual('xhv:role');
            expect($toc.find("ul:first").attr('role')).toEqual('directory');
            expect($toc.find("> ul > li").length).toEqual(3);
            expect($toc.find("li").length).toEqual(15);
            expect($toc.find("> ul > li a").first().text()).toEqual("1. ONE");
            expect($toc.find("a[href='#six']").text()).toEqual("1.1.1.1.1.1 SIX");
            expect($toc.find("> ul > li").first().next().find("> a").text()).toEqual("A. ONE");
            expect($toc.find("a[href='#six-1']").text()).toEqual("A.1.1.1.1.1 SIX");
            flushIframes();
        });
    });

    it("should not build a ToC with noTOC", function () {
        // test with noTOC
        var doc;
        runs(function () {
            basicConfig.noTOC = true;
            makeRSDoc({ config: basicConfig, body: body }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $toc = $("#toc", doc)
            ;
            expect($toc.length).toEqual(0);
            flushIframes();
            delete basicConfig.noTOC;
        });
    });

    it("should include introductory sections in ToC with tocIntroductory", function () {
        // test with tocIntroductory
        var doc;
        runs(function () {
            basicConfig.tocIntroductory = true;
            makeRSDoc({ config: basicConfig, body: body }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $toc = $("#toc", doc)
            ;
            expect($toc.find("h2").text()).toEqual("Table of Contents");
            expect($toc.find("> ul > li").length).toEqual(6);
            expect($toc.find("li").length).toEqual(18);
            expect($toc.find("> ul > li a").first().text()).toEqual("Abstract");
            expect($toc.find("> ul > li a[href='#intro']").length).toEqual(1);
            flushIframes();
            delete basicConfig.tocIntroductory;
        });
    });

    it("should limit ToC depth with maxTocLevel", function () {
        // test with maxTocLevel
        var doc;
        runs(function () {
            basicConfig.maxTocLevel = 4;
            makeRSDoc({ config: basicConfig, body: body }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $toc = $("#toc", doc)
            ;
            expect($toc.find("h2").text()).toEqual("Table of Contents");
            expect($toc.find("> ul > li").length).toEqual(3);
            expect($toc.find("li").length).toEqual(11);
            expect($toc.find("> ul > li a").first().text()).toEqual("1. ONE");
            expect($toc.find("a[href='#four']").text()).toEqual("1.1.1.1 FOUR");
            expect($toc.find("> ul > li").first().next().find("> a").text()).toEqual("A. ONE");
            expect($toc.find("a[href='#four-1']").text()).toEqual("A.1.1.1 FOUR");
            flushIframes();
            delete basicConfig.maxTocLevel;
        });
    });
});
