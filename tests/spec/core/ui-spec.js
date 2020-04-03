"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

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
    expect(window.getComputedStyle(menu).display).toBe("none");
    doc.getElementById("respec-pill").click();
    // spin the event loop
    await new Promise(resolve => setTimeout(resolve));
    expect(window.getComputedStyle(menu).display).toBe("block");
    doc.body.click();
    // spin the event loop
    await new Promise(resolve => setTimeout(resolve));
    expect(window.getComputedStyle(menu).display).toBe("none");
  });

  it("shows errors", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const ui = doc.defaultView.respecUI;

    expect(doc.getElementById("respec-pill-error")).toBeNull();

    ui.error("test 1");
    const button = doc.getElementById("respec-pill-error");

    expect(button).toBeTruthy();
    expect(button.textContent).toBe("1");
    expect(button.getAttribute("aria-label")).toBe("1 ReSpec Error");

    ui.error("test 2");
    expect(button.textContent).toBe("2");
    expect(button.getAttribute("aria-label")).toBe("2 ReSpec Errors");
  });

  it("shows warnings", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const ui = doc.defaultView.respecUI;

    expect(doc.getElementById("respec-pill-warning")).toBeNull();

    ui.warning("test 1");
    const button = doc.getElementById("respec-pill-warning");

    expect(button).toBeTruthy();
    expect(button.textContent).toBe("1");
    expect(button.getAttribute("aria-label")).toBe("1 ReSpec Warning");

    ui.warning("test 2");
    expect(button.textContent).toBe("2");
    expect(button.getAttribute("aria-label")).toBe("2 ReSpec Warnings");
  });

  describe("ui/dfn-list", () => {
    it("shows a list of definitions and links them", async () => {
      const body = "<p><dfn>bar()</dfn> <dfn>foo</dfn></p>";
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);

      // open list and wait for loading
      const dfnListButton = doc.getElementById("respec-button-definitions");
      dfnListButton.click();
      await new Promise(resolve => setTimeout(resolve));

      const dfns = doc.querySelectorAll("ul.respec-dfn-list li a");
      expect(dfns.length).toBe(2);

      const [dfnBar, dfnFoo] = dfns;
      expect(dfnBar.textContent.trim()).toBe("bar()");
      expect(dfnBar.getAttribute("href")).toBe("#dfn-bar");
      expect(dfnFoo.textContent.trim()).toBe("foo");
      expect(dfnFoo.getAttribute("href")).toBe("#dfn-foo");
    });
  });

  it("shows a list of definitions and labels definitions that are unused and/or exported", async () => {
    const body = `
      <p>
        <dfn>foo</dfn>
        <dfn data-export="">bar()</dfn>
        <dfn data-export="">foobar</dfn>
        <dfn>baz</dfn>
      </p>
      <p>References to <a>Foo</a> and <a>foobar</a>.</p>
    `;

    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    // open list and wait for it to load
    const dfnListButton = doc.getElementById("respec-button-definitions");
    dfnListButton.click();
    await new Promise(resolve => setTimeout(resolve));

    const dfns = doc.querySelectorAll("ul.respec-dfn-list li");
    expect(dfns.length).toBe(4);

    const [dfnBar, dfnBaz, dfnFoo, dfnFoobar] = dfns;

    expect(dfnBar.textContent).toContain("exported unused");

    expect(dfnBaz.textContent).toContain("unused");
    expect(dfnBaz.textContent).not.toContain("exported");

    expect(dfnFoo.textContent).not.toContain("unused");
    expect(dfnFoo.textContent).not.toContain("exported");

    expect(dfnFoobar.textContent).toContain("exported");
    expect(dfnFoobar.textContent).not.toContain("unused");
  });
});
