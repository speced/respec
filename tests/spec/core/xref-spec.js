"use strict";
describe("Core — xref", () => {
  afterAll(flushIframes);

  const apiURL = location.origin + "/tests/data/xref.json";

  it("does nothing if xref is not enabled", async () => {
    const body = `<a id="external-link">EventHandler</a>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.getAttribute("href")).toBeFalsy();
  });

  it("adds link to unique <a> terms", async () => {
    const body = `<a id="external-link">event handler</a>`;
    const config = { xref: { url: apiURL } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.href).toEqual(
      "https://html.spec.whatwg.org/multipage/webappapis.html#event-handlers"
    );
    expect(link.classList.contains("respec-offending-element")).toBeFalsy();

    // test: adds citation in references section
    const ref = doc.querySelector("#references dt");
    expect(ref).toBeTruthy();
    expect(ref.textContent.toLowerCase()).toEqual("[html]");
  });

  it("fails to add link to non-existing terms", async () => {
    const body = `<a id="external-link">NOT_FOUND</a>`;
    const config = { xref: { url: apiURL } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.classList.contains("respec-offending-element")).toBeTruthy();
    expect(link.getAttribute("href")).toBeFalsy();
    expect(link.title).toEqual("Error: No matching dfn found.");
  });
});
