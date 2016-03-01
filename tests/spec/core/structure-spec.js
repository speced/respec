describe("Core - Structure", function () {

    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
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
    it("should build a ToC with default values", function () {


            makeRSDoc({ config: makeBasicConfig(), body: body }, function (doc) {  });

        // test default values

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


            basicConfig.noTOC = true;
            makeRSDoc({ config: makeBasicConfig(), body: body }, function (doc) {  });


            var $toc = $("#toc", doc)
            ;
            expect($toc.length).toEqual(0);
            flushIframes();
            delete basicConfig.noTOC;
        });
    });

    it("should include introductory sections in ToC with tocIntroductory", function () {
        // test with tocIntroductory


            basicConfig.tocIntroductory = true;
            makeRSDoc({ config: makeBasicConfig(), body: body }, function (doc) {  });


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


            basicConfig.maxTocLevel = 4;
            makeRSDoc({ config: makeBasicConfig(), body: body }, function (doc) {  });


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
