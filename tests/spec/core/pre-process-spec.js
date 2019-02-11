"use strict";
describe("Core - preProcess, postProcess, afterEnd", () => {
  afterAll(flushIframes);
  let doc;

  beforeAll(async () => {
    const ops = makeStandardOps();
    ops.config = null; // use src doc's config
    doc = await makeRSDoc(ops, "spec/core/pre-process-spec.html");
  });

  test("runs the preProcess and postProces arrays", () => {
    expect(doc.getElementById("pre-sync").innerHTML).toEqual("pass");
    expect(doc.getElementById("pre-async").innerHTML).toEqual("pass");
    expect(doc.getElementById("post-sync").innerHTML).toEqual("pass");
    expect(doc.getElementById("post-async").innerHTML).toEqual("pass");
  });

  test("runs afterEnd method", () => {
    expect(doc.getElementById("afterend").innerHTML).toEqual("pass");
  });
});
