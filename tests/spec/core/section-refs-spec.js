"use strict";
describe("Core - Section References", () => {
  afterAll(flushIframes);
  it("should have produced the section reference", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
        <section id='ONE'>
          <h2>
            ONE
          </h2>
        </section>
        <section id='TWO'><a href='#ONE' class='sectionRef'></a></section>`,
    };
    const doc = await makeRSDoc(ops);
    const two = doc.getElementById("TWO");
    // \u00A0 is &nbsp; - non-breaking space U+00A0
    expect(two.querySelector("a").textContent).toBe("section §\u00A01. ONE");
  });
});
