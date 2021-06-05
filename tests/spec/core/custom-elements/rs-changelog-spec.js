"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../../SpecHelper.js";

describe("Core - Custom Elements - <rs-changelog>", () => {
  afterAll(flushIframes);

  const conf = {
    github: "org/repo",
    githubAPI: `${window.parent.location.origin}/tests/data/github`,
  };

  it("shows all commits since given tag", async () => {
    const body = `<rs-changelog from="CR2" to="HEAD"></rs-changelog>`;
    const ops = makeStandardOps(conf, body);
    const doc = await makeRSDoc(ops);

    const commits = doc.querySelectorAll("rs-changelog li");
    expect(commits).toHaveSize(8);
    const firstCommit = commits[0];
    expect(firstCommit.textContent).toBe("chore: ReSpec fixes");
    const links = firstCommit.querySelectorAll("a");
    expect(links).toHaveSize(1);
    expect(links[0].href).toBe("https://github.com/org/repo/commit/80aad0a");
  });

  it("filters commits if a filter function is provided", async () => {
    const body = `
      <script>
        function changesSinceFilter(commit) {
          return !commit.message.startsWith("chore");
        }
      </script>
      <rs-changelog from="CR2" to="HEAD" filter="changesSinceFilter"></rs-changelog>
    `;
    const ops = makeStandardOps(conf, body);
    const doc = await makeRSDoc(ops);

    const commits = doc.querySelectorAll("rs-changelog li");
    expect(commits).toHaveSize(5);
    const firstCommit = commits[0];
    expect(firstCommit.textContent).toBe(
      "Editorial: Add privacy notice regarding <var> usage (#869)"
    );
    const links = firstCommit.querySelectorAll("a");
    expect(links).toHaveSize(2);
    const [commitLink, prLink] = links;
    expect(commitLink.href).toBe("https://github.com/org/repo/commit/276f4ba");
    expect(prLink.href).toBe("https://github.com/org/repo/pull/869");
  });
});
