"use strict";
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

    expect(dfnFooBar.dataset.abbr).toBe("FB");
    expect(dfnFooBar.dataset.lt).toBe("fb|foo bar");
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
        <div>US</div>
        <div>PoR</div>
        <div>UI</div>
      </section>`,
    };
    const doc = await makeRSDoc(ops);
    const divs = doc.querySelectorAll("#section div");
    const dfns = doc.querySelectorAll("#section dfn");
    const [dfnUS, dfnPoR, dfnUI] = dfns;

    expect(dfnUS.dataset.abbr).toBe("US");
    expect(dfnUS.textContent.trim()).toBe("United States");

    expect(dfnPoR.textContent.trim()).toBe("Position of Responsibility");
    expect(dfnPoR.dataset.abbr).toBe("PoR");

    expect(dfnUI.dataset.abbr).toBe("UI");
    expect(dfnUI.textContent.trim()).toBe("User Interface");

    divs.forEach((div, i) => {
      const correspondingDfn = dfns[i];
      const abbr = div.querySelector("abbr");
      expect(abbr.textContent).toBe(correspondingDfn.dataset.abbr);
      expect(abbr.title).toBe(correspondingDfn.textContent);
    });
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
});
