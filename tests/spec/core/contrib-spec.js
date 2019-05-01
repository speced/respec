"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Contributors and Commenters", () => {
  afterAll(flushIframes);
  it("Expands contributors and commenters", async () => {
    const body = `
      <section>
        <div id="gh-commenters"></div>
        <div id="gh-contributors"></div>
      </section>
    `;
    const ops = makeStandardOps(
      {
        githubAPI: `${window.parent.location.origin}/tests/data/contrib/index`,
      },
      body
    );
    const doc = await makeRSDoc(ops);

    const commenters = doc.querySelector("#gh-commenters");
    const contributors = doc.querySelector("#gh-contributors");
    expect(commenters).not.toBeNull();
    expect(contributors).not.toBeNull();
    expect(commenters.textContent).toBe(
      "Bobby Tables, buzz_aldrin, jane_smith, John Doe, and Neil Armstrong"
    );
    expect(contributors.textContent).toBe(
      "Bobby Tables, buzz_aldrin, and Neil Armstrong"
    );
  });
  it("Expands contributors only", async () => {
    const body = `
      <section>
        <div id="gh-contributors"></div>
      </section>
    `;
    const ops = makeStandardOps(
      {
        githubAPI: `${window.parent.location.origin}/tests/data/contrib/index`,
      },
      body
    );
    const doc = await makeRSDoc(ops);

    const contributors = doc.querySelector("#gh-contributors");
    expect(contributors).not.toBeNull();
    expect(contributors.textContent).toBe(
      "Bobby Tables, buzz_aldrin, and Neil Armstrong"
    );
  });
});
