"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Contributors", () => {
  afterAll(flushIframes);

  const config = {
    github: "org/repo",
    githubAPI: `${window.parent.location.origin}/tests/data/github`,
  };

  it("Expands list of contributor names", async () => {
    const body = `
      <section>
        <div id="gh-contributors"></div>
      </section>
    `;
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const contributors = doc.querySelector("#gh-contributors");
    expect(contributors.textContent).toBe(
      "Bobby Tables, buzz_aldrin, and Neil Armstrong"
    );
  });

  it("Expands list of contributors with ul#gh-contributors", async () => {
    const body = `
      <section>
        <ul id="gh-contributors"></ul>
      </section>
    `;
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    expect(doc.querySelectorAll("#gh-contributors li")).toHaveSize(3);
    const bobbyTables = doc.querySelector("#gh-contributors li");
    expect(bobbyTables.querySelector("a").textContent).toBe("Bobby Tables");
    expect(bobbyTables.querySelector("a").href).toBe(
      "https://github.com/bob_park"
    );
  });
});
