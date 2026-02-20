"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
} from "../SpecHelper.js";

describe("Core - Github", () => {
  afterAll(flushIframes);
  const stringOpt = {
    config: Object.assign(makeBasicConfig(), {
      github: "https://github.com/speced/respec/",
      excludeGithubLinks: false,
    }),
    body: makeDefaultBody(),
  };
  const objOpt = {
    config: Object.assign(makeBasicConfig(), {
      github: {
        repoURL: "https://github.com/speced/respec/",
        branch: "develop",
      },
      excludeGithubLinks: false,
    }),
    body: makeDefaultBody(),
  };
  // these are set by makeBasicConfig(), but we are going to override them
  delete stringOpt.config.edDraftURI;
  delete stringOpt.config.shortName;
  delete objOpt.config.edDraftURI;
  delete objOpt.config.shortName;
  describe("respecConfig options", () => {
    function generateMembersTest(doc) {
      const { respecConfig: conf } = doc.defaultView;
      expect(conf.hasOwnProperty("githubAPI")).toBe(true);
      expect(conf.githubAPI).toBe("https://respec.org/github");
      expect(conf.hasOwnProperty("issueBase")).toBe(true);
      expect(conf.issueBase).toBe("https://github.com/speced/respec/issues/");
      expect(conf.hasOwnProperty("edDraftURI")).toBe(true);
      expect(conf.edDraftURI).toBe("https://speced.github.io/respec/");
      expect(conf.hasOwnProperty("shortName")).toBe(true);
      expect(conf.shortName).toBe("respec");
    }
    function doesntOverrideTest(doc) {
      const { respecConfig: conf } = doc.defaultView;
      expect(conf.issueBase).toBe("https://test.com/issueBase");
      expect(conf.edDraftURI).toBe("https://test.com/edDraftURI");
      expect(conf.shortName).toBe("dontOverrideThis");
    }
    it("generates githubAPI, issueBase, edDraftURI, shortName members from string", async () => {
      const doc = await makeRSDoc(stringOpt);
      generateMembersTest(doc);
    });
    it("generates githubAPI, issueBase, edDraftURI, shortName members from object", async () => {
      const doc = await makeRSDoc(objOpt);
      generateMembersTest(doc);
    });
    const dontOverrideTheseOps = {
      githubAPI: "https://test.com/githubAPI",
      issueBase: "https://test.com/issueBase",
      edDraftURI: "https://test.com/edDraftURI",
      shortName: "dontOverrideThis",
    };
    it("doesn't override issueBase, edDraftURI, shortName members if present (from string)", async () => {
      const opts = {
        config: Object.assign(makeBasicConfig(), dontOverrideTheseOps, {
          github: "https://github.com/speced/respec/",
        }),
      };
      const doc = await makeRSDoc(opts);
      doesntOverrideTest(doc);
    });
    it("doesn't override issueBase, edDraftURI, shortName members if present (from object)", async () => {
      const opts = {
        config: Object.assign(makeBasicConfig(), dontOverrideTheseOps, {
          github: { repoURL: "https://github.com/speced/respec/" },
        }),
      };
      const doc = await makeRSDoc(opts);
      doesntOverrideTest(doc);
    });
    it("normalizes github object with custom pullsURL and commitHistoryURL", async () => {
      const opts = {
        config: Object.assign(makeBasicConfig(), {
          github: {
            repoURL: "https://github.com/w3c/core-aam/",
            pullsURL: "https://github.com/w3c/aria/pulls/",
            commitHistoryURL: "https://github.com/w3c/aria/commits/",
          },
        }),
        body: makeDefaultBody(),
      };
      delete opts.config.edDraftURI;
      delete opts.config.shortName;

      const doc = await makeRSDoc(opts);
      const { respecConfig: conf } = doc.defaultView;

      // Check that the github object is normalized correctly
      expect(conf.github.pullsURL).toBe("https://github.com/w3c/aria/pulls/");
      expect(conf.github.commitHistoryURL).toBe(
        "https://github.com/w3c/aria/commits/"
      );
      expect(conf.github.issuesURL).toBe(
        "https://github.com/w3c/core-aam/issues/"
      );
      expect(conf.github.repoURL).toBe("https://github.com/w3c/core-aam/");
    });
  });
  describe("the definition list items (localized)", () => {
    const l10n = {
      htmlAttrs: {
        lang: "nl",
      },
    };
    function definitionListTest(doc) {
      const participate = Array.from(doc.querySelectorAll("dt")).find(
        node => node.textContent === "Doe mee:"
      );
      expect(participate).toBeTruthy();
      const fileABug = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "Dien een melding in"
      );
      expect(fileABug).toBeTruthy();
      expect(fileABug.querySelector("a").href).toBe(
        "https://github.com/speced/respec/issues/"
      );
      const commitHistory = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "Revisiehistorie"
      );
      expect(commitHistory).toBeTruthy();
      const ghLink = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "GitHub speced/respec"
      );
      const pullRequests = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "Pull requests"
      );
      expect(pullRequests).toBeTruthy();
      expect(pullRequests.querySelector("a").href).toBe(
        "https://github.com/speced/respec/pulls/"
      );
      expect(ghLink).toBeTruthy();
      expect(ghLink.querySelector("a").href).toBe(
        "https://github.com/speced/respec/"
      );
      // This differs between the string and the object tests, so we return it
      return commitHistory;
    }
    it("generates a participate set of links (from string)", async () => {
      const doc = await makeRSDoc({ ...l10n, ...stringOpt });
      const commitHistory = definitionListTest(doc);
      expect(commitHistory.querySelector("a").href).toBe(
        "https://github.com/speced/respec/commits/"
      );
    });
    it("generates a participate set of links (from object)", async () => {
      const doc = await makeRSDoc({ ...l10n, ...objOpt });
      const commitHistory = definitionListTest(doc);
      expect(commitHistory.querySelector("a").href).toBe(
        "https://github.com/speced/respec/commits/develop"
      );
    });
    it("supports custom pullsURL and commitHistoryURL for monorepo scenarios", async () => {
      const customOpt = {
        config: Object.assign(makeBasicConfig(), {
          github: {
            repoURL: "https://github.com/w3c/core-aam/",
            pullsURL:
              "https://github.com/w3c/aria/pulls?q=+label%3A%22spec%3Acore-aam%22is%3Apr+is%3Aopen+",
            commitHistoryURL:
              "https://github.com/w3c/aria/commits/main/core-aam",
          },
          excludeGithubLinks: false,
        }),
        body: makeDefaultBody(),
        htmlAttrs: {
          lang: "nl",
        },
      };
      delete customOpt.config.edDraftURI;
      delete customOpt.config.shortName;

      const doc = await makeRSDoc(customOpt);

      // Check that the custom pull request URL with parameters is used
      const pullRequests = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "Pull requests"
      );
      expect(pullRequests).toBeTruthy();
      expect(pullRequests.querySelector("a").href).toBe(
        "https://github.com/w3c/aria/pulls?q=+label%3A%22spec%3Acore-aam%22is%3Apr+is%3Aopen+"
      );

      // Check that the custom commit history URL is used
      const commitHistory = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "Revisiehistorie"
      );
      expect(commitHistory).toBeTruthy();
      expect(commitHistory.querySelector("a").href).toBe(
        "https://github.com/w3c/aria/commits/main/core-aam"
      );

      // Issue base should still use repoURL
      const fileABug = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "Dien een melding in"
      );
      expect(fileABug).toBeTruthy();
      expect(fileABug.querySelector("a").href).toBe(
        "https://github.com/w3c/core-aam/issues/"
      );
    });
  });
});
