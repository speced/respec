"use strict";
describe("Core — Issues and Notes", () => {
  let utils;
  beforeAll(done => {
    require(["core/utils"], u => {
      utils = u;
      done();
    });
  });
  afterAll(flushIframes);
  it("treats each issue as unique", async () => {
    const body = `
      <section>
        <h2>Test issues</h2>
        <div class="issue" id=override-123 data-number=123></div>
        <div class="issue" data-number=123></div>
        <p class="issue" data-number=123></p>
      </section>
      <section id="issue-summary"></section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const issues = doc.querySelectorAll(".issue");
    expect(issues.length).toBe(3);
    const [
      overriddenIdIssue,
      firstDuplicateIssue,
      secondDuplicateIssue,
    ] = issues;
    expect(overriddenIdIssue.id).toBe("override-123");
    expect(firstDuplicateIssue.id).not.toBe(secondDuplicateIssue.id);

    const issueSummaryItems = doc.querySelectorAll("#issue-summary li a");
    expect(issueSummaryItems.length).toBe(3);
    const [firstItem, secondItem, thirdItem] = issueSummaryItems;
    expect(firstItem.hash).toBe(`#${overriddenIdIssue.id}`);
    expect(secondItem.hash).toBe(`#${firstDuplicateIssue.id}`);
    expect(thirdItem.hash).toBe(`#${secondDuplicateIssue.id}`);
  });
  it("should process issues and notes", async () => {
    const ops = {
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
    const iss = doc.querySelector("div.issue", doc);
    const atr = doc.querySelector("div.atrisk");
    const spiss = doc.querySelector("span.issue");
    const spatr = doc.querySelector("span.atrisk");
    const not = doc.querySelector("div.note");
    const spnot = doc.querySelector("span.note");

    expect(utils.parents(spiss, "div").length).toEqual(0);
    expect(utils.parents(spatr, "div").length).toEqual(0);
    expect(utils.parents(spnot, "div").length).toEqual(0);

    expect(iss.querySelectorAll("div.issue-title").length).toEqual(1);
    expect(iss.querySelector("div.issue-title").textContent).toEqual(
      "Issue 1: ISS-TIT"
    );
    expect(iss.querySelector("p").getAttribute("title")).toBeNull();
    expect(iss.querySelector("p").textContent).toEqual("ISSUE");

    expect(atr.querySelectorAll("div.issue-title").length).toEqual(1);
    expect(atr.querySelector("div.issue-title").textContent).toEqual(
      "Feature at Risk 2: ATR-TIT"
    );
    expect(atr.querySelector("p").getAttribute("title")).toBeNull();
    expect(atr.querySelector("p").textContent).toEqual("FEATURE AT RISK");

    expect(not.querySelectorAll("div.note-title").length).toEqual(1);
    expect(not.querySelector("div.note-title").textContent).toEqual(
      "Note: NOT-TIT"
    );
    expect(not.querySelector("p").getAttribute("title")).toBeNull();
    expect(not.querySelector("p").textContent).toEqual("NOTE");
  });

  it("should process ednotes", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p>BLAH <span class='ednote'>EDNOTE-INLINE</span></p>" +
        "<p class='ednote' title='EDNOTE-TIT'>EDNOTE</p>",
    };
    const doc = await makeRSDoc(ops);
    const not = doc.querySelector("div.ednote");
    expect(not.querySelectorAll("div.ednote-title").length).toEqual(1);
    expect(not.querySelector("div.ednote-title").textContent).toEqual(
      "Editor's note: EDNOTE-TIT"
    );
    expect(not.querySelector("p").getAttribute("title")).toBeNull();
    expect(not.querySelector("p").textContent).toEqual("EDNOTE");
  });

  it("should process warnings", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section><p>BLAH <span class='warning'>WARN-INLINE</span></p>" +
        "<p class='warning' title='WARN-TIT'>WARNING</p>" +
        "<p class='issue' title='ISS-TIT'>ISSUE</p></section>",
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll("section .warning").length).toEqual(2);
    expect(doc.querySelectorAll("section .warning-title").length).toEqual(1);
    expect(doc.querySelector("section .warning-title").textContent).toEqual(
      "Warning: WARN-TIT"
    );
  });

  it("should use data-number for issue and note numbers", async () => {
    const body = `
      <section>
        <p id='i10' class='issue' data-number='10'>Numbered ISSUE</p>
        <p id='i11' class='issue' title='ISS-TIT' data-number='11'>Titled and Numbered Issue</p>
        <p id='ixx' class='issue'>Unnumbered ISSUE</p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const [i10, i11, ixx] = doc.querySelectorAll(".issue .issue-title");
    expect(i10.textContent).toEqual("Issue 10");
    expect(i11.textContent).toEqual("Issue 11: ISS-TIT");
    expect(ixx.textContent).toEqual("Issue");
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
    const issueDiv = doc.querySelector(".issue");
    expect(issueDiv).toBeTruthy();
    const issueTitle = doc.getElementById("h-issue");
    expect(issueTitle.textContent).toBe(
      "Issue 1540: A mock open issue for testing refactorbugblanknot-a-color"
    );

    const issueDiv404 = doc.getElementById("this-is-404");

    expect(issueDiv404).toBeTruthy();
    expect(
      issueDiv404.querySelector("div:not(.issue-title)").textContent
    ).toEqual("this is 404");

    const [
      refactorLabel,
      bugLabel,
      blankLabel,
      invalidLabel,
    ] = doc.getElementsByClassName("respec-gh-label");

    expect(refactorLabel.textContent).toEqual("refactor");
    expect(refactorLabel.classList).toContain(
      "respec-gh-label",
      "respec-label-light"
    );
    expect(refactorLabel.style.backgroundColor).toEqual("rgb(71, 244, 65)");
    expect(refactorLabel.href).toEqual(
      "https://github.com/mock-company/mock-repository/issues/?q=is%3Aissue+is%3Aopen+label%3A%22refactor%22"
    );

    expect(bugLabel.textContent).toEqual("bug");
    expect(bugLabel.classList).toContain(
      "respec-gh-label",
      "respec-label-dark"
    );
    expect(bugLabel.style.backgroundColor).toEqual("rgb(244, 66, 92)");
    expect(bugLabel.href).toEqual(
      "https://github.com/mock-company/mock-repository/issues/?q=is%3Aissue+is%3Aopen+label%3A%22bug%22"
    );

    expect(blankLabel.textContent).toEqual("blank");
    expect(blankLabel.classList).toContain(
      "respec-gh-label",
      "respec-label-dark"
    );
    expect(blankLabel.href).toEqual(
      "https://github.com/mock-company/mock-repository/issues/?q=is%3Aissue+is%3Aopen+label%3A%22blank%22"
    );

    expect(invalidLabel.textContent).toEqual("not-a-color");
    expect(invalidLabel.classList).toContain(
      "respec-gh-label",
      "respec-label-dark"
    );
    expect(invalidLabel.href).toEqual(
      "https://github.com/mock-company/mock-repository/issues/?q=is%3Aissue+is%3Aopen+label%3A%22not-a-color%22"
    );
  });

  it("should link to external issue tracker", async () => {
    const issueBaseConfig = {
      editors: [
        {
          name: "Gregg Kellogg",
        },
      ],
      issueBase: "http://example.com/issues/",
      specStatus: "FPWD",
      shortName: "foo",
    };
    const ops = {
      config: issueBaseConfig,
      body:
        makeDefaultBody() +
        "<section><p class='issue' data-number='10'>ISSUE</p></section>",
    };
    const doc = await makeRSDoc(ops);
    const iss = doc.querySelector("div.issue");
    expect(iss.querySelectorAll("div.issue-title").length).toEqual(1);
    expect(iss.querySelector("div.issue-title").textContent).toEqual(
      "Issue 10"
    );
    expect(iss.querySelector("div.issue-title a").getAttribute("href")).toEqual(
      issueBaseConfig.issueBase + "10"
    );
    expect(iss.querySelector("p").getAttribute("title")).toBeNull();
    expect(iss.querySelector("p").textContent).toEqual("ISSUE");
  });

  it("marks closed issues as closed in the spec", async () => {
    const githubConfig = {
      github: "https://github.com/mock-company/mock-repository",
      githubAPI: `${window.location.origin}/tests/data`,
    };
    const ops = {
      config: githubConfig,
      body:
        makeDefaultBody() +
        `
        <div class='issue' id='this-should-exist' data-number='1548'>issue is closed on github</div>
        <div class='issue' data-number='1540'>issue is open on github</div>
        <div class='issue' id='i-should-be-here-too'>regular issue</div>
        <div class='issue' id='this-is-404' data-number='404'>this is 404</div>
        <section id='issue-summary'></section>
      `,
    };
    const doc = await makeRSDoc(ops);
    const issueDiv1 = doc.getElementById("this-should-exist");
    expect(issueDiv1).toBeTruthy();
    expect(issueDiv1.classList.contains("closed")).toBeTruthy();

    const issueDiv2 = doc.getElementById("issue-container-number-1540");
    expect(issueDiv2).toBeTruthy();
    const issueDiv3 = doc.getElementById("i-should-be-here-too");
    expect(issueDiv3).toBeTruthy();
    const summarySection = doc.getElementById("issue-summary");
    expect(summarySection).toBeTruthy();
    const { textContent } = summarySection.querySelector(
      "[href='#issue-container-number-1540']"
    );
    expect(textContent).toBe("Issue 1540");
    const issueDiv404 = doc.getElementById("this-is-404");
    expect(issueDiv404).toBeTruthy();
    expect(
      issueDiv404.querySelector("div:not(.issue-title)").textContent
    ).toEqual("this is 404");
  });

  it("renders the original issue post in an empty issue block", async () => {
    const githubConfig = {
      github: "https://github.com/mock-company/mock-repository",
      githubAPI: `${window.location.origin}/tests/data`,
    };
    const ops = {
      config: githubConfig,
      body:
        makeDefaultBody() +
        `<div class='issue' id='issue1540' data-number='1540'></div>`,
    };
    const doc = await makeRSDoc(ops);
    const issueDiv1 = doc.getElementById("issue1540");
    expect(issueDiv1).toBeTruthy();
    expect(issueDiv1.textContent).toBe(
      "Issue 1540: A mock open issue for testing refactorbugblanknot-a-colorThe issue contentThe second paragraph"
    );
  });

  it("should link to external issue tracker for features at risk", async () => {
    const atRiskBaseConfig = {
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
    const ops = {
      config: atRiskBaseConfig,
      body:
        makeDefaultBody() +
        "<section><p class='issue atrisk' data-number='10'>FEATURE AT RISK</p></section>",
    };
    const doc = await makeRSDoc(ops);
    const iss = doc.querySelector("div.atrisk");
    expect(iss.querySelectorAll("div.issue-title").length).toEqual(1);
    expect(iss.querySelector("div.issue-title").textContent).toEqual(
      "Feature at Risk 10"
    );
    expect(iss.querySelector("div.issue-title a").getAttribute("href")).toEqual(
      atRiskBaseConfig.atRiskBase + "10"
    );
    expect(iss.querySelector("p").getAttribute("title")).toBeNull();
    expect(iss.querySelector("p").textContent).toEqual("FEATURE AT RISK");
  });
});
