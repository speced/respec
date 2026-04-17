import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Style", () => {
  afterAll(flushIframes);
  it("includes ReSpec's style element", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const style = doc.getElementById("respec-mainstyle");
    expect(style).toBeTruthy();
  });

  it("makes header wrapper full width", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const style = doc.getElementById("respec-mainstyle");
    expect(style.textContent).toContain(".header-wrapper");
    expect(style.textContent).toMatch(/width:\s*100%/);
  });
});
