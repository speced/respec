import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";
import respecCss from "../../../src/styles/respec.css.js";

describe("Core — Style", () => {
  afterAll(flushIframes);
  it("includes ReSpec's style element", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const style = doc.getElementById("respec-mainstyle");
    expect(style).toBeTruthy();
  });

  it("makes header wrapper full width", () => {
    expect(respecCss).toMatch(
      /\.header-wrapper\s*\{[^}]*\bwidth:\s*100%\s*;[^}]*\}/
    );
  });
});
