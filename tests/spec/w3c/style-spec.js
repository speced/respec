"use strict";

import {
  flushIframes,
  getExportedDoc,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

const statuses = [
  {
    specStatus: undefined,
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
    group: "webapps",
  },
  {
    specStatus: "FPWD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-WD",
    group: "webapps",
  },
  {
    specStatus: "NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-NOTE",
    group: "webapps",
  },
  {
    specStatus: "finding",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
    group: "tag",
  },
  {
    specStatus: "draft-finding",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
    group: "tag",
  },
  {
    specStatus: "editor-draft-finding",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
    group: "tag",
  },
  {
    specStatus: "unofficial",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-UD",
  },
  {
    specStatus: "base",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
  },
  {
    specStatus: "RSCND",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-RSCND",
    group: "webapps",
  },
  {
    specStatus: "FAKE-TEST-TYPE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
  },
  {
    specStatus: "CG-FINAL",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/cg-final",
    group: "wicg",
  },
  {
    specStatus: "CG-DRAFT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/cg-draft",
    group: "wicg",
  },
  {
    specStatus: "BG-FINAL",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/bg-final",
    group: "autowebplatform",
  },
  {
    specStatus: "BG-DRAFT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/bg-draft",
    group: "publishingbg",
  },
  {
    specStatus: "CR",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-CR",
    group: "webapps",
  },
  {
    specStatus: "CRD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-CRD",
    group: "webapps",
  },
  {
    specStatus: "CRY",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-CRY",
    group: "webapps",
  },
  {
    specStatus: "CRYD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-CRYD",
    group: "webapps",
  },
  {
    specStatus: "DISC",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-DISC",
    group: "webapps",
  },
  {
    specStatus: "DNOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-DNOTE",
    group: "webapps",
  },
  {
    specStatus: "DRY",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-DRY",
    group: "webapps",
  },
  {
    specStatus: "ED",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-ED",
    group: "webapps",
  },
  {
    specStatus: "Member-SUBM",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-Member-SUBM",
    group: "webapps",
  },
  {
    specStatus: "NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-NOTE",
    group: "webapps",
  },
  {
    specStatus: "PR",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-PR",
    group: "webapps",
  },
  {
    specStatus: "REC",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-REC",
    group: "webapps",
  },
  {
    specStatus: "RSCND",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-RSCND",
    group: "webapps",
  },
  {
    specStatus: "RY",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-RY",
    group: "webapps",
  },
  {
    specStatus: "STMT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-STMT",
    group: "webapps",
  },
  {
    specStatus: "UD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-UD",
  },
  {
    specStatus: "WD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-WD",
    group: "webapps",
  },
];

describe("W3C - Style", () => {
  afterAll(flushIframes);

  it("should include 'fixup.js'", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const query = "script[src^='https://www.w3.org/scripts/TR/2021/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem.src).toBe("https://www.w3.org/scripts/TR/2021/fixup.js");
  });

  it("should have a meta viewport added", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const elem = doc.head.querySelector("meta[name=viewport]");
    expect(elem).toBeTruthy();
    const expectedStr = "width=device-width, initial-scale=1, shrink-to-fit=no";
    expect(elem.content).toBe(expectedStr);
  });

  for (const { specStatus, expectedURL, group } of statuses) {
    it(`styles with specStatus: ${specStatus}; group: ${group}`, async () => {
      const conf = {
        specStatus,
        group,
      };
      const ops = makeStandardOps(conf);
      const doc = await makeRSDoc(ops);
      const query = `link[href^='${expectedURL}']`;
      const elem = doc.querySelector(query);
      expect(elem).toBeTruthy();
      expect(elem.href).toBe(expectedURL);
    });
  }

  it("should add W3C stylesheet at the end", async () => {
    const ops = makeStandardOps({});
    const doc = await getExportedDoc(await makeRSDoc(ops));
    const url = "https://www.w3.org/StyleSheets/TR/2021/base";
    const elem = doc.querySelector(`link[href^='${url}'][rel="stylesheet"]`);
    expect(elem).toBeTruthy();
    expect(elem.nextElementSibling).toBe(null);
  });

  it("respects existing color scheme", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops, "spec/core/color-scheme.html");
    const elem = doc.querySelector("meta[name='color-scheme']");
    expect(elem).toBeTruthy();
    expect(elem.content).toBe("dark light");
  });

  it("sets the document to light color scheme by default", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    const elem = doc.querySelector("meta[name='color-scheme']");
    expect(elem).toBeTruthy();
    expect(elem.content).toBe("light");
  });

  it("adds dark mode stylesheet", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops, "spec/core/color-scheme.html");
    /** @type HTMLLinkElement? */
    const link = doc.querySelector(
      `link[href="https://www.w3.org/StyleSheets/TR/2021/dark.css"]`
    );
    expect(link).toBeTruthy();
  });

  it("adds darkmode stylesheet at the end", async () => {
    const ops = makeStandardOps();
    const doc = await getExportedDoc(
      await makeRSDoc(ops, "spec/core/color-scheme.html")
    );
    const linkBase = doc.querySelector(
      `link[href^='https://www.w3.org/StyleSheets/TR/2021/base'][rel="stylesheet"]`
    );
    expect(linkBase).toBeTruthy();
    expect(linkBase.nextElementSibling).toBeTruthy();

    const linkDarkMode = doc.querySelector(
      `link[href^='https://www.w3.org/StyleSheets/TR/2021/dark.css'][rel="stylesheet"]`
    );
    expect(linkDarkMode).toBeTruthy();
    expect(linkDarkMode.nextElementSibling).toBeFalsy();
    expect(linkBase.nextElementSibling).toBe(linkDarkMode);
  });

  it("shouldn't include fixup.js when noToc is set", async () => {
    const ops = makeStandardOps();
    const newProps = {
      noToc: true,
    };
    Object.assign(ops.config, newProps);
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const query = "script[src^='https://www.w3.org/scripts/TR/2021/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem).toBeNull();
  });
});
