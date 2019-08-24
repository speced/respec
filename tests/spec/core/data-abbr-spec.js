"use strict";

import { flushIframes, makeBasicConfig, makeRSDoc } from "../SpecHelper.js";

describe("Core — data-abbr", () => {
  afterAll(flushIframes);
  it("processes definition abbreviations", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
      <section id="section">
        <dfn data-abbr>foo bar</dfn>
      </section>`,
    };
    const doc = await makeRSDoc(ops);
    const dfnFooBar = doc.querySelector("#section dfn");
    const abbr = doc.querySelector("#section dfn + abbr");

    expect(dfnFooBar.dataset.lt).toBe("FB|foo bar");
    expect(dfnFooBar.textContent.trim()).toBe("foo bar");
    expect(abbr.textContent).toBe("FB");
    expect(abbr.previousSibling.textContent.trim()).toBe("(");
    expect(abbr.nextSibling.textContent.trim()).toBe(")");

    expect(abbr.title).toBe("foo bar");
  });
  it("allows different abbreviation combinations to link to dfn", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
      <section id="section">
        <dfn data-abbr>foo bar</dfn> can be referenced as
        <a class="dfnlink">FB</a>
        <a class="dfnlink">foo bar</a>
      </section>`,
    };
    const doc = await makeRSDoc(ops);
    doc
      .querySelectorAll(".dfnlink")
      .forEach(link => expect(link.getAttribute("href")).toBe("#dfn-fb"));
  });
  it("correctly parses and abbreviates different Abbreviation syntax", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
      <section id="section">
        <dfn data-abbr="">United States</dfn>
        <dfn data-abbr="PoR">Position of Responsibility</dfn>
        <dfn data-abbr="UI">User Interface</dfn>
        <div class="test">US</div>
        <div class="test">PoR</div>
        <div class="test">UI</div>
      </section>`,
    };
    const doc = await makeRSDoc(ops);
    const [dfnUS, dfnPoR, dfnUI] = doc.querySelectorAll("#section dfn");
    const [abbrUS, abbrPoR, abbrUI] = doc.querySelectorAll("div.test abbr");

    expect(dfnUS.dataset.abbr).toBe("");
    expect(dfnUS.textContent.trim()).toBe("United States");

    expect(abbrUS.title).toBe(dfnUS.textContent);
    expect(abbrUS.textContent).toBe("US");

    expect(dfnPoR.textContent.trim()).toBe("Position of Responsibility");
    expect(abbrPoR.textContent).toBe("PoR");
    expect(dfnPoR.dataset.abbr).toBe("PoR");
    expect(abbrPoR.title).toBe(dfnPoR.textContent);

    expect(dfnUI.dataset.abbr).toBe("UI");
    expect(abbrUI.textContent).toBe("UI");
    expect(dfnUI.textContent.trim()).toBe("User Interface");
    expect(abbrUI.title).toBe(dfnUI.textContent);
  });
  it("warns when used with unsupported elements", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `<p id="test" data-abbr>`,
    };
    const doc = await makeRSDoc(ops);
    const p = doc.getElementById("test");
    expect(p.classList).toContain("respec-offending-element");
  });
  it("normalizes title of added abbr for unwanted spaces", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `<section id="section">
       <dfn id="test" data-abbr>\t\n Permanent\t\nAccount \n   Number\t\n</dfn>
      </section>`,
    };
    const doc = await makeRSDoc(ops);
    const abbr = doc.querySelector("section abbr");
    expect(abbr.title).toBe("Permanent Account Number");
  });
});
