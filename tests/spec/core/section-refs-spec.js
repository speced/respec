"use strict";
describe("Core - Section References", () => {
  afterAll(flushIframes);
  it("should have produced the section reference", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section id='ONE'><h2>ONE</h2></section><section id='TWO'><a href='#ONE' class='sectionRef'></a></section>",
    };
    const doc = await makeRSDoc(ops);
    const $one = $("#ONE", doc);
    const $two = $("#TWO", doc);
    const tit = $one.find("> :first-child").text();
    expect($two.find("a").text()).toEqual("section " + tit);
  });
});
