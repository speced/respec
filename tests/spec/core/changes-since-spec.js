"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Changes Since", () => {
  afterAll(flushIframes);

  const body = `
    <section>
      <ul id="changes-since"></ul>
    </section>`;

  it("Shows all commits since given tag", async () => {
    const conf = {
      github: "org/repo",
      githubAPI: `${window.parent.location.origin}/tests/data/`,
      changesSince: {
        tag: "TAG",
      },
    };
    const ops = makeStandardOps(conf, body);
    const doc = await makeRSDoc(ops);

    const commits = doc.querySelectorAll("ul#changes-since li");
    expect(commits.length).toBe(8);
    const firstCommit = commits[0];
    expect(firstCommit.textContent).toBe("chore: ReSpec fixes");
  });

  it("Filters commits if a filter function is provided", async () => {
    const ops = makeStandardOps(null);
    ops.config = null; // use src doc's config
    const doc = await makeRSDoc(ops, "spec/core/changes-since-spec.html");

    const commits = doc.querySelectorAll("ul#changes-since li");
    expect(commits.length).toBe(5);
    const firstCommit = commits[0];
    expect(firstCommit.textContent).toBe(
      "Editorial: Add privacy notice regarding data usage (#869)"
    );
  });

  it("Does nothing if changesSince is not enabled", async () => {
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const changes = doc.getElementById("changes-since");
    expect(changes.childElementCount).toBe(0);
  });
});
