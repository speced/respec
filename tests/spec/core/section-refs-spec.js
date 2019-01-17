"use strict";
describe("Core - Section References", () => {
  afterAll(flushIframes);
  it("should have produced the section reference", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='ONE'><h2>ONE</h2></section><section id='TWO'><a href='#ONE' class='sectionRef'></a></section>`,
    };
    const doc = await makeRSDoc(ops);
    const one = doc.getElementById("ONE");
    const two = doc.getElementById("TWO");
    const tit = one.children[0].textContent;

    expect(two.querySelector("a").textContent).toEqual(`section ${tit}`);
  });
});
