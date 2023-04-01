"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
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

  it("inserts a meta element for the description", async () => {
    const ops = {
      config: makeBasicConfig(),
      abstract: `<p>
        Pass \t
      </p>
      <p>Fail</p>`,
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    const metas = doc.querySelectorAll("meta[name=description]");
    expect(metas).toHaveSize(1);
    const [meta] = metas;
    expect(meta.content).toBe("Pass");
  });
});
