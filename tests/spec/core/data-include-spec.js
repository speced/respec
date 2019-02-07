"use strict";
describe("Core — Data Include", () => {
  afterAll(flushIframes);
  // this does not test much, someone for whom this is
  // important should provide more tests
  const url = "/tests/spec/core/includer.html";

  it("includes an external file and remove the data-include attr", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops, url);
    const p = doc.querySelector("#includes > div > p");
    expect(p).toBeTruthy();
    expect(p.textContent).toEqual("INCLUDED");
    const div = doc.querySelector("#includes > div");
    expect(div.dataset.include).toBe(undefined);
    expect(div.dataset.includeFormat).toBe(undefined);
    expect(div.dataset.dontRemove).toBe("pass");
  });

  it("replaces sections when data-include-replace is present", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops, url);
    const missing = doc.getElementById("this-should-be-missing");
    expect(missing).toEqual(null);
    const included = doc.getElementById("replacement-test");
    expect(included).toBeTruthy();
    const heading = doc.querySelector("#replacement-test > h3");
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Replacement");
  });

  it("gracefully handles empty data-includes", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops, url);
    const container = doc.getElementById("empty-include");
    expect(container).toBeTruthy();
    expect(container.textContent).toBe("");
  });

  it("includes text when data-include-format is 'text'", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops, url);
    const container = doc.getElementById("no-replace");
    expect(container).toBeTruthy();
    expect(container.textContent).toBe("<p>pass</p>");
  });

  it("includes a URL and processes it as markdown", async () => {
    // Data URI encoding of: "## PASS", which markdown converts to a H2 element.
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section
          id="includes"
          data-include="data:text/plain;charset=utf-8,%23%23%20PASS">
        </section>`,
    };
    ops.config.format = "markdown";
    const doc = await makeRSDoc(ops);
    const h2 = doc.querySelector("#includes > h2");
    expect(h2).toBeTruthy();
    expect(h2.textContent).toEqual("1. PASS");
    expect(doc.querySelectorAll("*[data-include]").length).toBe(0);
  });
});
