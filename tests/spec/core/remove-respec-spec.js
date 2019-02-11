"use strict";
describe("Core — Remove ReSpec", () => {
  afterAll(flushIframes);
  test("should have removed all artifacts", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector(".remove")).toBeNull();
    expect(doc.querySelector("script[data-requiremodule]")).toBeNull();
  });
});
