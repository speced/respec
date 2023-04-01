"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Algorithm Lists", () => {
  afterAll(flushIframes);

  it("adds 'assert' CSS class to Assert: in ordered lists that are marked as algorithms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section>
          <ol class='algorithm'>
            <li>
              Assert: one.
            </li>
            <li>This one shouldn't be modified.</li>
            <li>Assert: two.</li>
          </ol>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll(".assert")).toHaveSize(2);
  });

  it("links to assert dfn in infra spec", async () => {
    const body = `<section id="test">
      <ol class="algorithm">
        <li>Assert: one.</li>
        <li>This one shouldn't be modified.</li>
        <li>Assert: two <a href="#test">a link to be preserved</a>.</li>
      </ol>
    </section>`;
    const doc = await makeRSDoc(makeStandardOps(null, body));

    expect(doc.querySelectorAll("li.assert")).toHaveSize(2);
    const [first, second] = [...doc.querySelectorAll("li.assert")];

    expect(first.textContent).toBe("Assert: one.");
    expect(first.querySelectorAll("a")).toHaveSize(1);
    expect(first.querySelector("a").hash).toBe("#assert");

    expect(second.querySelectorAll("a")).toHaveSize(2);
    expect(second.querySelector("a:nth-child(1)").hash).toBe("#assert");
    expect(second.querySelector("a:nth-child(2)").hash).toBe("#test");
  });

  it("doesn't add 'assert' CSS class to Assert: in ordered lists that are not marked as algorithms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section>
          <ol>
            <li>Assert: shouldn't be modified.</li>
            <li>This shouldn't be modified.</li>
          </ol>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll(".assert")).toHaveSize(0);
  });
});
