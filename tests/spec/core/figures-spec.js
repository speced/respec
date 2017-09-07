"use strict";
describe("Core - Figures", function() {
  afterAll(flushIframes);
  const ops = {
    config: makeBasicConfig(),
    body:
      makeDefaultBody() +
      `<section>
         <section id='figs'>
           <div class='figure'><pre title='PREFIG'>PRE</pre></div>
           <img src='IMG' title='IMGTIT' class='figure'>
         </section>
        <section id='tof'></section>
        </section>`,
  };
  it("generates captions for figures", async () => {
    const doc = await makeRSDoc(ops);
    const figs = doc.getElementById("figs");
    const captions = figs.querySelectorAll("figure figcaption");
    expect(figs.querySelectorAll("figure").length).toEqual(2);
    expect(captions.length).toEqual(2);
    expect(captions.item(0).textContent).toEqual("Figure 1 PREFIG");
    expect(captions.item(1).textContent).toEqual("Figure 2 IMGTIT");
  });
  it("generates table of figures", async () => {
    const doc = await makeRSDoc(ops);
    const tof = doc.getElementById("tof");
    const tofHeader = tof.querySelector("h3");
    const tofItems = tof.querySelectorAll("ul li");
    const figLinks = tof.querySelectorAll("ul li a");
    expect(tofHeader).toBeTruthy();
    expect(tofHeader.textContent).toEqual("Table of Figures");
    expect(tofItems.length).toEqual(2);
    expect(figLinks.item(0).textContent).toEqual("Figure 1 PREFIG");
    expect(figLinks.item(1).textContent).toEqual("Figure 2 IMGTIT");
  });
});
