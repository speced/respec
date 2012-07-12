describe("Core - Figures", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should have handled figures", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig,
                        body: "<section><section id='figs'><div class='figure'><pre title='PREFIG'>PRE</pre></div>" +
                              "<img src='IMG' title='IMGTIT' class='figure'/></section><section id='tof'></section></section>"
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $figs = $("#figs", doc)
            ,   $tof = $("#tof", doc)
            ;
            expect($figs.find("figure").length).toEqual(2);
            expect($figs.find("figure figcaption").length).toEqual(2);
            expect($figs.find("figure figcaption").first().text()).toEqual("Fig. 1 PREFIG");
            expect($figs.find("figure figcaption").last().text()).toEqual("Fig. 2 IMGTIT");
            expect($tof.find("h3:contains('Table of Figures')").length).toEqual(1);
            expect($tof.find("ul li").length).toEqual(2);
            expect($tof.find("ul li a").first().text()).toEqual("Fig. 1 PREFIG");
            expect($tof.find("ul li a").last().text()).toEqual("Fig. 2 IMGTIT");
            flushIframes();
        });
    });
});
