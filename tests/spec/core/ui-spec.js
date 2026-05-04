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

  it("resets aria-expanded when menu is closed by outside click", async () => {
    const doc = await makeRSDoc(makeStandardOps(), null, "display: block");
    const pill = doc.getElementById("respec-pill");
    const menu = doc.getElementById("respec-menu");
    // Open the menu
    pill.click();
    await new Promise(resolve => setTimeout(resolve));
    expect(menu.hidden).toBe(false);
    expect(pill.getAttribute("aria-expanded")).toBe("true");
    // Click outside to close
    doc.body.click();
    await new Promise(resolve => setTimeout(resolve));
    expect(menu.hidden).toBe(true);
    expect(pill.getAttribute("aria-expanded")).toBe("false");
  });

  it("shows errors", async () => {
    const doc = await makeRSDoc(makeStandardOps({ group: "webapps" }));
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

  describe("keyboard navigation", () => {
    /**
     * @param {HTMLElement} target
     * @param {Document} doc
     * @param {string} key
     */
    function pressKey(target, doc, key) {
      target.dispatchEvent(
        new doc.defaultView.KeyboardEvent("keydown", {
          key,
          bubbles: true,
          cancelable: true,
        })
      );
    }

    it("moves focus down with ArrowDown and wraps around", async () => {
      const doc = await makeRSDoc(makeStandardOps(), null, "display: block");
      const ui = doc.defaultView.respecUI;
      const menu = doc.getElementById("respec-menu");
      const pill = doc.getElementById("respec-pill");
      ui.addCommand("Command A", () => {}, "", "A");
      ui.addCommand("Command B", () => {}, "", "B");
      ui.addCommand("Command C", () => {}, "", "C");
      // Open the menu
      pill.click();
      await new Promise(resolve => setTimeout(resolve));
      const buttons = [...menu.querySelectorAll("button:not([disabled])")];
      expect(buttons.length).toBeGreaterThanOrEqual(3);
      buttons[0].focus();
      expect(doc.activeElement).toBe(buttons[0]);

      pressKey(menu, doc, "ArrowDown");
      expect(doc.activeElement).toBe(buttons[1]);

      pressKey(menu, doc, "ArrowDown");
      expect(doc.activeElement).toBe(buttons[2]);

      // Wrap around
      pressKey(menu, doc, "ArrowDown");
      expect(doc.activeElement).toBe(buttons[3 % buttons.length]);
    });

    it("moves focus up with ArrowUp and wraps around", async () => {
      const doc = await makeRSDoc(makeStandardOps(), null, "display: block");
      const ui = doc.defaultView.respecUI;
      const menu = doc.getElementById("respec-menu");
      const pill = doc.getElementById("respec-pill");
      ui.addCommand("Command A", () => {}, "", "A");
      ui.addCommand("Command B", () => {}, "", "B");
      ui.addCommand("Command C", () => {}, "", "C");
      pill.click();
      await new Promise(resolve => setTimeout(resolve));
      const buttons = [...menu.querySelectorAll("button:not([disabled])")];
      buttons[0].focus();

      // ArrowUp from first wraps to last
      pressKey(menu, doc, "ArrowUp");
      expect(doc.activeElement).toBe(buttons[buttons.length - 1]);

      pressKey(menu, doc, "ArrowUp");
      expect(doc.activeElement).toBe(buttons[buttons.length - 2]);
    });

    it("moves focus to first item with Home", async () => {
      const doc = await makeRSDoc(makeStandardOps(), null, "display: block");
      const ui = doc.defaultView.respecUI;
      const menu = doc.getElementById("respec-menu");
      const pill = doc.getElementById("respec-pill");
      ui.addCommand("Command A", () => {}, "", "A");
      ui.addCommand("Command B", () => {}, "", "B");
      ui.addCommand("Command C", () => {}, "", "C");
      pill.click();
      await new Promise(resolve => setTimeout(resolve));
      const buttons = [...menu.querySelectorAll("button:not([disabled])")];
      buttons[2].focus();

      pressKey(menu, doc, "Home");
      expect(doc.activeElement).toBe(buttons[0]);
    });

    it("moves focus to last item with End", async () => {
      const doc = await makeRSDoc(makeStandardOps(), null, "display: block");
      const ui = doc.defaultView.respecUI;
      const menu = doc.getElementById("respec-menu");
      const pill = doc.getElementById("respec-pill");
      ui.addCommand("Command A", () => {}, "", "A");
      ui.addCommand("Command B", () => {}, "", "B");
      ui.addCommand("Command C", () => {}, "", "C");
      pill.click();
      await new Promise(resolve => setTimeout(resolve));
      const buttons = [...menu.querySelectorAll("button:not([disabled])")];
      buttons[0].focus();

      pressKey(menu, doc, "End");
      expect(doc.activeElement).toBe(buttons[buttons.length - 1]);
    });

    it("closes the menu and focuses the pill on Escape", async () => {
      const doc = await makeRSDoc(makeStandardOps(), null, "display: block");
      const ui = doc.defaultView.respecUI;
      const menu = doc.getElementById("respec-menu");
      const pill = doc.getElementById("respec-pill");
      ui.addCommand("Command A", () => {}, "", "A");
      pill.click();
      await new Promise(resolve => setTimeout(resolve));
      expect(menu.hidden).toBe(false);
      expect(pill.getAttribute("aria-expanded")).toBe("true");

      pressKey(menu, doc, "Escape");
      await new Promise(resolve => setTimeout(resolve));

      expect(menu.hidden).toBe(true);
      expect(pill.getAttribute("aria-expanded")).toBe("false");
      expect(doc.activeElement).toBe(pill);
    });
  });

  describe("modal aria-expanded", () => {
    it("resets aria-expanded on error pill when modal is closed via close button", async () => {
      const doc = await makeRSDoc(makeStandardOps());
      const ui = doc.defaultView.respecUI;
      ui.error("<p>test error</p>");
      const errorButton = doc.getElementById("respec-pill-error");
      expect(errorButton).toBeTruthy();

      // Open the error modal
      errorButton.click();
      await new Promise(resolve => setTimeout(resolve));
      expect(errorButton.getAttribute("aria-expanded")).toBe("true");

      // Close via the close button inside the modal
      const closeBtn = doc.querySelector(".close-button");
      expect(closeBtn).toBeTruthy();
      closeBtn.click();
      await new Promise(resolve => setTimeout(resolve));
      expect(errorButton.getAttribute("aria-expanded")).toBe("false");
    });

    it("resets aria-expanded on error pill when modal is closed via Escape", async () => {
      const doc = await makeRSDoc(makeStandardOps());
      const ui = doc.defaultView.respecUI;
      ui.error("<p>test error for escape</p>");
      const errorButton = doc.getElementById("respec-pill-error");
      expect(errorButton).toBeTruthy();

      // Open the error modal
      errorButton.click();
      await new Promise(resolve => setTimeout(resolve));
      expect(errorButton.getAttribute("aria-expanded")).toBe("true");

      // Close via Escape key on the document
      doc.dispatchEvent(
        new doc.defaultView.KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
          cancelable: true,
        })
      );
      await new Promise(resolve => setTimeout(resolve));
      expect(errorButton.getAttribute("aria-expanded")).toBe("false");
    });
  });
});
