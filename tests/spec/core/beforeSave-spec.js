import {
  flushIframes,
  getExportedDoc,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core - beforeSave config option", () => {
  afterAll(flushIframes);

  it("allows modification before saving", async () => {
    const ops = makeStandardOps();
    ops.config = null; // use src doc's config
    const doc = await makeRSDoc(ops, "spec/core/beforeSave-spec.html");
    expect(doc.getElementById("p1")).toBeNull();
    expect(doc.getElementById("p2")).toBeNull();
    const exportedDoc = await getExportedDoc(doc);
    expect(exportedDoc.querySelectorAll("#p1").length).toBe(1);
    expect(exportedDoc.querySelectorAll("#p2").length).toBe(1);
  });

  it("complains if it's not passed an array", async () => {
    const ops = makeStandardOps({ beforeSave: "not a array" });
    const doc = await makeRSDoc(ops);
    const errors = doc.respec.errors.filter(
      err => err.plugin === "core/beforeSave"
    );
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("array of synchronous JS functions");
  });

  it("complains if it's not passed a function in the array", async () => {
    const ops = makeStandardOps({ beforeSave: ["not a function", () => {}] });
    const doc = await makeRSDoc(ops);
    const errors = doc.respec.errors.filter(
      err => err.plugin === "core/beforeSave"
    );
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("array of synchronous JS functions");
  });

  it("complains if passed an async function", async () => {
    const ops = makeStandardOps({ beforeSave: [() => {}, async () => {}] });
    const doc = await makeRSDoc(ops);
    const errors = doc.respec.errors.filter(
      err => err.plugin === "core/beforeSave"
    );
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("array of synchronous JS functions");
  });
});
