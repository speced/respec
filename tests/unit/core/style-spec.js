"use strict";

import { flushIframes, makePluginDoc } from "../SpecHelper.js";

describe("Core - style", () => {
  afterAll(flushIframes);

  it("uses accessible contrast for section self-link icon", async () => {
    const doc = await makePluginDoc(["/src/core/style.js"]);
    const style = doc.getElementById("respec-mainstyle");
    expect(style.textContent).toMatch(/opacity:\s*0\.8;/);
  });

  it("colors the h4-h6 self-link icon from the surrounding text, not --heading-text", async () => {
    // The icon is a ::before on the LINK, so `currentColor` follows the link's
    // inherited text color and never consults the heading. Under W3C's
    // stylesheets those coincide, which is why this can look like "matches its
    // heading" — it isn't. --heading-text is set to a color nothing inherits so
    // the two paths stay distinguishable.
    const doc = await makePluginDoc(["/src/core/style.js"], {
      body: `
        <input type="radio" name="color-scheme" value="dark" checked />
        <div style="color: rgb(1, 2, 3); --heading-text: rgb(9, 9, 9)">
          <h2 id="two">Two</h2><a class="self-link" href="#two"></a>
          <h3 id="three">Three</h3><a class="self-link" href="#three"></a>
          <h4 id="four">Four</h4><a class="self-link" href="#four"></a>
          <h5 id="five">Five</h5><a class="self-link" href="#five"></a>
          <h6 id="six">Six</h6><a class="self-link" href="#six"></a>
        </div>`,
      style: "display: block", // see makePluginDoc's `style` param
    });
    const win = doc.defaultView;

    const darkToggle = doc.querySelector("input[name='color-scheme']");
    expect(darkToggle).toBeTruthy();

    const link = id => doc.querySelector(`a[href="#${id}"]`);
    const iconColor = id => win.getComputedStyle(link(id), "::before").color;
    // The link is `color: inherit`, so its own computed color IS the
    // surrounding text color.
    const linkColor = id => win.getComputedStyle(link(id)).color;

    const expectRightSources = () => {
      for (const id of ["two", "three"]) {
        expect(iconColor(id)).toBe("rgb(9, 9, 9)");
      }
      for (const id of ["four", "five", "six"]) {
        expect(iconColor(id)).toBe(linkColor(id));
      }
    };

    // Dark: the theme toggle above is checked.
    expectRightSources();

    // Light: guards the regression this replaced, an override that only applied
    // with the toggle set to dark.
    darkToggle.checked = false;
    expectRightSources();
  });

  it("does not underline the section self-link", async () => {
    // A decoration declared on the anchor is painted across its ::before no
    // matter what the pseudo-element declares, so it has to be off here.
    const doc = await makePluginDoc(["/src/core/style.js"], {
      body: `<div><h2 id="two">Two</h2><a class="self-link" href="#two"></a></div>`,
      style: "display: block", // see makePluginDoc's `style` param
    });
    const link = doc.querySelector("a.self-link");
    expect(link).toBeTruthy();
    expect(doc.defaultView.getComputedStyle(link).textDecorationLine).toBe(
      "none"
    );
  });
});
