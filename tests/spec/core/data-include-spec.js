"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
} from "../SpecHelper.js";

describe("Core — Data Include", () => {
  afterAll(flushIframes);
  // this does not test much, someone for whom this is
  // important should provide more tests
  const url = "/tests/spec/core/includer.html";

  /**
   * @param {string} text
   */
  function generateDataUrl(text) {
    return `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
  }

  it("includes an external file and remove the data-include attr", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops, url);
    const p = doc.querySelector("#includes > div > p");
    expect(p).toBeTruthy();
    expect(p.textContent).toBe("INCLUDED");
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
    expect(missing).toBe(null);
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
          data-include="${generateDataUrl("## PASS")}">
        </section>`,
    };
    ops.config.format = "markdown";
    const doc = await makeRSDoc(ops);
    const h2 = doc.querySelector("#includes > h2");
    expect(h2).toBeTruthy();
    expect(h2.textContent).toBe("1. PASS");
    expect(doc.querySelectorAll("*[data-include]").length).toBe(0);
  });

  it("indents multiline text", async () => {
    const include = `Blue rose is blue

Red rose is red

Rose of the wasteland is violet
`;
    const ops = {
      config: {
        ...makeBasicConfig(),
        format: "markdown",
      },
      body: `
        ## R

        1. Rose

          <div data-include="${generateDataUrl(
            include
          )}" data-include-replace></div>
      `,
    };
    ops.abstract = null;

    const doc = await makeRSDoc(ops);
    const li = doc.querySelector("section li");
    expect(li).toBeTruthy();
    expect(li.textContent).toContain("Rose");
    // all text should be indented and thus recognized as a part of the list item
    expect(li.textContent).toContain("Blue");
    expect(li.textContent).toContain("Red");
    expect(li.textContent).toContain("wasteland");
  });
});
