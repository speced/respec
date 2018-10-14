"use strict";
describe("Core — Requirements", () => {
  afterAll(flushIframes);

  it("should process requirements", async () => {
    const body = "<p class='req' id='req-id'>REQ</p>";
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const req = doc.querySelector("p.req");
    expect(req.textContent).toEqual("Req. 1: REQ");
    const refs = req.querySelectorAll("a");
    expect(refs.length).toEqual(1);
    const [ref] = refs;
    expect(ref.textContent).toEqual("Req. 1");
    expect(ref.getAttribute("href")).toEqual("#req-id");
  });

  it("should process requirement references", async () => {
    const body = `
      <a href='#req-id' class='reqRef'></a>
      <a href='#foo' class='reqRef'></a>
      <p class='req' id='req-id'>REQ</p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const refs = doc.querySelectorAll("a.reqRef");
    expect(refs.length).toEqual(2);
    const [validRef, invalidRef] = refs;
    expect(validRef.textContent).toEqual("Req. 1");
    expect(invalidRef.textContent).toEqual("Req. not found 'foo'");
  });
});
