"use strict";

describe("Core - UI", () => {
  afterAll(flushIframes);

  it("shows and hides the UI", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const ui = doc.defaultView.respecUI;
    const pillContainer = doc.getElementById("respec-ui");
    ui.show();
    // showing it doesn't change it from showing
    expect(pillContainer.hidden).toBe(false);
    ui.hide();
    expect(pillContainer.hidden).toBe(true);
    ui.show();
    expect(pillContainer.hidden).toBe(false);
  });

  it("hides the UI when document is clicked", async () => {
    const doc = await makeRSDoc(makeStandardOps(), null, "display: block");
    const menu = doc.getElementById("respec-menu");
    expect(window.getComputedStyle(menu).display).toEqual("none");
    doc.getElementById("respec-pill").click();
    // spin the event loop
    await new Promise(resolve => {
      setTimeout(() => {
        expect(window.getComputedStyle(menu).display).toEqual("block");
        doc.body.click();
        resolve();
      }, 500);
    });
    // Allow time to fade in
    await new Promise(resolve => {
      setTimeout(() => {
        expect(window.getComputedStyle(menu).display).toEqual("none");
        resolve();
      }, 500);
    });
    // give it time to fade out
  });

  describe("ui/dfn-list", () => {
    it("shows a list of definitions and links them", async () => {
      const body = "<p><dfn>bar()</dfn> <dfn>foo</dfn></p>";
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);

      // open list and wait for loading
      const dfnListButton = doc.getElementById("respec-button-definitions");
      dfnListButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));

      const dfns = doc.querySelectorAll("ul.respec-dfn-list li a");
      expect(dfns.length).toEqual(2);

      const [dfnBar, dfnFoo] = dfns;
      expect(dfnBar.textContent.trim()).toEqual("bar()");
      expect(dfnBar.getAttribute("href")).toEqual("#dfn-bar");
      expect(dfnFoo.textContent.trim()).toEqual("foo");
      expect(dfnFoo.getAttribute("href")).toEqual("#dfn-foo");
    });
  });
});
