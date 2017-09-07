"use strict";
describe("Core - ID headers", () => {
  afterAll(flushIframes);
  it("sets an id on header", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + "<section><p>BLAH</p><h6>FOO</h6></section>",
    };
    const doc = await makeRSDoc(ops);
    const $s = $("section h2:contains('FOO')", doc);
    expect($s.attr("id")).toEqual("foo");
  });
});
