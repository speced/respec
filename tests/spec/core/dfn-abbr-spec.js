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

    const dfnUS = dfns[0];
    const dfnPoR = dfns[1];
    const dfnUI = dfns[2];
    expect(dfnUS.dataset.abbr).toEqual("US");
    expect(dfnPoR.dataset.abbr).toEqual("PoR");
    expect(dfnUI.dataset.abbr).toEqual("UI");
    expect(dfnUS.textContent.trim()).toEqual("United States (US)");
    expect(dfnPoR.textContent.trim()).toEqual(
      "Position of Responsibility (PoR)"
    );
    expect(dfnUI.textContent.trim()).toEqual("User Interface (UI)");

    for (const x of Array(3).keys()) {
      expect(dfns[x].dataset.abbr).toEqual(
        divs[x].getElementsByTagName("abbr")[0].textContent
      );
      expect(
        dfns[x].textContent
          .substr(0, dfns[x].textContent.lastIndexOf("("))
          .trim()
      ).toEqual(divs[x].getElementsByTagName("abbr")[0].title);
    }
  });
});
