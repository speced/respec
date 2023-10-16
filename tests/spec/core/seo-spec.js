"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Seo", () => {
  afterAll(flushIframes);
  it("doesn't insert a meta description element if there is no abstract", async () => {
    const ops = {
      config: makeBasicConfig(),
      abstract: "\n",
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    const hasMetaDesc = doc.querySelectorAll("meta[name=description]");
    expect(hasMetaDesc).toHaveSize(0);
  });

  it("inserts a meta element for the description after processing", async () => {
    const ops = {
      config: makeBasicConfig(),
      abstract: `<p>
        Pass \t
      </p>
      <p>Fail</p>`,
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    const hasMetaDesc = doc.querySelectorAll("meta[name=description]").length;
    expect(hasMetaDesc).toBe(1);
    const meta = doc.head.querySelector("meta[name=description]");
    expect(meta.content).toBe("Pass");
  });

  it("documents a revision in a meta element when set", async () => {
    const gitRevision = "11223344556677889900aabbccddeeffaabbccddeeff";
    const doc = await makeRSDoc(
      makeStandardOps({ specStatus: "ED", group: "webapps", gitRevision })
    );
    expect(
      doc.querySelector(`meta[name='revision'][content='${gitRevision}']`)
    ).toBeTruthy();
  });
});
