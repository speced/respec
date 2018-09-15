"use strict";
describe("Core - ID headers", () => {
  afterAll(flushIframes);
  let doc;
  const body = `
    <section class="introductory"><h2>Intro</h2></section>
    <section id="t0"><p>BLAH</p><h6>FOO</h6></section>
    <section><h2>test-1</h2></section>
    <section><h2>Pass</h2></section>
  `;
  beforeAll(async () => {
    const ops = makeStandardOps({ addSectionLinks: false }, body);
    doc = await makeRSDoc(ops);
  });

  it("sets an id on header", () => {
    const h2 = doc.querySelector("#t0 h2");
    expect(h2.id).toBe("foo");
  });

  describe("section links", () => {
    it("doesn't add sections links to introductory sections", () => {
      expect(doc.querySelector(".introductory h2 a.self-link")).toBeFalsy();
    });

    it("(aria) labels section links", () => {
      const queryForSymbol = "h2 a[aria-label=§].self-link";
      expect(doc.querySelector(queryForSymbol)).toBeTruthy();
    });

    it("doesn't add sections links when addSectionLinks is false", async () => {
      const ops = makeStandardOps(
        {
          addSectionLinks: false,
        },
        body
      );
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector("h2 > a.self-link")).toBeFalsy();
    });

    it("adds section links", () => {
      const test1 = doc.querySelector("#test-1 > h2 > a.self-link");
      expect(test1.getAttribute("href")).toBe("#test-1");

      const test2 = doc.querySelector("#pass > h2 > a.self-link");
      expect(test2.getAttribute("href")).toBe("#pass");
    });
  });
});
