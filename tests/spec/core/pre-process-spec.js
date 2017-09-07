"use strict";
describe("Core - preProcess, postProcess, afterEnd", () => {
  afterAll(flushIframes);
  let doc;

  beforeAll(done => {
    const ops = makeStandardOps();
    ops.config = null; // use src doc's config
    const cb = iframe => {
      doc = iframe;
      done();
    };
    makeRSDoc(ops, cb, "spec/core/pre-process-spec.html");
  });

  it("runs the preProcess and postProces arrays", () => {
    expect(doc.querySelector("#pre-sync").innerHTML).toEqual("pass");
    expect(doc.querySelector("#pre-async").innerHTML).toEqual("pass");
    expect(doc.querySelector("#post-sync").innerHTML).toEqual("pass");
    expect(doc.querySelector("#post-async").innerHTML).toEqual("pass");
  });

  it("runs afterEnd method", () => {
    expect(doc.querySelector("#afterend").innerHTML).toEqual("pass");
  });
});
