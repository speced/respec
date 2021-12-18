import {
  errorFilters,
  flushIframes,
  getExportedDoc,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core - beforeSave config option", () => {
  afterAll(flushIframes);
  const beforeSaveErrors = errorFilters.filter("core/before-save");
  it("allows modification before saving", async () => {
    const ops = makeStandardOps();
    ops.config = null; // use src doc's config
    const doc = await makeRSDoc(ops, "spec/core/before-save-spec.html");
    expect(doc.getElementById("p1")).toBeNull();
    expect(doc.getElementById("p2")).toBeNull();
    const exportedDoc = await getExportedDoc(doc);
    expect(exportedDoc.querySelectorAll("#p1").length).toBe(1);
    expect(exportedDoc.querySelectorAll("#p2").length).toBe(1);
    // make sure that the functions are run in order...
    const p1 = exportedDoc.querySelector("#p1");
    const p2 = exportedDoc.querySelector("#p2");
    expect(p1.nextElementSibling).toBe(p2);
  });

  it("complains if it's not passed an array", async () => {
    const ops = makeStandardOps({ beforeSave: "not a array" });
    const doc = await makeRSDoc(ops);
    const errors = beforeSaveErrors(doc);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("array of synchronous JS functions");
  });

  it("complains if it's not passed a function in the array", async () => {
    const ops = makeStandardOps({ beforeSave: ["not a function", () => {}] });
    const doc = await makeRSDoc(ops);
    const errors = beforeSaveErrors(doc);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("array of synchronous JS functions");
  });

  it("complains if passed an async function", async () => {
    const ops = makeStandardOps({ beforeSave: [() => {}, async () => {}] });
    const doc = await makeRSDoc(ops);
    const errors = beforeSaveErrors(doc);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("array of synchronous JS functions");
  });
});
