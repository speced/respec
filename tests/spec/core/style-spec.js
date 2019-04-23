import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Style", () => {
  afterAll(flushIframes);
  it("includes ReSpec's style element", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const style = doc.getElementById("respec-mainstyle");
    expect(style).toBeTruthy();
  });
});
