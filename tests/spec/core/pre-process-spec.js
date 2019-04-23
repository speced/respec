import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

("use strict");
describe("Core - preProcess, postProcess, afterEnd", () => {
  afterAll(flushIframes);
  let doc;

  beforeAll(async () => {
    const ops = makeStandardOps();
    ops.config = null; // use src doc's config
    doc = await makeRSDoc(ops, "spec/core/pre-process-spec.html");
  });

  it("runs the preProcess and postProces arrays", () => {
    expect(doc.getElementById("pre-sync").innerHTML).toBe("pass");
    expect(doc.getElementById("pre-async").innerHTML).toBe("pass");
    expect(doc.getElementById("post-sync").innerHTML).toBe("pass");
    expect(doc.getElementById("post-async").innerHTML).toBe("pass");
  });

  it("runs afterEnd method", () => {
    expect(doc.getElementById("afterend").innerHTML).toBe("pass");
  });
});
