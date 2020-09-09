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
});
