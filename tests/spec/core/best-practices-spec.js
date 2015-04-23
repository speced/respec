describe("Core — Best Practices", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        ,   shortName: "mydoc"
        ,   previousURI:  "http://www.example.com"
        ,   previousMaturity: "WD"
        ,   previousPublishDate:  "2014-01-01"
        }
    ;
    it("should process examples", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<section><span class='practicelab'>BP1</span><span class='practicelab'>BP2</span>"
                            +   "<section id='bp-summary'></section></section>"
                            +   "<section id='sotd'>Custom status</section>")
                    }, 
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $pls = $("span.practicelab", doc)
            ,   $bps = $("#bp-summary", doc)
            ;
            
            expect($pls.first().text()).toEqual("Best Practice 1: BP1");
            expect($pls.last().text()).toEqual("Best Practice 2: BP2");
            expect($bps.find("h2, h3, h4, h5, h6").text()).toEqual("Best Practices Summary");
            expect($bps.find("ul li").length).toEqual(2);
            flushIframes();
        });
    });
});
