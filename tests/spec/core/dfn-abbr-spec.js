"use strict";
describe("Core — Definition Abbreviations", () => {
  afterAll(flushIframes);
  it("processes definition abbreviations", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
      <section id="section">
        <dfn data-abbr>foo bar</dfn> can be referenced as
        <span id="foobarLink">
          <a id="dfnlink">FB</a>
        </span>
      </section>`,
    };
    const doc = await makeRSDoc(ops);

    const dfnFooBar = doc.querySelector("#section dfn");
    expect(dfnFooBar.id).toEqual("dfn-fb");
    expect(dfnFooBar.dataset.abbr).toEqual("FB");
    expect(dfnFooBar.textContent.trim()).toEqual("foo bar (FB)");
    const linkToDfn = doc.getElementById("dfnlink");
    expect(linkToDfn.getAttribute("href")).toEqual("#dfn-fb");
    expect(linkToDfn.querySelector("abbr").textContent.trim()).toEqual("FB");
  });
  it("allows different abbreviation combinations to link to dfn", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
      <section id="section">
        <dfn data-abbr>foo bar</dfn> can be referenced as
        <span id="foobarLink">
          <a class="dfnlink">FB</a>
          <a class="dfnlink">foo bar</a>
          <a class="dfnlink">foo bar (FB)</a>
        </span>
      </section>`,
    };
    const doc = await makeRSDoc(ops);

    const dfnFooBar = doc.querySelector("#section dfn");
    expect(dfnFooBar.id).toEqual("dfn-fb");
    expect(dfnFooBar.dataset.abbr).toEqual("FB");
    expect(dfnFooBar.textContent.trim()).toEqual("foo bar (FB)");
    const linkToDfn = doc.querySelectorAll(".dfnlink");
    linkToDfn.forEach(link =>
      expect(link.getAttribute("href")).toEqual("#dfn-fb")
    );
  });
  it("correctly parses and abbreviates different Abbreviation syntax", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
      <section id="section">
        <dfn data-abbr>United States</dfn>
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
    expect(dfnPoR.dataset.abbr).toBe("PoR");
    expect(dfnUI.dataset.abbr).toBe("UI");
    expect(dfnUS.textContent.trim()).toBe("United States (US)");
    expect(dfnPoR.textContent.trim()).toBe("Position of Responsibility (PoR)");
    expect(dfnUI.textContent.trim()).toBe("User Interface (UI)");

    divs.forEach((div, i) => {
      const correspondingDfn = dfns[i];
      expect(correspondingDfn.dataset.abbr).toBe(
        div.getElementsByTagName("abbr")[0].textContent
      );
      const fullForm = correspondingDfn.textContent
        .substr(0, correspondingDfn.textContent.lastIndexOf("("))
        .trim();
      expect(div.getElementsByTagName("abbr")[0].title).toBe(fullForm);
    });
  });
});
