"use strict";
describe("Core — Examples", () => {
  afterAll(flushIframes);
  it("processes examples", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section>
            <pre class='example' title='EX'>\n  {\n    CONTENT\n  }\n  </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const $ex = $("div.example pre", doc);
    const $div = $ex.parent("div");
    expect($div.hasClass("example")).toBeTruthy();
    expect($div.find("div.example-title").length).toEqual(1);
    expect($div.find("div.example-title").text()).toEqual("Example 1: EX");
    expect($ex.attr("title")).toBeUndefined();
    expect($ex.text()).toEqual("{\n  CONTENT\n}");
  });
});
