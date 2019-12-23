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
});
