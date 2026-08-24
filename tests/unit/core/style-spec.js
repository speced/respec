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

  it("lets .self-link:hover win over the resting opacity", async () => {
    // :hover cannot be synthesised, so this asserts the thing that was actually
    // broken: the resting-opacity rule must not OUTWEIGH a selector of the same
    // specificity as .self-link:hover, which is (0, 2, 0). A bare
    // :not(#toc h2) contributed an ID, making it (1, 1, 3) and leaving the hover
    // rule's opacity: 1 dead.
    const doc = await makePluginDoc(["/src/core/style.js"], {
      head: `<meta charset="UTF-8" /><style>
        /* Same specificity as .self-link:hover */
        .self-link.hover-stand-in { opacity: 1; }
      </style>`,
      body: `<div><h2 id="two">Two</h2><a class="self-link hover-stand-in" href="#two"></a></div>`,
      style: "display: block", // see makePluginDoc's `style` param
    });
    const link = doc.querySelector("a.self-link");
    expect(link).toBeTruthy();
    expect(doc.defaultView.getComputedStyle(link).opacity).toBe("1");
  });

  it("keeps the heading offset rule beatable by ordinary author rules", async () => {
    // Same trap as above, in the rule that nudges a self-linked heading left:
    // four IDs inside :not() made it (1, 1, 3), so nothing an author could
    // reasonably write would override it. The stand-in below is (0, 2, 0), which
    // should win.
    const doc = await makePluginDoc(["/src/core/style.js"], {
      head: `<meta charset="UTF-8" /><style>
        .probe-a.probe-b { left: 0px; }
      </style>`,
      body: `<div><h2 id="two" class="probe-a probe-b">Two</h2><a class="self-link" href="#two"></a></div>`,
      style: "display: block", // see makePluginDoc's `style` param
    });
    const heading = doc.getElementById("two");
    expect(heading).toBeTruthy();
    expect(doc.defaultView.getComputedStyle(heading).left).toBe("0px");
  });
});
