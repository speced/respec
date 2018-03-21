"use strict";
describe("Core — Issues and Notes", function() {
  afterAll(flushIframes);
  it("should process issues and notes", async () => {
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
    const doc = await makeRSDoc(ops);
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
  });

  it("should process ednotes", async () => {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p>BLAH <span class='ednote'>EDNOTE-INLINE</span></p>" +
        "<p class='ednote' title='EDNOTE-TIT'>EDNOTE</p>",
    };
    const doc = await makeRSDoc(ops);
    var $not = $("div.ednote", doc);
    var $pnot = $not.find("p");
    expect($not.find("div.ednote-title").length).toEqual(1);
    expect($not.find("div.ednote-title").text()).toEqual(
      "Editor's note: EDNOTE-TIT"
    );
    expect($pnot.attr("title")).toBeUndefined();
    expect($pnot.text()).toEqual("EDNOTE");
  });

  it("should process warnings", async () => {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p>BLAH <span class='warning'>WARN-INLINE</span></p>" +
        "<p class='warning' title='WARN-TIT'>WARNING</p>" +
        "<p class='issue' title='ISS-TIT'>ISSUE</p></section>",
    };
    const doc = await makeRSDoc(ops);
    var $sec = $("section", doc);
    expect($sec.find(".warning").length).toEqual(2);
    expect($sec.find(".warning-title").length).toEqual(1);
    expect($sec.find(".warning-title").text()).toEqual("Warning: WARN-TIT");
  });

  it("should use data-number for issue and note numbers", async () => {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p id='i10' class='issue' data-number='10'>Numbered ISSUE</p>" +
        "<p id='i11' class='issue' title='ISS-TIT' data-number='11'>Titled and Numbered Issue</p>" +
        "<p id='ixx' class='issue'>Unnumbered ISSUE</p></section>",
    };
    const doc = await makeRSDoc(ops);
    var $i10 = $("#i10", doc).parent("div");
    var $i11 = $("#i11", doc).parent("div");
    var $ixx = $("#ixx", doc).parent("div");
    expect($i10.find("div.issue-title").length).toEqual(1);
    expect($i10.find("div.issue-title").text()).toEqual("Issue 10");

    expect($i11.find("div.issue-title").length).toEqual(1);
    expect($i11.find("div.issue-title").text()).toEqual("Issue 11: ISS-TIT");

    expect($ixx.find("div.issue-title").length).toEqual(1);
    expect($ixx.find("div.issue-title").text()).toEqual("Issue");
  });

  it("shows labels for github issues", async () => {
    const githubConfig = {
      github: "https://github.com/mock-company/mock-repository",
      githubAPI: `${window.location.origin}/tests/data`,
    };
    const ops = {
      config: githubConfig,
      body:
        makeDefaultBody() +
        `
        <div class='issue' data-number='1540'>issue is open on github</div>
        <div class='issue' id='this-is-404' data-number='404'>this is 404</div>
        <section id='issue-summary'></section>
        `,
    };
    const doc = await makeRSDoc(ops);

    const issueDiv = doc.getElementById("issue-1540");
    expect(issueDiv).toBeTruthy();

    const issueDiv404 = doc.getElementById("this-is-404");
    expect(issueDiv404).toBeTruthy();
    expect(issueDiv404.innerText).toEqual("this is 404");

    const [refactorLabel, bugLabel, blankLabel, invalidLabel] = doc.getElementsByClassName("respec-gh-label");

    expect(refactorLabel.innerText).toEqual("refactor");
    expect(refactorLabel.classList).toContain("respec-gh-label", "respec-label-light");
    expect(refactorLabel.style.backgroundColor).toEqual("rgb(71, 244, 65)");
    expect(refactorLabel.href).toEqual("https://github.com/mock-company/mock-repository/issues/?q=is%3Aissue+is%3Aopen+label%3A%22refactor%22");

    expect(bugLabel.innerText).toEqual("bug");
    expect(bugLabel.classList).toContain("respec-gh-label", "respec-label-dark");
    expect(bugLabel.style.backgroundColor).toEqual("rgb(244, 66, 92)");
    expect(bugLabel.href).toEqual("https://github.com/mock-company/mock-repository/issues/?q=is%3Aissue+is%3Aopen+label%3A%22bug%22");

    expect(blankLabel.innerText).toEqual("blank");
    expect(blankLabel.classList).toContain("respec-gh-label", "respec-label-dark");
    expect(blankLabel.href).toEqual("https://github.com/mock-company/mock-repository/issues/?q=is%3Aissue+is%3Aopen+label%3A%22blank%22");

    expect(invalidLabel.innerText).toEqual("not-a-color");
    expect(invalidLabel.classList).toContain("respec-gh-label", "respec-label-dark");
    expect(invalidLabel.href).toEqual("https://github.com/mock-company/mock-repository/issues/?q=is%3Aissue+is%3Aopen+label%3A%22not-a-color%22");
  });

  it("should link to external issue tracker", function (done) {
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
    const doc = await makeRSDoc(ops);
    var $iss = $("div.issue", doc);
    var $piss = $iss.find("p");
    expect($iss.find("div.issue-title").length).toEqual(1);
    expect($iss.find("div.issue-title").text()).toEqual("Issue 10");
    expect($iss.find("div.issue-title a").attr("href")).toEqual(
      issueBaseConfig.issueBase + "10"
    );
    expect($piss.attr("title")).toBeUndefined();
    expect($piss.text()).toEqual("ISSUE");
  });

  it("removes closed issues from spec", async () => {
    const githubConfig = {
      github: "https://github.com/mock-company/mock-repository",
      githubAPI: `${window.location.origin}/tests/data`,
    };
    const ops = {
      config: githubConfig,
      body:
        makeDefaultBody() +
        `
        <div class='issue' id='this-should-not-exist' data-number='1548'>issue is closed on github</div>
        <div class='issue' data-number='1540'>issue is open on github</div>
        <div class='issue' id='i-should-be-here-too'>regular issue</div>
        <div class='issue' id='this-is-404' data-number='404'>this is 404</div>
        <section id='issue-summary'></section>
<<<<<<< HEAD
      `,
=======
        `
>>>>>>> feat(core/issues-notes): show github labels
    };
    const doc = await makeRSDoc(ops);
    const issueDiv1 = doc.getElementById("this-should-not-exist");
    expect(issueDiv1).toBeFalsy();
    const issueDiv2 = doc.getElementById("issue-1540");
    expect(issueDiv2).toBeTruthy();
    const issueDiv3 = doc.getElementById("i-should-be-here-too");
    expect(issueDiv3).toBeTruthy();
    const summarySection = doc.getElementById("issue-summary");
    expect(summarySection).toBeTruthy();
    const { innerText } = summarySection.querySelector("[href='#issue-1540']");
    expect(innerText).toBe("Issue 1540");
    const issueDiv404 = doc.getElementById("this-is-404");
    expect(issueDiv404).toBeTruthy();
    expect(issueDiv404.textContent).toEqual("this is 404");
  });

  it("should link to external issue tracker for features at risk", async () => {
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
    const doc = await makeRSDoc(ops);
    var $iss = $("div.atrisk", doc);
    var $piss = $iss.find("p");
    expect($iss.find("div.issue-title").length).toEqual(1);
    expect($iss.find("div.issue-title").text()).toEqual("Feature at Risk 10");
    expect($iss.find("div.issue-title a").attr("href")).toEqual(
      atRiskBaseConfig.atRiskBase + "10"
    );
    expect($piss.attr("title")).toBeUndefined();
    expect($piss.text()).toEqual("FEATURE AT RISK");
  });
});
