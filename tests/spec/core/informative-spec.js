"use strict";
describe("Core — Informative", () => {
  afterAll(flushIframes);
  it("should process informative sections", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section class='informative'><h2>TITLE</h2></section>",
    };
    const doc = await makeRSDoc(ops);
    const $sec = $("div.informative, section.informative", doc);
    expect($sec.find("p").length).toEqual(1);
    expect($sec.find("p em").length).toEqual(1);
    expect($sec.find("p em").text()).toEqual(
      "This section is non-normative."
    );
  });
});
