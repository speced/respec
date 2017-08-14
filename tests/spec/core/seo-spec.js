"use strict";
describe("Core — Seo", () => {
  afterAll(flushIframes);
  it("doesn't insert a meta description element if there is no abstract", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
        <section id="">
          <p>Fail</p>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    await doc.respecIsReady;
    expect(doc.querySelectorAll("meta[name=description]").length).toEqual(0);
  });

  it("inserts a meta description element after processing", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
        <section id="abstract">
          <p>Pass</p>
          <p>Fail</p>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    await doc.respecIsReady;
    expect(doc.querySelectorAll("meta[name=description]").length).toEqual(1);
    const meta = doc.head.querySelector("meta[name=description]");
    expect(meta.content).toEqual("Pass");
  });
});
