"use strict";
describe("Core — Aria", () => {
  afterAll(done => {
    flushIframes();
    done();
  });
  it("shows the body and sets it to no longer busy after processing", done => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    makeRSDoc(ops, async doc => {
      await doc.respecIsReady;
      expect(doc.body.getAttribute("aria-busy")).toBe("false");
      expect(doc.body.hidden).toBe(false);
    }).then(done);
  });
});
