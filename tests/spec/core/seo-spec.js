"use strict";
describe("Core — Seo", () => {
  afterAll(flushIframes);
  it("doesn't insert a meta description element if there is no abstract", async () => {
    const ops = {
      config: makeBasicConfig(),
      abstract: "\n",
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    await doc.respecIsReady;
    await new Promise(resolve => {
      const check = () => {
        const hasMetaDesc = doc.querySelectorAll("meta[name=description]")
          .length;
        expect(hasMetaDesc).toEqual(0);
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
    await doc.respecIsReady;
    await new Promise(resolve => {
      const check = () => {
        const hasMetaDesc = doc.querySelectorAll("meta[name=description]")
          .length;
        expect(hasMetaDesc).toEqual(1);
        const meta = doc.head.querySelector("meta[name=description]");
        expect(meta.content).toEqual("Pass");
        resolve();
      };
      window.requestIdleCallback ? window.requestIdleCallback(check) : check();
    });
  });
});
