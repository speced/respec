"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Issues and Notes", () => {
  afterAll(flushIframes);

  const githubConfig = {
    github: "org/repo",
    githubAPI: `${window.location.origin}/tests/data/github`,
  };

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
    expect(issues).toHaveSize(3);
    const [overriddenIdIssue, firstDuplicateIssue, secondDuplicateIssue] =
      issues;
    expect(overriddenIdIssue.id).toBe("override-123");
    expect(firstDuplicateIssue.id).not.toBe(secondDuplicateIssue.id);

    const issueSummaryItems = doc.querySelectorAll("#issue-summary li a");
    expect(issueSummaryItems).toHaveSize(3);
    const [firstItem, secondItem, thirdItem] = issueSummaryItems;
    expect(firstItem.hash).toBe(`#${overriddenIdIssue.id}`);
    expect(secondItem.hash).toBe(`#${firstDuplicateIssue.id}`);
    expect(thirdItem.hash).toBe(`#${secondDuplicateIssue.id}`);
  });
  it("should process issues and notes", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        `${makeDefaultBody()}<section><p>BLAH <span class='issue'>ISS-INLINE</span></p>` +
        `<p class='issue' title='ISS-TIT'>ISSUE</p>` +
        `<p>BLAH <span class='issue atrisk'>ATR-INLINE</span></p>` +
        `<p class='issue atrisk' title='ATR-TIT'>FEATURE AT RISK</p>` +
        `<p>BLAH <span class='note'>NOT-INLINE</span></p>` +
        `<p class='note' title='NOT-TIT'>NOTE</p></section>`,
    };
    const doc = await makeRSDoc(ops);
    const issue = doc.querySelector("div.issue", doc);
    const piss = issue.querySelector("p");
    const atr = doc.querySelector("div.atrisk");
    const patr = atr.querySelector("p");
    const spiss = doc.querySelector("span.issue");
    const spatr = doc.querySelector("span.atrisk");
    const note = doc.querySelector("div.note");
    const pnot = note.querySelector("p");
    const spnot = doc.querySelector("span.note");

    expect(spiss.closest("div")).toBeNull();
    expect(spatr.closest("div")).toBeNull();
    expect(spnot.closest("div")).toBeNull();
    expect(issue.getAttribute("role")).toBeNull();
    expect(issue.querySelectorAll("div.issue-title")).toHaveSize(1);
    expect(issue.querySelector("div.issue-title").textContent).toBe(
      "Issue 1: ISS-TIT"
    );
    expect(piss.getAttribute("title")).toBeNull();
    expect(piss.textContent).toBe("ISSUE");
    expect(atr.querySelectorAll("div.issue-title")).toHaveSize(1);
    expect(atr.querySelector("div.issue-title").textContent).toBe(
      "(Feature at Risk) Issue 2: ATR-TIT"
    );
    expect(patr.getAttribute("title")).toBeNull();
    expect(patr.textContent).toBe("FEATURE AT RISK");

    expect(note.querySelectorAll("div.note-title")).toHaveSize(1);
    expect(note.getAttribute("role")).toBe("note");
    expect(note.querySelector("div.note-title").textContent).toBe(
      "Note: NOT-TIT"
    );

    expect(pnot.getAttribute("title")).toBeNull();
    expect(pnot.textContent).toBe("NOTE");
  });

  it("should process ednotes", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        `${makeDefaultBody()}<section><p>BLAH <span class='ednote'>EDNOTE-INLINE</span></p>` +
        `<p class='ednote' title='EDNOTE-TIT'>EDNOTE</p></section>`,
    };
    const doc = await makeRSDoc(ops);
    const edNote = doc.querySelector("div.note");
    const pnot = edNote.querySelector("p");
    expect(edNote.querySelectorAll("div.ednote-title")).toHaveSize(1);
    expect(edNote.querySelector("div.ednote-title").textContent).toBe(
      "Editor's note: EDNOTE-TIT"
    );
    expect(pnot.getAttribute("title")).toBeNull();
    expect(pnot.textContent).toBe("EDNOTE");
  });

  it("should process warnings", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        `${makeDefaultBody()}<section><p>BLAH <span class='warning'>WARN-INLINE</span></p>` +
        `<p class='warning' title='WARN-TIT'>WARNING</p>` +
        `<p class='issue' title='ISS-TIT'>ISSUE</p></section>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll("section .warning")).toHaveSize(2);
    expect(doc.querySelectorAll("section .warning-title")).toHaveSize(1);
    expect(doc.querySelector("section .warning-title").textContent).toBe(
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
    expect(i10.textContent).toBe("Issue 10");
    expect(i11.textContent).toBe("Issue 11: ISS-TIT");
    expect(ixx.textContent).toBe("Issue");
  });

  it("shows labels for github issues", async () => {
    const ops = {
      config: githubConfig,
      body: `${makeDefaultBody()}
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
    expect(issueDiv404.querySelector("div:not(.issue-title)").textContent).toBe(
      "this is 404"
    );

    const [refactorLabel, bugLabel, blankLabel, invalidLabel] =
      doc.getElementsByClassName("respec-gh-label");

    expect(refactorLabel.textContent).toBe("refactor");
    expect(refactorLabel.classList).toContain(
      "respec-gh-label",
      "respec-label-light"
    );
    expect(refactorLabel.style.backgroundColor).toBe("rgb(71, 244, 65)");
    expect(refactorLabel.href).toBe(
      "https://github.com/org/repo/issues/?q=is%3Aissue+is%3Aopen+label%3A%22refactor%22"
    );

    expect(bugLabel.textContent).toBe("bug");
    expect(bugLabel.classList).toContain(
      "respec-gh-label",
      "respec-label-dark"
    );
    expect(bugLabel.style.backgroundColor).toBe("rgb(244, 66, 92)");
    expect(bugLabel.href).toBe(
      "https://github.com/org/repo/issues/?q=is%3Aissue+is%3Aopen+label%3A%22bug%22"
    );

    expect(blankLabel.textContent).toBe("blank");
    expect(blankLabel.classList).toContain(
      "respec-gh-label",
      "respec-label-dark"
    );
    expect(blankLabel.href).toBe(
      "https://github.com/org/repo/issues/?q=is%3Aissue+is%3Aopen+label%3A%22blank%22"
    );

    expect(invalidLabel.textContent).toBe("not-a-color");
    expect(invalidLabel.classList).toContain(
      "respec-gh-label",
      "respec-label-dark"
    );
    expect(invalidLabel.href).toBe(
      "https://github.com/org/repo/issues/?q=is%3Aissue+is%3Aopen+label%3A%22not-a-color%22"
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
      body: `${makeDefaultBody()}<section><p class='issue' data-number='10'>ISSUE</p></section>`,
    };
    const doc = await makeRSDoc(ops);
    const iss = doc.querySelector("div.issue");
    const piss = iss.querySelector("p");
    expect(iss.querySelectorAll("div.issue-title")).toHaveSize(1);
    expect(iss.querySelector("div.issue-title").textContent).toBe("Issue 10");
    expect(iss.querySelector("div.issue-title a").getAttribute("href")).toBe(
      `${issueBaseConfig.issueBase}10`
    );
    expect(piss.getAttribute("title")).toBeNull();
    expect(piss.textContent).toBe("ISSUE");
  });

  it("marks closed issues as closed in the spec", async () => {
    const ops = {
      config: githubConfig,
      body: `${makeDefaultBody()}
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
    expect(issueDiv1.classList).toContain("closed");

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
    expect(issueDiv404.querySelector("div:not(.issue-title)").textContent).toBe(
      "this is 404"
    );
  });

  it("sets aria-label to reflect the labels from Github", async () => {
    const ops = {
      config: githubConfig,
      body: `${makeDefaultBody()}
        <div class='issue' data-number='1548'>no aria-label for this</div>
        <div class='issue' data-number='1540'>this should have aria-labels</div>
      `,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll("div.issue")).toHaveSize(2);
    expect(
      doc.querySelector("div#issue-container-number-1548 [aria-label]")
    ).toBeNull();
    const labels = doc.querySelectorAll(
      "div#issue-container-number-1540 a[aria-label^='GitHub label']"
    );
    expect(labels).toHaveSize(4);
  });
  it("renders the original issue post in an empty issue block", async () => {
    const ops = {
      config: githubConfig,
      body: `${makeDefaultBody()}<div class='issue' id='issue1540' data-number='1540'></div>`,
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
      body: `${makeDefaultBody()}<section><p class='issue atrisk' data-number='10'>FEATURE AT RISK</p></section>`,
    };
    const doc = await makeRSDoc(ops);
    const iss = doc.querySelector("div.atrisk");
    const piss = iss.querySelector("p");
    expect(iss.querySelectorAll("div.issue-title")).toHaveSize(1);
    expect(iss.querySelector("div.issue-title").textContent).toBe(
      "(Feature at Risk) Issue 10"
    );
    expect(iss.querySelector("div.issue-title a").getAttribute("href")).toBe(
      `${atRiskBaseConfig.atRiskBase}10`
    );
    expect(piss.getAttribute("title")).toBeNull();
    expect(piss.textContent).toBe("FEATURE AT RISK");
  });

  it("should link to GitHub issue tracker for features at risk", async () => {
    const config = {
      github: "https://github.com/org/repo",
      githubAPI: `${window.location.origin}/tests/data/github`,
    };
    const ops = {
      config,
      body: `${makeDefaultBody()}<section><p class='issue atrisk' data-number='1540'>FEATURE AT RISK</p></section>`,
    };
    const doc = await makeRSDoc(ops);
    const issue = doc.querySelector("div.atrisk");
    const issueTitles = issue.querySelectorAll("div.issue-title");
    expect(issueTitles).toHaveSize(1);
    expect(issueTitles[0].querySelector("a").getAttribute("href")).toBe(
      `${config.github}/issues/1540`
    );
  });
  it("localizes issues summary", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "es",
      },
      body: `
      <section>
        <h2>Test Issues</h2>
        <p class="issue" data-number=123></p>
      </section>
      <section id="issue-summary"></section>
      `,
    };
    const doc = await makeRSDoc(ops);
    const { textContent } = doc.querySelector("#issue-summary > h2");
    expect(doc.documentElement.lang).toBe("es");
    expect(textContent).toContain("Resumen de la cuestión");
  });
  it("shows issue-summary section with heading provided", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
      <section>
        <h2>Test Issues</h2>
        <p class="issue" data-number=123></p>
      </section>
      <section id="issue-summary">
        <h2>Open Issues</h2>
        <p>Here you will find all open issues</p>
      </section>
      `,
    };
    const doc = await makeRSDoc(ops);
    const h2 = doc.querySelector("#issue-summary > h2");
    expect(h2.innerText).toContain("Open Issues");
    const p = doc.querySelector("#issue-summary p");
    expect(p.innerText).toContain("Here you will find all open issues");
  });
  it("shows issue-summary section with paragraph and default heading when only <p> is defined", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
      <section>
        <h2>Test Issues</h2>
        <p class="issue" data-number=123></p>
      </section>
      <section id="issue-summary">
        <p>Here you will find all issues summary</p>
        <div class="note">This is a note</div>
        <section>
          <h3>This is not the heading of issue-summary</h3>
        </section>
      </section>
      `,
    };
    const doc = await makeRSDoc(ops);
    const h2 = doc.querySelector("#issue-summary > h2");
    expect(h2.innerText).toContain("Issue Summary");
    const p = doc.querySelector("#issue-summary p");
    expect(p.innerText).toContain("Here you will find all issues summary");
    const div = doc.querySelector("#issue-summary div");
    expect(div.innerText).toContain("This is a note");
    // Headings other than top level heading should not be detected as issue summary heading
    const h3 = doc.querySelector("#issue-summary section h3");
    expect(h3.innerText).toContain("This is not the heading of issue-summary");
  });
});
