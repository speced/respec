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
      }
    ,   atRiskBaseConfig = {
            editors:    [{ name: "Markus Lanthaler" }]
        ,   issueBase:  "http://example.com/issues/"
        ,   atRiskBase: "http://example.com/atrisk/"
        ,   specStatus: "WD"
      };
    it("should process issues and notes", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<section><p>BLAH <span class='issue'>ISS-INLINE</span></p><p class='issue' title='ISS-TIT'>ISSUE</p>" +
                                "<p>BLAH <span class='issue atrisk'>ATR-INLINE</span></p><p class='issue atrisk' title='ATR-TIT'>FEATURE AT RISK</p>" +
                                "<p>BLAH <span class='note'>NOT-INLINE</span></p><p class='note' title='NOT-TIT'>NOTE</p></section>")
                    },
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $iss = $("div.issue", doc).first()
            ,   $atr = $("div.atrisk", doc)
            ,   $piss = $iss.find("p")
            ,   $patr = $atr.find("p")
            ,   $spiss = $("span.issue", doc)
            ,   $spatr = $("span.atrisk", doc)
            ,   $not = $("div.note", doc)
            ,   $pnot = $not.find("p")
            ,   $spnot = $("span.note", doc)
            ;

            console.log(doc);

            expect($spiss.parent("div").length).toEqual(0);
            expect($spatr.parent("div").length).toEqual(0);
            expect($spnot.parent("div").length).toEqual(0);

            expect($iss.find("div.issue-title").length).toEqual(1);
            expect($iss.find("div.issue-title").text()).toEqual("Issue 1: ISS-TIT");
            expect($piss.attr("title")).toBeUndefined();
            expect($piss.text()).toEqual("ISSUE");

            expect($atr.find("div.issue-title").length).toEqual(1);
            expect($atr.find("div.issue-title").text()).toEqual("Feature at Risk 2: ATR-TIT");
            expect($patr.attr("title")).toBeUndefined();
            expect($patr.text()).toEqual("FEATURE AT RISK");

            expect($not.find("div.note-title").length).toEqual(1);
            expect($not.find("div.note-title").text()).toEqual("Note: NOT-TIT");
            expect($pnot.attr("title")).toBeUndefined();
            expect($pnot.text()).toEqual("NOTE");
            flushIframes();
        });
    });
    it("should process ednodes", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<section><p>BLAH <span class='ednote'>EDNOTE-INLINE</span></p><p class='ednote' title='EDNOTE-TIT'>EDNOTE</p>")
                    },
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $not = $("div.ednote", doc)
            ,   $pnot = $not.find("p")
            ,   $spnot = $("span.ednote", doc)
            ;

            console.log(doc);

            expect($not.find("div.ednote-title").length).toEqual(1);
            expect($not.find("div.ednote-title").text()).toEqual("Editor's Note: EDNOTE-TIT");
            expect($pnot.attr("title")).toBeUndefined();
            expect($pnot.text()).toEqual("EDNOTE");
            flushIframes();
        });
    });
    it("should process warnings", function () {
      var doc;
        runs(function () {
            makeRSDoc({
                        config: basicConfig
                    ,   body: $("<section><p>BLAH <span class='warning'>WARN-INLINE</span></p><p class='warning' title='WARN-TIT'>WARNING</p>" +
                                "<p class='issue' title='ISS-TIT'>ISSUE</p></section>")
                    },
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
          var $sec = $("section", doc);
          expect($sec.find(".warning").length).toEqual(2);
          expect($sec.find(".warning-title").length).toEqual(1);
          expect($sec.find(".warning-title").text()).toEqual("Warning: WARN-TIT");
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
          console.log($i10.innerHTML) ;

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
   it("should link to external issue tracker for features at risk", function () {
        var doc;
        runs(function () {
            makeRSDoc({
                        config: atRiskBaseConfig
                    ,   body: $("<section><p class='issue atrisk' data-number='10'>FEATURE AT RISK</p></section>")
                    },
                    function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            var $iss = $("div.atrisk", doc)
            ,   $piss = $iss.find("p")
            ;

            expect($iss.find("div.issue-title").length).toEqual(1);
            expect($iss.find("div.issue-title").text()).toEqual("Feature at Risk 10");
            expect($iss.find("div.issue-title a").attr("href")).toEqual(atRiskBaseConfig.atRiskBase + "10");
            expect($piss.attr("title")).toBeUndefined();
            expect($piss.text()).toEqual("FEATURE AT RISK");
            flushIframes();
        });
    });
});
