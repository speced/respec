describe("Core — Issues and Notes", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        }
    ,   issueBaseConfig = {
            editors:    [{ name: "Gregg Kellogg" }]
        ,   issueBase:  "http://example.com/issues/"
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
    it("should use data-number for issue and note numbers", function () {
      var doc;
      runs(function () {
          makeRSDoc({
                      config: basicConfig
                  ,   body: $("<section><p id='i10' class='issue' data-number='10'>Numbered ISSUE</p><p id='i11' class='issue' title='ISS-TIT' data-number='11'>Titled and Numbered Issue</p><p id='ixx' class='issue'>Unnumbered ISSUE</p></section>")
                  },
                  function (rsdoc) { doc = rsdoc; });
      });
      waitsFor(function () { return doc; }, MAXOUT);
      runs(function () {
          var $i10 = $("#i10", doc).parent('div')
          ,   $i11 = $("#i11", doc).parent('div')
          ,   $ixx = $("#ixx", doc).parent('div')
          ;

          expect($i10.find("div.issue-title").length).toEqual(1);
          expect($i10.find("div.issue-title").text()).toEqual("Issue 10");

          expect($i11.find("div.issue-title").length).toEqual(1);
          expect($i11.find("div.issue-title").text()).toEqual("Issue 11: ISS-TIT");

          expect($ixx.find("div.issue-title").length).toEqual(1);
          expect($ixx.find("div.issue-title").text()).toEqual("Issue");
          flushIframes();
      });
    });
    it("should link to external issue tracker", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: issueBaseConfig
                    ,   body: $("<section><p class='issue' data-number='10'>ISSUE</p></section>")
                    },
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $iss = $("div.issue", doc)
            ,   $piss = $iss.find("p")
            ;

            expect($iss.find("div.issue-title").length).toEqual(1);
            expect($iss.find("div.issue-title").text()).toEqual("Issue 10");
            expect($iss.find("div.issue-title a").attr("href")).toEqual(issueBaseConfig.issueBase + "10");
            expect($piss.attr("title")).toBeUndefined();
            expect($piss.text()).toEqual("ISSUE");
            flushIframes();
        });
    });
});
