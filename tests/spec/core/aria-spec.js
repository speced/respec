"use strict";
fdescribe("Core — Aria", () => {
  afterAll(flushIframes);
  it("shows the body and sets it to no longer busy after processing", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    const doc = await makeRSDoc(ops);
    await doc.respecIsReady;
    expect(doc.body.getAttribute("aria-busy")).toBe("false");
    expect(doc.body.hidden).toBe(false);
    expect(doc.body.hasAttribute("aria-live")).toBe(false);
  });
});
