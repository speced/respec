"use strict";

import { flushIframes, makePluginDoc } from "../SpecHelper.js";

describe("Core - style", () => {
  afterAll(flushIframes);

  it("uses accessible contrast for section self-link icon", async () => {
    const doc = await makePluginDoc(["/src/core/style.js"]);
    const style = doc.getElementById("respec-mainstyle");
    expect(style.textContent).toMatch(/opacity:\s*0.8;/);
  });

  it("keeps the h4-h6 self-link icon the same color as its heading", async () => {
    // --heading-text is the h2/h3 heading color; h4-h6 headings don't use it,
    // so the icon must follow its own heading instead.
    const doc = await makePluginDoc(["/src/core/style.js"], {
      body: `
        <input type="radio" name="color-scheme" value="dark" checked />
        <div style="color: rgb(1, 2, 3); --heading-text: rgb(9, 9, 9)">
          <h4 id="four">Four</h4><a class="self-link" href="#four"></a>
        </div>`,
    });
    const icon = doc.querySelector('a[href="#four"]');
    const iconColor = () =>
      doc.defaultView.getComputedStyle(icon, "::before").color;
    const darkToggle = doc.querySelector("input[name='color-scheme']");

    expect(iconColor()).toBe("rgb(1, 2, 3)");

    darkToggle.checked = false;
    expect(iconColor()).toBe("rgb(1, 2, 3)");
  });
});
