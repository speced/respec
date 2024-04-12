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
    expect(doc.getElementById("pre-warning").innerHTML).toBe("pass");
    expect(doc.getElementById("post-error").innerHTML).toBe("pass");
  });

  it("can show warnings and errors", () => {
    const warnings = doc.respec.warnings.filter(warn =>
      warn.plugin.startsWith("core/pre-process")
    );
    expect(warnings).toHaveSize(1);
    expect(warnings[0].plugin).toBe("core/pre-process/preWithWarning");
    expect(warnings[0].message).toBe("This is a warning");

    const errors = doc.respec.errors.filter(
      err =>
        err.plugin.startsWith("core/post-process") &&
        !err.message.startsWith("Every item")
    );
    expect(errors).toHaveSize(1);
    expect(errors[0]).toEqual(
      jasmine.objectContaining({
        plugin: "core/post-process/postWithDetailedError",
        message: "This is an error",
        details: "This is a detailed error message",
        hint: "This is a hint",
        title: "This is a title",
        name: "ReSpecError",
        elements: [doc.getElementById("post-error")],
      })
    );
  });

  it("runs afterEnd method", () => {
    expect(doc.getElementById("afterend").innerHTML).toBe("pass");
  });
});
