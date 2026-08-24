"use strict";

import { flushIframes, makePluginDoc } from "../SpecHelper.js";

describe("Core - style", () => {
  afterAll(flushIframes);

  it("uses accessible contrast for section self-link icon", async () => {
    const doc = await makePluginDoc(["/src/core/style.js"]);
    const style = doc.getElementById("respec-mainstyle");
    expect(style.textContent).toMatch(/opacity:\s*0.8;/);
  });

  it("colors the h4-h6 self-link icon like its heading, not --heading-text", async () => {
    // --heading-text is the h2/h3 heading color. W3C's stylesheets leave h4-h6
    // to inherit the surrounding text color, so the icon has to as well.
    const doc = await makePluginDoc(["/src/core/style.js"], {
      body: `
        <input type="radio" name="color-scheme" value="dark" checked />
        <div style="color: rgb(1, 2, 3); --heading-text: rgb(9, 9, 9)">
          <h4 id="four">Four</h4><a class="self-link" href="#four"></a>
          <h5 id="five">Five</h5><a class="self-link" href="#five"></a>
          <h6 id="six">Six</h6><a class="self-link" href="#six"></a>
        </div>`,
    });
    const win = doc.defaultView;
    // Firefox returns an empty declaration for a pseudo-element with no
    // generated box, and makePluginDoc hides its iframe. Render it first.
    win.frameElement.style.display = "block";

    const expectIconsMatchHeadings = () => {
      for (const id of ["four", "five", "six"]) {
        const icon = doc.querySelector(`a[href="#${id}"]`);
        const iconColor = win.getComputedStyle(icon, "::before").color;
        const headingColor = win.getComputedStyle(doc.getElementById(id)).color;
        expect(iconColor).toBe(headingColor);
      }
    };

    expectIconsMatchHeadings();

    doc.querySelector("input[name='color-scheme']").checked = false;
    expectIconsMatchHeadings();
  });
});
