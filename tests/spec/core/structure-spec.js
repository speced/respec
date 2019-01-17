"use strict";
describe("Core - Structure", () => {
  let utils;
  beforeAll(done => {
    require(["core/utils"], u => {
      utils = u;
      done();
    });
  });
  const body =
    `${makeDefaultBody()}<section class='introductory'><h2>INTRO</h2></section>` +
    `<section><h2>ONE</h2><section><h2>TWO</h2><section><h2>THREE</h2><section><h2>FOUR</h2>` +
    `<section><h2>FIVE</h2><section><h2>SIX</h2></section></section></section></section></section></section>` +
    `<section class='notoc'><h2>Not in TOC</h2></section>` +
    `<section class='appendix'><h2>ONE</h2><section><h2>TWO</h2><section><h2>THREE</h2><section>` +
    `<h2>FOUR</h2><section><h2>FIVE</h2><section><h2>SIX</h2><p>[[?DAHUT]]</p><p>[[!HTML5]]</p>` +
    `</section></section></section></section></section></section>`;

  it("should build a ToC with default values", async () => {
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    // test default values
    const toc = doc.getElementById("toc");
    expect(toc.querySelector("h2").textContent).toEqual("Table of Contents");
    expect(toc.querySelector("ol > li a").textContent).toEqual("1. ONE");
    expect(toc.querySelectorAll("li").length).toEqual(15);
    expect(toc.querySelector("ol:first-of-type").childElementCount).toEqual(3);
    expect(toc.querySelector("a[href='#six']").textContent).toEqual(
      "1.1.1.1.1.1 SIX"
    );
    expect(
      toc.querySelector("li:first-child").nextElementSibling.querySelector("a")
        .textContent
    ).toEqual("A. ONE");
    expect(toc.querySelector("a[href='#six-0']").textContent).toEqual(
      "A.1.1.1.1.1 SIX"
    );
  });

  it("should not build a ToC with noTOC", async () => {
    // test with noTOC
    const ops = {
      config: makeBasicConfig(),
      body: "<section class='sotd'><p>.</p></section>",
    };
    ops.config.noTOC = true;
    const doc = await makeRSDoc(ops);
    expect(doc.getElementById("toc")).toEqual(null);
  });

  it("should include introductory sections in ToC with tocIntroductory", async () => {
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    ops.config.tocIntroductory = true;
    const doc = await makeRSDoc(ops);
    const toc = doc.getElementById("toc");
    expect(toc.querySelector("h2").textContent).toEqual("Table of Contents");
    expect(utils.children(toc, "ol > li").length).toEqual(6);
    expect(toc.querySelectorAll("li").length).toEqual(18);
    expect(toc.querySelector("ol > li").textContent).toEqual("Abstract");
    expect(utils.children(toc, "ol > li a[href='#intro']").length).toEqual(1);
  });

  it("should limit ToC depth with maxTocLevel", async () => {
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    ops.config.maxTocLevel = 4;
    const doc = await makeRSDoc(ops);
    const toc = doc.getElementById("toc");
    expect(toc.querySelector("h2").textContent).toEqual("Table of Contents");
    expect(doc.querySelectorAll("#toc > ol > li").length).toEqual(3);
    expect(toc.querySelectorAll("li").length).toEqual(11);
    expect(doc.querySelector("#toc > ol > li > a").textContent).toEqual(
      "1. ONE"
    );
    expect(toc.querySelector("a[href='#four']").textContent).toEqual(
      "1.1.1.1 FOUR"
    );

    expect(
      doc.querySelector("#toc > ol > li").nextSibling.querySelector("a")
        .textContent
    ).toEqual("A. ONE");

    expect(toc.querySelector("a[href='#four-0']").textContent).toEqual(
      "A.1.1.1 FOUR"
    );
    // should still add section number to the original header
    expect(doc.getElementById("x1-1-1-1-1-five").textContent).toBe(
      "1.1.1.1.1 FIVE"
    );
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
});
