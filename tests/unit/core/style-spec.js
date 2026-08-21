"use strict";

import { flushIframes, makePluginDoc } from "../SpecHelper.js";

describe("Core - style", () => {
  afterAll(flushIframes);

  it("uses accessible contrast for section self-link icon", async () => {
    const doc = await makePluginDoc(["/src/core/style.js"]);
    const style = doc.getElementById("respec-mainstyle");
    expect(style.textContent).toMatch(/opacity:\s*0.8;/);
    expect(style.textContent).toMatch(
      /@media \(prefers-color-scheme: dark\) {\s*:is\(h4, h5, h6\) \+ a\.self-link::before {\s*color:\s*var\(--heading-text\);/
    );
    expect(style.textContent).toMatch(
      /body:has\(input\[name='color-scheme'\]\[value='dark'\]:checked\)\s*:is\(h4, h5, h6\) \+ a\.self-link::before {\s*color:\s*var\(--heading-text\);/
    );
  });
});
