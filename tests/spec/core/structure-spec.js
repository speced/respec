"use strict";

import {
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core - Structure", () => {
  const body = `
      ${makeDefaultBody()}
      <section class="introductory">
      <h2>INTRO</h2>
      </section>
      <section>
        <h2>ONE</h2>
        <section>
          <h2>TWO</h2>
          <section>
            <h2>THREE</h2>
            <section>
              <h2>FOUR</h2>
              <section>
                <h2>FIVE</h2>
                <section>
                  <h2>SIX</h2>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
      <section class="notoc">
        <h2>Not in TOC</h2>
      </section>
      <section id="conformance"></section>
      <section class="appendix">
        <h2>ONE</h2>
        <section>
          <h2>TWO</h2>
          <section>
            <h2>THREE</h2>
            <section>
              <h2>FOUR</h2>
              <section>
                <h2>FIVE</h2>
                <section>
                  <h2>SIX</h2>
                  <p>[[?DAHUT]]</p>
                  <p>[[!HTML5]]</p>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    `;

  it("should build a ToC with default values", async () => {
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    // test default values
    const toc = doc.getElementById("toc");
    expect(toc.querySelector("h2").textContent).toBe("Table of Contents");
    expect(toc.querySelector("ol > li:nth-child(1) a").hash).toBe("#abstract");
    expect(toc.querySelector("ol > li:nth-child(2) a").hash).toBe("#sotd");
    expect(toc.querySelector("ol > li:nth-child(3) a").hash).toBe("#intro");
    expect(toc.querySelector("ol > li:nth-child(4) a").textContent).toBe(
      "1. ONE"
    );
    expect(toc.querySelectorAll("li")).toHaveSize(19);
    expect(toc.querySelector("ol:first-of-type").childElementCount).toBe(7);
    expect(toc.querySelector("a[href='#six']").textContent).toBe(
      "1.1.1.1.1.1 SIX"
    );
    expect(toc.querySelector("ol > li:nth-child(6) > a").textContent).toBe(
      "A. ONE"
    );
    expect(toc.querySelector("a[href='#six-0']").textContent).toBe(
      "A.1.1.1.1.1 SIX"
    );
  });

  it("treats references in introductory sections as non-normative", async () => {
    // test with noTOC
    const config = makeBasicConfig();
    config.localBiblio = {
      normative: {
        title: "This is normative",
      },
      informative: {
        title: "This is informative",
      },
    };
    config.specStatus = "ED";
    const ops = {
      config,
      body: `
        <section id="sotd">
          <p>[[informative]] [[normative]]</p>
        </section>
        <section id="conformance">
          <p>[[normative]]</p>
        </section>`,
    };
    ops.config.noTOC = true;
    const doc = await makeRSDoc(ops);

    const informativeRefs = doc.querySelectorAll("#informative-references dt");
    expect(informativeRefs).toHaveSize(1);
    const [informativeRef] = informativeRefs;
    expect(informativeRef.textContent).toBe("[informative]");

    const normativeRefs = doc.querySelectorAll("#normative-references dt");
    expect(normativeRefs).toHaveSize(1);
    const [normativeRef1] = normativeRefs;
    expect(normativeRef1.textContent).toBe("[normative]");
  });

  it("should not build a ToC with noTOC", async () => {
    // test with noTOC
    const ops = {
      config: makeBasicConfig(),
      body: "<section class='sotd'><p>.</p></section>",
    };
    ops.config.noTOC = true;
    const doc = await makeRSDoc(ops);
    expect(doc.getElementById("toc")).toBeNull();
  });

  it("should include introductory sections in ToC", async () => {
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const toc = doc.getElementById("toc");
    expect(toc.querySelector("h2").textContent).toBe("Table of Contents");
    expect(toc.querySelectorAll(":scope > ol > li")).toHaveSize(7);
    expect(toc.querySelectorAll("li")).toHaveSize(19);
    expect(toc.querySelector("ol > li").textContent).toBe("Abstract");
    expect(
      toc.querySelectorAll(":scope > ol > li a[href='#intro']")
    ).toHaveSize(1);
  });

  it("should limit ToC depth with maxTocLevel", async () => {
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    ops.config.maxTocLevel = 4;
    const doc = await makeRSDoc(ops);
    const toc = doc.getElementById("toc");
    expect(toc.querySelector("h2").textContent).toBe("Table of Contents");
    expect(doc.querySelectorAll("#toc > ol > li")).toHaveSize(7);
    expect(toc.querySelectorAll("li")).toHaveSize(15);
    expect(doc.querySelector("#toc > ol > li > a").textContent).toBe(
      "Abstract"
    );
    expect(
      doc.querySelector("#toc > ol > li:nth-child(4) > a").textContent
    ).toBe("1. ONE");
    expect(toc.querySelector("a[href='#four']").textContent).toBe(
      "1.1.1.1 FOUR"
    );
    expect(
      doc.querySelector("#toc > ol > li:nth-child(6) > a").textContent
    ).toBe("A. ONE");

    expect(toc.querySelector("a[href='#four-0']").textContent).toBe(
      "A.1.1.1 FOUR"
    );
    // should still add section number to the original header
    expect(doc.getElementById("x1-1-1-1-1-five").textContent).toBe(
      "1.1.1.1.1 FIVE"
    );
  });

  describe("data-max-toc", () => {
    it("skips current section from ToC with data-max-toc=0", async () => {
      const body = `
        <section><h2>PASS</h2></section>
        <section data-max-toc="0">
          <h2>SKIPPED</h2>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);

      const toc = doc.getElementById("toc");
      const links = toc.querySelectorAll(":scope > ol > li:nth-child(n + 2)");
      expect(links).toHaveSize(1);
      const tocItem = links[0];
      expect(tocItem.textContent.trim()).toContain("PASS");
      expect(tocItem.textContent.trim()).not.toContain("SKIPPED");
    });

    it("skips descendent sections from ToC", async () => {
      const body = `
        <section data-max-toc="2">
          <h2>PASS 1</h2>
          <section>
            <h2>PASS 2</h2>
            <section>
              <h2>SKIPPED</h2>
            </section>
          </section>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const toc = doc.getElementById("toc");

      const level1Item = toc.querySelector(":scope > ol > li:nth-child(n + 2)");
      expect(level1Item).toBeTruthy();
      expect(level1Item.textContent).toContain("1. PASS 1");

      const level2Item = toc.querySelector(":scope > ol > li > ol > li");
      expect(level2Item).toBeTruthy();
      expect(level2Item.textContent).toContain("1.1 PASS 2");

      const level3Item = toc.querySelector(":scope > ol > li > ol > li li");
      expect(level3Item).toBeFalsy();
      expect(toc.textContent).not.toContain("SKIPPED");
      expect(toc.textContent).not.toContain("1.1.1");
    });

    it("ignores data-max-toc if not in valid range", async () => {
      const body = `
        <section id="test" data-max-toc="7">
          <h2>PASS 0</h2>
          <section>
            <h2>PASS 1</h2>
            <section>
              <h2>PASS 2</h2>
            </section>
          </section>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const toc = doc.getElementById("toc");

      expect(toc.querySelectorAll(":scope .toc")).toHaveSize(3);
      expect(doc.getElementById("test").classList).toContain(
        "respec-offending-element"
      );
    });
  });

  it("should correctly put all headings until maxTocLevel in ToC", async () => {
    const times = (n, fn) =>
      Array.from({ length: n }, (_, i) => fn(i)).join("\n");
    // The first 9 sections are just placeholders. In 10th section (10.x), we
    // add 10 subsections, so ToC goes till `10.10`, and section number for the
    // last heading is "10.10" and a depth of 2.
    const body = `
      ${makeDefaultBody()}
      ${times(9, () => `<section><h2>pass</h2></section>`)}
      <section>
        <h2>pass</h2>
        ${times(10, i => `<section><h2>test ${i + 1}</h2></section>`)}
      </section>
    `;
    const ops = makeStandardOps({ maxTocLevel: 2 }, body);
    const doc = await makeRSDoc(ops);

    expect(doc.getElementById("test-10")).toBeTruthy();
    expect(doc.querySelector("#toc")).toBeTruthy();
    expect(doc.querySelector("#toc a[href='#test-10']")).toBeTruthy();
  });

  it("gives the toc's heading an id", async () => {
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("#toc > h2").id).toBeTruthy();
  });

  it("should link to the title of the document", async () => {
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const title = doc.getElementById("title");
    expect(title).toBeTruthy();
    const anchor = doc.querySelector("#back-to-top a[href='#title']");
    expect(anchor).toBeTruthy();
  });

  it("localizes table of contents", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "es",
      },
      body: `
      <section id='sotd'>
        <p>This is required.</p>
      </section>
      <section class="informative" id="intro">
        <h2>Introduction</h2>
      </section>
      `,
    };
    const doc = await makeRSDoc(ops);
    const { textContent } = doc.querySelector("#toc h2");
    expect(doc.documentElement.lang).toBe("es");
    expect(textContent).toContain("Tabla de Contenidos");
  });

  it("finds and updates empty anchors correctly", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
        <section id='sotd'>
          <p>Structure of the document.</p>
        </section>
        <section>
          <h2>Sample Interface</h2>
        </section>
        <section>
        <a class="test" href="#sample-interface">    </a>
        <a class="test" href="#sample-interface">
        </a>
        <a class="test" href="#sample-interface">
                </a>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const anchors = doc.querySelectorAll("a.test");
    anchors.forEach(anchor => {
      expect(anchor.classList).toContain("sec-ref");
      expect(anchor.textContent).toContain("Sample Interface");
    });
  });

  it("prefers heading id over section id for linking", async () => {
    const body = `
      <section><h2>ONE</h2></section>
      <section><h2 id="zwei">TWO</h2></section>
    `;

    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const links = doc.querySelectorAll("#toc li:nth-child(n + 2) > a");
    expect(links).toHaveSize(2);
    expect(links[0].hash).toBe("#one");
    expect(links[0].textContent).toBe("1. ONE");
    expect(links[1].hash).toBe("#zwei");
    expect(links[1].textContent).toBe("2. TWO");
  });

  it("generates correct appendix numbers", async () => {
    // Choosing 53 as 53/26 gives us 3 different sequences of appendix
    // numbers: A,B,C... AA,AB,AC... BA,BB,BC..
    const appendixCount = 53;

    const body = Array.from(
      { length: appendixCount },
      (_, i) => `<section class="appendix"><h2>${i + 1}</h2></section>`
    ).join("\n");
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const toc = doc.getElementById("toc");
    const sectionNumbers = toc.querySelectorAll(".secno");
    expect(sectionNumbers).toHaveSize(appendixCount);
    expect(sectionNumbers[0].textContent.trim()).toBe("A.");
    expect(sectionNumbers[1].textContent.trim()).toBe("B.");
    expect(sectionNumbers[25].textContent.trim()).toBe("Z.");
    expect(sectionNumbers[26].textContent.trim()).toBe("AA.");
    expect(sectionNumbers[27].textContent.trim()).toBe("AB.");
    expect(sectionNumbers[52].textContent.trim()).toBe("BA.");
  });
});
