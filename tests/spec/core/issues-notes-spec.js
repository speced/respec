"use strict";
describe("Core — Issues and Notes", function() {
  afterAll(flushIframes);
  it("should process issues and notes", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p>BLAH <span class='issue'>ISS-INLINE</span></p>" +
        "<p class='issue' title='ISS-TIT'>ISSUE</p>" +
        "<p>BLAH <span class='issue atrisk'>ATR-INLINE</span></p>" +
        "<p class='issue atrisk' title='ATR-TIT'>FEATURE AT RISK</p>" +
        "<p>BLAH <span class='note'>NOT-INLINE</span></p>" +
        "<p class='note' title='NOT-TIT'>NOTE</p></section>",
    };
    makeRSDoc(
      ops,
      function(doc) {
        var $iss = $("div.issue", doc).first();
        var $atr = $("div.atrisk", doc);
        var $piss = $iss.find("p");
        var $patr = $atr.find("p");
        var $spiss = $("span.issue", doc);
        var $spatr = $("span.atrisk", doc);
        var $not = $("div.note", doc);
        var $pnot = $not.find("p");
        var $spnot = $("span.note", doc);

        expect($spiss.parent("div").length).toEqual(0);
        expect($spatr.parent("div").length).toEqual(0);
        expect($spnot.parent("div").length).toEqual(0);

        expect($iss.find("div.issue-title").length).toEqual(1);
        expect($iss.find("div.issue-title").text()).toEqual("Issue 1: ISS-TIT");
        expect($piss.attr("title")).toBeUndefined();
        expect($piss.text()).toEqual("ISSUE");

        expect($atr.find("div.issue-title").length).toEqual(1);
        expect($atr.find("div.issue-title").text()).toEqual(
          "Feature at Risk 2: ATR-TIT"
        );
        expect($patr.attr("title")).toBeUndefined();
        expect($patr.text()).toEqual("FEATURE AT RISK");

        expect($not.find("div.note-title").length).toEqual(1);
        expect($not.find("div.note-title").text()).toEqual("Note: NOT-TIT");
        expect($pnot.attr("title")).toBeUndefined();
        expect($pnot.text()).toEqual("NOTE");
        done();
      },
      null,
      "display: block;"
    );
  });

  it("should process ednotes", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p>BLAH <span class='ednote'>EDNOTE-INLINE</span></p>" +
        "<p class='ednote' title='EDNOTE-TIT'>EDNOTE</p>",
    };
    makeRSDoc(
      ops,
      function(doc) {
        var $not = $("div.ednote", doc);
        var $pnot = $not.find("p");
        expect($not.find("div.ednote-title").length).toEqual(1);
        expect($not.find("div.ednote-title").text()).toEqual(
          "Editor's note: EDNOTE-TIT"
        );
        expect($pnot.attr("title")).toBeUndefined();
        expect($pnot.text()).toEqual("EDNOTE");
        done();
      },
      null,
      "display: block;"
    );
  });

  it("should process warnings", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p>BLAH <span class='warning'>WARN-INLINE</span></p>" +
        "<p class='warning' title='WARN-TIT'>WARNING</p>" +
        "<p class='issue' title='ISS-TIT'>ISSUE</p></section>",
    };
    makeRSDoc(
      ops,
      function(doc) {
        var $sec = $("section", doc);
        expect($sec.find(".warning").length).toEqual(2);
        expect($sec.find(".warning-title").length).toEqual(1);
        expect($sec.find(".warning-title").text()).toEqual("Warning: WARN-TIT");
        done();
      },
      null,
      "display: block;"
    );
  });

  it("should use data-number for issue and note numbers", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p id='i10' class='issue' data-number='10'>Numbered ISSUE</p>" +
        "<p id='i11' class='issue' title='ISS-TIT' data-number='11'>Titled and Numbered Issue</p>" +
        "<p id='ixx' class='issue'>Unnumbered ISSUE</p></section>",
    };
    makeRSDoc(
      ops,
      function(doc) {
        var $i10 = $("#i10", doc).parent("div");
        var $i11 = $("#i11", doc).parent("div");
        var $ixx = $("#ixx", doc).parent("div");
        expect($i10.find("div.issue-title").length).toEqual(1);
        expect($i10.find("div.issue-title").text()).toEqual("Issue 10");

        expect($i11.find("div.issue-title").length).toEqual(1);
        expect($i11.find("div.issue-title").text()).toEqual(
          "Issue 11: ISS-TIT"
        );

        expect($ixx.find("div.issue-title").length).toEqual(1);
        expect($ixx.find("div.issue-title").text()).toEqual("Issue");
        done();
      },
      null,
      "display: block;"
    );
  });

  it("should link to external issue tracker", function(done) {
    var issueBaseConfig = {
      editors: [
        {
          name: "Gregg Kellogg",
        },
      ],
      issueBase: "http://example.com/issues/",
      specStatus: "FPWD",
      shortName: "foo",
    };
    var ops = {
      config: issueBaseConfig,
      body:
        makeDefaultBody() +
        "<section><p class='issue' data-number='10'>ISSUE</p></section>",
    };
    makeRSDoc(
      ops,
      function(doc) {
        var $iss = $("div.issue", doc);
        var $piss = $iss.find("p");
        expect($iss.find("div.issue-title").length).toEqual(1);
        expect($iss.find("div.issue-title").text()).toEqual("Issue 10");
        expect($iss.find("div.issue-title a").attr("href")).toEqual(
          issueBaseConfig.issueBase + "10"
        );
        expect($piss.attr("title")).toBeUndefined();
        expect($piss.text()).toEqual("ISSUE");
        done();
      },
      null,
      "display: block;"
    );
  });

  it("should link to external issue tracker for features at risk", function(
    done
  ) {
    var atRiskBaseConfig = {
      editors: [
        {
          name: "Markus Lanthaler",
        },
      ],
      issueBase: "http://example.com/issues/",
      atRiskBase: "http://example.com/atrisk/",
      specStatus: "FPWD",
      shortName: "foo",
    };
    var ops = {
      config: atRiskBaseConfig,
      body:
        makeDefaultBody() +
        "<section><p class='issue atrisk' data-number='10'>FEATURE AT RISK</p></section>",
    };
    makeRSDoc(
      ops,
      function(doc) {
        var $iss = $("div.atrisk", doc);
        var $piss = $iss.find("p");
        expect($iss.find("div.issue-title").length).toEqual(1);
        expect($iss.find("div.issue-title").text()).toEqual(
          "Feature at Risk 10"
        );
        expect($iss.find("div.issue-title a").attr("href")).toEqual(
          atRiskBaseConfig.atRiskBase + "10"
        );
        expect($piss.attr("title")).toBeUndefined();
        expect($piss.text()).toEqual("FEATURE AT RISK");
        done();
      },
      null,
      "display: block;"
    );
  });
});
