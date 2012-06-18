describe("Core — Issues and Notes", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        };
    it("should process issues and notes", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<section><p>BLAH <span class='issue'>ISS-INLINE</span></p><p class='issue' title='ISS-TIT'>ISSUE</p>" +
                                "<p>BLAH <span class='note'>NOT-INLINE</span></p><p class='note' title='NOT-TIT'>NOTE</p></section>")
                    },
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $iss = $("div.issue", doc)
            ,   $piss = $iss.find("p")
            ,   $spiss = $("span.issue", doc)
            ,   $not = $("div.note", doc)
            ,   $pnot = $not.find("p")
            ,   $spnot = $("span.note", doc)
            ;

            expect($spiss.parent("div").length).toEqual(0);
            expect($spnot.parent("div").length).toEqual(0);

            expect($iss.find("div.issue-title").length).toEqual(1);
            expect($iss.find("div.issue-title").text()).toEqual("Issue 1: ISS-TIT");
            expect($piss.attr("title")).toBeUndefined();
            expect($piss.text()).toEqual("ISSUE");

            expect($not.find("div.note-title").length).toEqual(1);
            expect($not.find("div.note-title").text()).toEqual("Note: NOT-TIT");
            expect($pnot.attr("title")).toBeUndefined();
            expect($pnot.text()).toEqual("NOTE");
            flushIframes();
        });
    });
});
