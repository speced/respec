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
      github: "https://github.com/w3c/respec/",
      excludeGithubLinks: false,
    }),
    body: makeDefaultBody(),
  };
  const objOpt = {
    config: Object.assign(makeBasicConfig(), {
      github: {
        repoURL: "https://github.com/w3c/respec/",
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
      expect(conf.issueBase).toBe("https://github.com/w3c/respec/issues/");
      expect(conf.hasOwnProperty("edDraftURI")).toBe(true);
      expect(conf.edDraftURI).toBe("https://w3c.github.io/respec/");
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
          github: "https://github.com/w3c/respec/",
        }),
      };
      const doc = await makeRSDoc(opts);
      doesntOverrideTest(doc);
    });
    it("doesn't override issueBase, edDraftURI, shortName members if present (from object)", async () => {
      const opts = {
        config: Object.assign(makeBasicConfig(), dontOverrideTheseOps, {
          github: { repoURL: "https://github.com/w3c/respec/" },
        }),
      };
      const doc = await makeRSDoc(opts);
      doesntOverrideTest(doc);
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
        "https://github.com/w3c/respec/issues/"
      );
      const commitHistory = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "Revisiehistorie"
      );
      expect(commitHistory).toBeTruthy();
      const ghLink = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "GitHub w3c/respec"
      );
      const pullRequests = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "Pull requests"
      );
      expect(pullRequests).toBeTruthy();
      expect(pullRequests.querySelector("a").href).toBe(
        "https://github.com/w3c/respec/pulls/"
      );
      expect(ghLink).toBeTruthy();
      expect(ghLink.querySelector("a").href).toBe(
        "https://github.com/w3c/respec/"
      );
      // This differs between the string and the object tests, so we return it
      return commitHistory;
    }
    it("generates a participate set of links (from string)", async () => {
      const doc = await makeRSDoc({ ...l10n, ...stringOpt });
      const commitHistory = definitionListTest(doc);
      expect(commitHistory.querySelector("a").href).toBe(
        "https://github.com/w3c/respec/commits/"
      );
    });
    it("generates a participate set of links (from object)", async () => {
      const doc = await makeRSDoc({ ...l10n, ...objOpt });
      const commitHistory = definitionListTest(doc);
      expect(commitHistory.querySelector("a").href).toBe(
        "https://github.com/w3c/respec/commits/develop"
      );
    });
  });
});
