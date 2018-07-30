"use strict";
describe("Core — Requirements", () => {
  afterAll(flushIframes);
  it("should process requirements", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + "<p class='req' id='req-id'>REQ</p>",
    };
    const doc = await makeRSDoc(ops);
    const $req = $("p.req", doc);
    const $a = $req.find("a");
    expect($req.text()).toEqual("Req. 1: REQ");
    expect($a.length).toEqual(1);
    expect($a.text()).toEqual("Req. 1");
    expect($a.attr("href")).toEqual("#req-id");
  });

  it("should process requirement references", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<a href='#req-id' class='reqRef'></a>" +
        "<a href='#foo' class='reqRef'></a>" +
        "<p class='req' id='req-id'>REQ</p>",
    };
    const doc = await makeRSDoc(ops);
    const $refs = $("a.reqRef", doc);
    expect($refs.first().text()).toEqual("Req. 1");
    expect($refs.last().text()).toEqual("Req. not found 'foo'");
  });
});
