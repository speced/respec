"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Requirements", () => {
  afterAll(flushIframes);

  it("should process requirements", async () => {
    const body = "<p class='req' id='req-id'>REQ</p>";
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const req = doc.querySelector("p.req");
    expect(req.textContent).toBe("Req. 1: REQ");
    const refs = req.querySelectorAll("a");
    expect(refs.length).toBe(1);
    const [ref] = refs;
    expect(ref.textContent).toBe("Req. 1");
    expect(ref.getAttribute("href")).toBe("#req-id");
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
    expect(refs.length).toBe(2);
    const [validRef, invalidRef] = refs;
    expect(validRef.textContent).toBe("Req. 1");
    expect(invalidRef.textContent).toBe("Req. not found 'foo'");
  });
});
