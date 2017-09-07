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
    var $inl = $("#inlines", doc);
    var $nr = $("#normative-references", doc);
    var $ir = $("#informative-references", doc);
    expect($inl.find("abbr[title='ABBR-TIT']:contains('ABBR')").length).toEqual(
      2
    );
    expect($inl.find("cite a:contains('DAHU')").attr("href")).toEqual(
      "#bib-DAHU"
    );
    expect($inl.find("cite a:contains('REX')").attr("href")).toEqual(
      "#bib-REX"
    );
    expect($nr.find("dl dt").length).toEqual(1);
    expect($nr.find("dl dt:contains('[DAHU]')").length).toEqual(1);
    expect($ir.find("dl dt").length).toEqual(1);
    expect($ir.find("dl dt:contains('[REX]')").length).toEqual(1);
  });
});
