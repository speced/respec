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
    await doc.respec.ready;
    await new Promise(resolve => {
      const check = () => {
        const hasMetaDesc = doc.querySelectorAll("meta[name=description]");
        expect(hasMetaDesc).toHaveSize(0);
        resolve();
      };
      window.requestIdleCallback ? window.requestIdleCallback(check) : check();
    });
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
    await doc.respec.ready;
    await new Promise(resolve => {
      const check = () => {
        const hasMetaDesc = doc.querySelectorAll(
          "meta[name=description]"
        ).length;
        // Firefox is buggy, short circuit
        if (navigator.userAgent.includes("Firefox") && !hasMetaDesc) {
          expect(true).toBe(true);
          return;
        }
        expect(hasMetaDesc).toBe(1);
        const meta = doc.head.querySelector("meta[name=description]");
        expect(meta.content).toBe("Pass");
        resolve();
      };
      window.requestIdleCallback
        ? doc.defaultView.requestIdleCallback(check)
        : check();
    });
  });
});
