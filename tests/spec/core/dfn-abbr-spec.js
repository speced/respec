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
});
