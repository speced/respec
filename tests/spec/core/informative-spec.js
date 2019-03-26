"use strict";
describe("Core — Informative", () => {
  afterAll(flushIframes);
  it("should process informative sections", async () => {
    const body = `<section class='informative'><h2>TITLE</h2></section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const sec = doc.querySelector("div.informative, section.informative");
    expect(sec.querySelectorAll("p").length).toEqual(1);
    expect(sec.querySelectorAll("p em").length).toEqual(1);
    expect(sec.querySelector("p em").textContent).toEqual(
      "This section is non-normative."
    );
  });
});
