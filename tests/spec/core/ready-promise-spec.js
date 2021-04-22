"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("respecIsReady promise", () => {
  afterAll(flushIframes);

  it("resolves when processing is done", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    expect(doc.hasOwnProperty("respecIsReady")).toBe(true);
    expect(doc.respecIsReady instanceof doc.defaultView.Promise).toBe(true);
    await expectAsync(doc.respecIsReady).toBeResolvedTo(undefined);
  });
});
