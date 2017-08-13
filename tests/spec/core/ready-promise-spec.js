"use strict";
describe("respecIsReady promise", () => {
  afterAll(flushIframes);

  it("resolve with the resulting respecConfig", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    expect(doc.hasOwnProperty("respecIsReady")).toBe(true);
    expect(doc.respecIsReady instanceof doc.defaultView.Promise).toBe(true);
    const conf = await doc.respecIsReady;
    // the following get changed to a Date objects by ReSpec,
    // so not worth checking for equality.
    delete ops.config.previousPublishDate;
    delete ops.config.perEnd;
    expect(conf).toEqual(jasmine.objectContaining(ops.config));
  });
});
