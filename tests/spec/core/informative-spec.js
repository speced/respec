describe("Core — Informative", function () {
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
    it("should process informative sections", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<section class='informative'><h2>TITLE</h2></section><section id='sotd'>Custom SOTD</section>")
                    }, 
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $sec = $("div.informative, section.informative", doc);
            expect($sec.find("p").length).toEqual(1);
            expect($sec.find("p em").length).toEqual(1);
            expect($sec.find("p em").text()).toEqual("This section is non-normative.");
            flushIframes();
        });
    });
});
