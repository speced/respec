describe("Core - Section References", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        ,   shortName: "mydoc"
        ,   previousURI:  "http://www.example.com"
        ,   previousMaturity: "WD"
        ,   previousPublishDate:  "2014-01-01"
        }
    ,   body = "<section id='sotd'>Custom SOTD</section>"
    ;
    it("should have produced the section reference", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig,
                        body: "<section id='ONE'><h2>ONE</h2></section><section id='TWO'><a href='#ONE' class='sectionRef'></a></section>" + body
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $one = $("#ONE", doc)
            ,   $two = $("#TWO", doc)
            ,   tit = $one.find("> :first-child").text()
            ;
            expect($two.find("a").text()).toEqual("section " + tit);
            flushIframes();
        });
    });
});
