"use strict";
describe("Core - Inlines", function() {
  afterAll(flushIframes);
  it("processes all in-line content", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section id='inlines'>
          <p><abbr title='ABBR-TIT'>ABBR</abbr> ABBR</p>
          <p>MUST and NOT RECOMMENDED</p>
          <p>[[!DAHU]] [[REX]]</p>
        </section>`,
    };
    ops.config.localBiblio = {
      DAHU: {
        title: "One short leg. How I learned to overcome.",
        publisher: "Publishers Inc.",
      },
      REX: {
        title: "Am I a dinosaur or a failed technology?",
        publisher: "Publishers Inc.",
      },
    };
    const doc = await makeRSDoc(ops);
    const inl = doc.getElementById("inlines");

    const nr = doc.getElementById("normative-references");
    const ir = doc.getElementById("informative-references");

    const abbr = inl.querySelectorAll("abbr[title='ABBR-TIT']");
    expect(abbr.length).toEqual(2);
    expect([...abbr].every(({ textContent: t }) => t === "ABBR")).toBeTruthy();

    const [linkDahu, linkRex] = [...inl.querySelectorAll("cite a")];
    expect(linkDahu.textContent).toEqual("DAHU");
    expect(linkDahu.getAttribute("href")).toEqual("#bib-dahu");
    expect(linkRex.textContent).toEqual("REX");
    expect(linkRex.getAttribute("href")).toEqual("#bib-rex");

    const nrDt = [...nr.querySelectorAll("dl dt")];
    expect(nrDt.length).toEqual(1);
    expect(nrDt[0].textContent).toEqual("[DAHU]");

    const irDt = [...ir.querySelectorAll("dl dt")];
    expect(irDt.length).toEqual(1);
    expect(irDt[0].textContent).toEqual("[REX]");
  });
});
