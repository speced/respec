"use strict";
describe("Core - Github", () => {
  afterAll(flushIframes);
  const stringOpt = {
    config: Object.assign(makeBasicConfig(), {
      github: "https://github.com/w3c/respec/",
    }),
    body: makeDefaultBody(),
  };
  const objOpt = {
    config: Object.assign(makeBasicConfig(), {
      github: {
        repoURL: "https://github.com/w3c/respec/",
        branch: "develop",
      },
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
      expect(conf.hasOwnProperty("githubAPI")).toEqual(true);
      expect(conf.githubAPI).toEqual("https://api.github.com/repos/w3c/respec");
      expect(conf.hasOwnProperty("issueBase")).toEqual(true);
      expect(conf.issueBase).toEqual("https://github.com/w3c/respec/issues/");
      expect(conf.hasOwnProperty("edDraftURI")).toEqual(true);
      expect(conf.edDraftURI).toEqual("https://w3c.github.io/respec/");
      expect(conf.hasOwnProperty("shortName")).toEqual(true);
      expect(conf.shortName).toEqual("respec");
    }
    function doesntOverrideTest(doc) {
      const { respecConfig: conf } = doc.defaultView;
      expect(conf.githubAPI).toEqual("https://test.com/githubAPI");
      expect(conf.issueBase).toEqual("https://test.com/issueBase");
      expect(conf.edDraftURI).toEqual("https://test.com/edDraftURI");
      expect(conf.shortName).toEqual("dontOverrideThis");
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
    it("doesn't override githubAPI, issueBase, edDraftURI, shortName members if present (from string)", async () => {
      const opts = {
        config: Object.assign(makeBasicConfig(), dontOverrideTheseOps, {
          github: "https://github.com/w3c/respec/",
        }),
      };
      const doc = await makeRSDoc(opts);
      doesntOverrideTest(doc);
    });
    it("doesn't override githubAPI, issueBase, edDraftURI, shortName members if present (from object)", async () => {
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
    function definitionListTest(doc) {
      const { respecConfig: { l10n } } = doc.defaultView;
      const participate = Array.from(doc.querySelectorAll("dt")).find(
        node => node.textContent === l10n.participate + ":"
      );
      expect(participate).toBeTruthy();
      const fileABug = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === l10n.file_a_bug
      );
      expect(fileABug).toBeTruthy();
      expect(fileABug.querySelector("a").href).toEqual(
        "https://github.com/w3c/respec/issues/"
      );
      const commitHistory = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === l10n.commit_history
      );
      expect(commitHistory).toBeTruthy();
      const ghLink = Array.from(doc.querySelectorAll("dd")).find(
        elem => elem.textContent.trim() === "GitHub w3c/respec"
      );
      expect(ghLink).toBeTruthy();
      expect(ghLink.querySelector("a").href).toEqual(
        "https://github.com/w3c/respec/"
      );
      // This differs between the string and the object tests, so we return it
      return commitHistory;
    }
    it("generates a participate set of links (from string)", async () => {
      const doc = await makeRSDoc(stringOpt);
      const commitHistory = definitionListTest(doc);
      expect(commitHistory.querySelector("a").href).toEqual(
        "https://github.com/w3c/respec/commits/gh-pages"
      );
    });
    it("generates a participate set of links (from object)", async () => {
      const doc = await makeRSDoc(objOpt);
      const commitHistory = definitionListTest(doc);
      expect(commitHistory.querySelector("a").href).toEqual(
        "https://github.com/w3c/respec/commits/develop"
      );
    });
  });
});
