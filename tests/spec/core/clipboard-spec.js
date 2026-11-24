"use strict";

import {
  flushIframes,
  getExportedDoc,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core - Clipboard", () => {
  afterAll(flushIframes);

  const idlBody = `
    <section>
      <pre class="idl">
        [Exposed=Window]
        interface Foo {};
      </pre>
    </section>
  `;
  const cddlBody = `
    <section>
      <pre class="cddl">
        attire = "bow tie" / "necktie"
      </pre>
    </section>
  `;

  /** @param {Element} button */
  function layoutOf(button) {
    const { display, position, top, left, width, height } =
      button.ownerDocument.defaultView.getComputedStyle(button);
    return { display, position, top, left, width, height };
  }

  describe("in an exported document", () => {
    it("keeps the WebIDL and CDDL copy buttons, laid out as in the live document", async () => {
      const blocks = ["pre.idl", "pre.cddl"];
      const rsDoc = await makeRSDoc(
        makeStandardOps(null, idlBody + cddlBody),
        undefined,
        "width: 800px; height: 600px"
      );
      const buttonsIn = (doc, block) =>
        doc.querySelectorAll(`${block} .respec-button-copy-paste`);
      const liveLayouts = blocks.map(block => {
        expect(buttonsIn(rsDoc, block))
          .withContext(`${block} in the live document`)
          .toHaveSize(1);
        return layoutOf(buttonsIn(rsDoc, block)[0]);
      });
      expect(liveLayouts[0].position).toBe("absolute");

      const doc = await getExportedDoc(rsDoc);

      blocks.forEach((block, index) => {
        expect(buttonsIn(doc, block))
          .withContext(`${block} in the exported document`)
          .toHaveSize(1);
        expect(layoutOf(buttonsIn(doc, block)[0]))
          .withContext(`${block} layout`)
          .toEqual(liveLayouts[index]);
      });
    });

    it("copies the IDL without its header", async () => {
      const doc = await getExportedDoc(
        await makeRSDoc(makeStandardOps(null, idlBody))
      );
      const copied = [];
      Object.defineProperty(doc.defaultView.navigator, "clipboard", {
        value: { writeText: text => copied.push(text) && Promise.resolve() },
        configurable: true,
      });
      const pre = doc.querySelector("pre.idl");
      const headerText = pre.querySelector(".idlHeader").textContent;
      expect(headerText).not.toBe("");
      const button = pre.querySelector(".respec-button-copy-paste");
      expect(button).withContext("exported document").not.toBeNull();

      button.click();

      expect(copied).toEqual([pre.textContent.slice(headerText.length)]);
      expect(copied[0]).toContain("interface Foo");
    });
  });

  describe("copy acknowledgement", () => {
    const twoIdlBody = `
      <section>
        <pre class="idl">
          [Exposed=Window]
          interface Foo {};
        </pre>
        <pre class="idl">
          [Exposed=Window]
          interface Bar {};
        </pre>
      </section>
    `;
    const roomyFrame = "width: 800px; height: 600px";

    /**
     * Makes the clipboard take the text, or refuse it.
     * @param {Window} win
     * @returns {string[]} what the clipboard took
     */
    function stubClipboard(win, { refuse = false } = {}) {
      const copied = [];
      Object.defineProperty(win.navigator, "clipboard", {
        value: {
          writeText: text => {
            if (refuse) return Promise.reject(new Error("refused"));
            copied.push(text);
            return Promise.resolve();
          },
        },
        configurable: true,
      });
      return copied;
    }

    /**
     * Holds the page's timers, so a test decides when an acknowledgement ends.
     * @param {Window} win
     */
    function holdTimers(win) {
      const timers = [];
      win.setTimeout = (callback, ms) => timers.push({ callback, ms });
      win.clearTimeout = id => {
        if (timers[id - 1]) timers[id - 1].canceled = true;
      };
      return {
        timers,
        expire(index) {
          if (!timers[index].canceled) timers[index].callback();
        },
      };
    }

    /** @param {HTMLElement} button */
    async function copyFrom(button) {
      button.click();
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    /**
     * Turns the bubble's transition off, so the bubble rests at its end state
     * at once and a test never waits for the fade.
     * @param {HTMLElement} button
     */
    function skipFade(button) {
      const style = button.ownerDocument.createElement("style");
      style.textContent =
        ".respec-button-copy-paste::after { transition: none !important; }";
      button.ownerDocument.head.append(style);
    }

    const documents = [
      ["live document", rsDoc => rsDoc],
      ["exported document", rsDoc => getExportedDoc(rsDoc)],
    ];
    for (const [label, open] of documents) {
      describe(`in the ${label}`, () => {
        let doc;
        let buttons;
        let copied;
        let clock;

        beforeEach(async () => {
          const rsDoc = await makeRSDoc(
            makeStandardOps(null, twoIdlBody),
            undefined,
            roomyFrame
          );
          doc = await open(rsDoc);
          copied = stubClipboard(doc.defaultView);
          clock = holdTimers(doc.defaultView);
          buttons = [
            ...doc.querySelectorAll("pre.idl .respec-button-copy-paste"),
          ];
          if (buttons.length !== 2) {
            throw new Error(
              `${label}: expected 2 copy buttons, found ${buttons.length}`
            );
          }
        });

        it("copies once and shows the check and the bubble, then hides them after the timer and the fade", async () => {
          const [button] = buttons;
          const view = doc.defaultView;
          const copyIcon = button.querySelector("svg:not(.respec-copy-check)");
          const checkIcon = button.querySelector(".respec-copy-check");

          await copyFrom(button);

          expect(copied).toHaveSize(1);
          expect(button.dataset.copyState).toBe("copied");
          expect(view.getComputedStyle(checkIcon).visibility).toBe("visible");
          expect(view.getComputedStyle(copyIcon).visibility).toBe("hidden");
          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "visible"
          );
          expect(view.getComputedStyle(button, "::after").opacity).toBe("1");
          expect(button.dataset.label).toBe("Copied!");

          expect(clock.timers).toHaveSize(1);
          clock.expire(0);

          expect(button.dataset.copyState).toBeUndefined();
          expect(view.getComputedStyle(checkIcon).visibility).toBe("hidden");
          expect(view.getComputedStyle(copyIcon).visibility).toBe("visible");

          skipFade(button);

          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "hidden"
          );
        });

        it("shows the bubble at once, then fades it out when the timer ends", async () => {
          const [button] = buttons;
          const view = doc.defaultView;

          await copyFrom(button);

          expect(button.getAnimations({ subtree: true })).toHaveSize(0);
          expect(view.getComputedStyle(button, "::after").opacity).toBe("1");

          clock.expire(0);

          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "visible"
          );
          const animations = button.getAnimations({ subtree: true });
          expect(animations.length).toBeGreaterThan(0);

          skipFade(button);

          expect(view.getComputedStyle(button, "::after").opacity).toBe("0");
          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "hidden"
          );
        });

        it("restarts the confirmation when the button is copied again", async () => {
          const [button] = buttons;

          await copyFrom(button);
          await copyFrom(button);

          expect(clock.timers).toHaveSize(2);

          clock.expire(0);
          expect(button.dataset.copyState)
            .withContext("confirmation active after first timer ends")
            .toBe("copied");

          clock.expire(1);
          expect(button.dataset.copyState).toBeUndefined();
        });
        it("announces the copy with ariaNotify where the browser has it", async () => {
          const announced = [];
          buttons[0].ariaNotify = message => announced.push(message);
          await copyFrom(buttons[0]);
          expect(announced).toEqual(["Copied!"]);
        });

        it("does not announce the copy in the live region when ariaNotify is used", async () => {
          buttons[0].ariaNotify = () => {};
          await copyFrom(buttons[0]);
          const region = doc.getElementById("respec-copy-status");
          expect(region.textContent).toBe("");
        });

        it("announces the copy in a live region where it does not, again on a repeat copy", async () => {
          buttons[0].ariaNotify = undefined;
          await copyFrom(buttons[0]);
          const region = doc.getElementById("respec-copy-status");
          expect(region.getAttribute("role")).toBe("status");
          expect(region.textContent.replaceAll("\u200B", "")).toBe("Copied!");

          const firstAnnouncement = region.textContent;
          await copyFrom(buttons[0]);

          // A live region ignores an unchanged string, so the text must differ.
          expect(region.textContent).not.toBe(firstAnnouncement);
          expect(region.textContent.replaceAll("\u200B", "")).toBe("Copied!");
        });

        it("acknowledges a refused copy with the failure text and hides it after the timer and the fade", async () => {
          stubClipboard(doc.defaultView, { refuse: true });
          const unhandled = [];
          doc.defaultView.addEventListener("unhandledrejection", event =>
            unhandled.push(event.reason)
          );
          const warn = spyOn(doc.defaultView.console, "warn");
          const announced = [];
          buttons[0].ariaNotify = message => announced.push(message);

          const [button] = buttons;
          const view = doc.defaultView;
          const copyIcon = button.querySelector("svg:not(.respec-copy-check)");
          const checkIcon = button.querySelector(".respec-copy-check");

          await copyFrom(button);

          expect(button.dataset.copyState).toBe("failed");
          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "visible"
          );
          expect(button.dataset.label).toBe("Could not copy!");
          expect(view.getComputedStyle(checkIcon).visibility).toBe("hidden");
          expect(view.getComputedStyle(copyIcon).visibility).toBe("visible");
          expect(announced).toEqual(["Could not copy!"]);
          expect(clock.timers).toHaveSize(1);
          expect(warn).toHaveBeenCalledTimes(1);
          // The browser reports an unhandled rejection in a later task.
          await new Promise(resolve => setTimeout(resolve, 50));
          expect(unhandled).toEqual([]);

          clock.expire(0);

          expect(button.dataset.copyState).toBeUndefined();
          expect(button.dataset.label).toBe("Could not copy!");

          skipFade(button);

          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "hidden"
          );
        });

        it("gives the bubble a 1px border", async () => {
          await copyFrom(buttons[0]);
          expect(
            doc.defaultView.getComputedStyle(buttons[0], "::after")
              .borderTopWidth
          ).toBe("1px");
        });

        it("replaces a failure report when a later copy succeeds", async () => {
          stubClipboard(doc.defaultView, { refuse: true });
          const [button] = buttons;
          const view = doc.defaultView;

          button.ariaNotify = undefined;
          await copyFrom(button);

          stubClipboard(view);
          await copyFrom(button);

          expect(clock.timers[0].canceled).toBeTrue();
          clock.expire(0);

          expect(button.dataset.copyState).toBe("copied");
          expect(button.dataset.label).toBe("Copied!");
        });
        it("replaces a copied report when a later copy is refused", async () => {
          const [button] = buttons;
          const view = doc.defaultView;
          button.ariaNotify = undefined;
          spyOn(view.console, "warn");

          await copyFrom(button);
          stubClipboard(view, { refuse: true });
          await copyFrom(button);

          expect(clock.timers[0].canceled).toBeTrue();
          expect(button.dataset.copyState).toBe("failed");
          expect(button.dataset.label).toBe("Could not copy!");

          clock.expire(1);

          expect(button.dataset.copyState).toBeUndefined();
        });

        it("ignores a pending write that finishes after a newer one", async () => {
          const promises = [];
          Object.defineProperty(doc.defaultView.navigator, "clipboard", {
            value: {
              writeText: () => {
                let resolve;
                let reject;
                const promise = new Promise((res, rej) => {
                  resolve = res;
                  reject = rej;
                });
                promises.push({ resolve, reject });
                return promise;
              },
            },
            configurable: true,
          });

          const [button] = buttons;
          const announced = [];
          button.ariaNotify = message => announced.push(message);

          await copyFrom(button);
          await copyFrom(button);

          expect(promises).toHaveSize(2);

          promises[1].resolve();
          await new Promise(resolve => setTimeout(resolve, 0));

          spyOn(doc.defaultView.console, "warn");
          promises[0].reject(new Error("stale refusal"));
          await new Promise(resolve => setTimeout(resolve, 0));

          expect(button.dataset.copyState).toBe("copied");
          expect(announced).toEqual(["Copied!"]);
        });

        it("ignores a pending write that succeeds after a newer one fails", async () => {
          const promises = [];
          Object.defineProperty(doc.defaultView.navigator, "clipboard", {
            value: {
              writeText: () => {
                let resolve;
                let reject;
                const promise = new Promise((res, rej) => {
                  resolve = res;
                  reject = rej;
                });
                promises.push({ resolve, reject });
                return promise;
              },
            },
            configurable: true,
          });

          const [button] = buttons;
          const announced = [];
          button.ariaNotify = message => announced.push(message);

          await copyFrom(button);
          await copyFrom(button);

          expect(promises).toHaveSize(2);

          spyOn(doc.defaultView.console, "warn");
          promises[1].reject(new Error("newer refusal"));
          await new Promise(resolve => setTimeout(resolve, 0));

          promises[0].resolve();
          await new Promise(resolve => setTimeout(resolve, 0));

          expect(button.dataset.copyState).toBe("failed");
          expect(announced).toEqual(["Could not copy!"]);
        });

        it("ends each button's confirmation on its own timer", async () => {
          const [first, second] = buttons;
          first.ariaNotify = undefined;

          await copyFrom(first);
          await copyFrom(second);
          const status = doc.getElementById("respec-copy-status");

          clock.expire(0);
          expect(first.dataset.copyState).toBeUndefined();
          expect(second.dataset.copyState)
            .withContext("second confirmation still active")
            .toBe("copied");

          clock.expire(1);
          expect(second.dataset.copyState).toBeUndefined();
          expect(status.textContent).toBe("");
        });

        it("the shared live region keeps a second button's announcement when the first button's timer ends", async () => {
          const [first, second] = buttons;
          first.ariaNotify = undefined;
          second.ariaNotify = undefined;

          await copyFrom(first);
          await copyFrom(second);
          const status = doc.getElementById("respec-copy-status");

          clock.expire(0);
          expect(status.textContent.replaceAll("\u200B", "")).toBe("Copied!");
          expect(second.dataset.copyState).toBe("copied");

          clock.expire(1);
          expect(status.textContent).toBe("");
        });
      });
    }

    it("removes a confirmation in progress from a saved document", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      stubClipboard(rsDoc.defaultView);
      holdTimers(rsDoc.defaultView);
      const button = rsDoc.querySelector("pre.idl .respec-button-copy-paste");

      await copyFrom(button);
      expect(button.dataset.copyState)
        .withContext("confirmation started")
        .toBe("copied");

      const html = await rsDoc.respec.toHTML();
      const saved = new DOMParser().parseFromString(html, "text/html");

      const savedButton = saved.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(savedButton.dataset.copyState).toBeUndefined();
      expect(savedButton.hasAttribute("data-label")).toBeFalse();
    });

    it("a saved document opened with scripts blocked keeps its copy buttons hidden", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const html = await rsDoc.respec.toHTML();

      const frame = document.createElement("iframe");
      frame.sandbox = "allow-same-origin";
      const loaded = new Promise(resolve => {
        frame.addEventListener("load", () => resolve(frame.contentDocument));
      });
      frame.srcdoc = html;
      document.body.appendChild(frame);
      const doc = await loaded;

      const button = doc.querySelector("pre.idl .respec-button-copy-paste");
      expect(doc.defaultView.getComputedStyle(button).display).toBe("none");

      frame.remove();
    });

    it("keeps the buttons hidden in a snapshot of the live page when scripts are blocked", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const html = rsDoc.documentElement.outerHTML;

      const frame = document.createElement("iframe");
      frame.sandbox = "allow-same-origin";
      const loaded = new Promise(resolve => {
        frame.addEventListener("load", () => resolve(frame.contentDocument));
      });
      frame.srcdoc = html;
      document.body.appendChild(frame);
      const doc = await loaded;

      const button = doc.querySelector("pre.idl .respec-button-copy-paste");
      expect(doc.defaultView.getComputedStyle(button).display).toBe("none");

      frame.remove();
    });

    it("a page saved by the browser during a confirmation is cleaned when it is opened again", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const doc = await getExportedDoc(rsDoc);

      const button = doc.querySelector("pre.idl .respec-button-copy-paste");
      button.setAttribute("data-copy-state", "copied");
      const status = doc.getElementById("respec-copy-status");
      status.textContent = "Copied!";

      const markup = doc.documentElement.outerHTML;

      const frame = document.createElement("iframe");
      const loaded = new Promise(resolve => {
        frame.addEventListener("load", () => resolve(frame.contentDocument));
      });
      frame.srcdoc = markup;
      document.body.appendChild(frame);
      const frameDoc = await loaded;

      const newButton = frameDoc.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(newButton.dataset.copyState).toBeUndefined();
      const newStatus = frameDoc.getElementById("respec-copy-status");
      expect(newStatus.textContent).toBe("");

      frame.remove();
    });

    it("removes a failure report in progress from a saved document", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      stubClipboard(rsDoc.defaultView, { refuse: true });
      holdTimers(rsDoc.defaultView);
      const button = rsDoc.querySelector("pre.idl .respec-button-copy-paste");

      await copyFrom(button);
      expect(button.dataset.copyState)
        .withContext("failure reported")
        .toBe("failed");

      const html = await rsDoc.respec.toHTML();
      const saved = new DOMParser().parseFromString(html, "text/html");

      const savedButton = saved.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(savedButton.dataset.copyState).toBeUndefined();
    });

    it("does not duplicate the live region when a browser-saved page is opened again", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const doc = await getExportedDoc(rsDoc);
      const markup = doc.documentElement.outerHTML;

      const frame = document.createElement("iframe");
      const loaded = new Promise(resolve => {
        frame.addEventListener("load", () => resolve(frame.contentDocument));
      });
      frame.srcdoc = markup;
      document.body.appendChild(frame);
      const frameDoc = await loaded;

      const regions = frameDoc.querySelectorAll("#respec-copy-status");
      expect(regions.length).toBe(1);

      frame.remove();
    });

    it("copies the text even when a container stops event propagation", async () => {
      const body = `
        <section>
          <div id="author-div">
            <pre class="idl">
              [Exposed=Window]
              interface Foo {};
            </pre>
          </div>
        </section>
      `;
      const rsDoc = await makeRSDoc(makeStandardOps(null, body));
      const copied = stubClipboard(rsDoc.defaultView);
      const div = rsDoc.getElementById("author-div");
      div.addEventListener("click", event => event.stopPropagation());
      const button = div.querySelector(".respec-button-copy-paste");

      await copyFrom(button);

      expect(copied).toHaveSize(1);
    });

    it("styles the bubble from the data-label attribute", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const rules = Array.from(rsDoc.querySelectorAll("style"))
        .filter(style => style.sheet)
        .flatMap(style => Array.from(style.sheet.cssRules));
      const copyRule = rules.find(
        rule => rule.selectorText === ".respec-button-copy-paste::after"
      );
      expect(copyRule).toBeDefined();
      expect(copyRule.cssText).toContain("attr(data-label)");
    });

    it("anchors the bubble to its button and gives it fallback places on a wide page only", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const styles = Array.from(rsDoc.querySelectorAll("style")).filter(
        style => style.sheet
      );
      let widePageRule;
      for (const style of styles) {
        widePageRule = Array.from(style.sheet.cssRules).find(
          rule =>
            rule.conditionText && rule.conditionText.includes("min-width: 30em")
        );
        if (widePageRule) {
          break;
        }
      }
      const supportsRule = Array.from(widePageRule.cssRules).find(
        rule =>
          rule.conditionText && rule.conditionText.includes("position-area")
      );
      const rules = Array.from(supportsRule.cssRules);
      const buttonRule = rules.find(
        rule => rule.selectorText === ".respec-button-copy-paste"
      );
      const afterRule = rules.find(
        rule => rule.selectorText === ".respec-button-copy-paste::after"
      );
      expect(supportsRule.conditionText).toContain("anchor-scope");
      expect(buttonRule.cssText).toContain("anchor-name: --respec-copy");
      expect(buttonRule.cssText).toContain("anchor-scope: --respec-copy");
      expect(afterRule.cssText).toContain("position-anchor: --respec-copy");
      expect(afterRule.cssText).toContain("position: fixed");
      expect(afterRule.cssText).toContain("position-try-fallbacks");
      expect(afterRule.cssText).toContain("inline-start");
      expect(afterRule.cssText).toContain("block-end span-inline-end");
      expect(afterRule.cssText).toContain("block-end span-inline-start");
    });

    it("scopes the shared anchor name to each button, in a saved copy too", async () => {
      const rsDoc = await makeRSDoc(
        makeStandardOps(null, idlBody + idlBody + cddlBody)
      );
      const exportedDoc = await getExportedDoc(rsDoc);
      for (const doc of [rsDoc, exportedDoc]) {
        expect(doc.querySelectorAll(".respec-button-copy-paste").length).toBe(
          3
        );
        const css = Array.from(doc.querySelectorAll("style"))
          .map(style => style.textContent)
          .join("")
          .replace(/\s/g, "");
        expect(css).toContain("anchor-scope:--respec-copy");
      }
    });

    it("shares one pair of icon symbols between all copy buttons", async () => {
      const rsDoc = await makeRSDoc(
        makeStandardOps(null, idlBody + idlBody + cddlBody)
      );
      const sprites = rsDoc.querySelectorAll(".respec-copy-sprite");
      expect(sprites.length).toBe(1);
      const sprite = sprites[0];
      expect(sprite.querySelector("#respec-copy-icon")).not.toBeNull();
      expect(sprite.querySelector("#respec-copy-check")).not.toBeNull();
      const buttons = Array.from(
        rsDoc.querySelectorAll(".respec-button-copy-paste")
      );
      expect(buttons.length).toBe(3);
      for (const button of buttons) {
        const uses = button.querySelectorAll("use");
        expect(uses.length).toBe(2);
        expect(uses[0].getAttribute("href")).toBe("#respec-copy-icon");
        expect(uses[1].getAttribute("href")).toBe("#respec-copy-check");
        expect(button.querySelector("path")).toBeNull();
      }
      const exportedDoc = await getExportedDoc(rsDoc);
      const exportedSprites = exportedDoc.querySelectorAll(
        ".respec-copy-sprite"
      );
      expect(exportedSprites.length).toBe(1);
      expect(
        exportedSprites[0].querySelector("#respec-copy-icon")
      ).not.toBeNull();
      expect(
        exportedSprites[0].querySelector("#respec-copy-check")
      ).not.toBeNull();
    });

    it("adds no copy script, style or icons to a page without copy buttons", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, makeDefaultBody()));
      expect(rsDoc.querySelector(".respec-copy-sprite")).toBeNull();
      expect(rsDoc.getElementById("respec-copy-paste")).toBeNull();
      expect(rsDoc.getElementById("respec-copy-status")).toBeNull();
      const styles = Array.from(rsDoc.querySelectorAll("style"));
      for (const style of styles) {
        expect(style.textContent).not.toContain(".respec-button-copy-paste");
      }
    });

    it("runs one copy script in the saved page", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const exportedDoc = await getExportedDoc(rsDoc);
      const scripts = exportedDoc.querySelectorAll("#respec-copy-paste");
      expect(scripts.length).toBe(1);
      const script = scripts[0];
      expect(script.localName).toBe("script");
      expect(script.textContent).toContain("respec-copy-status");
    });

    it("sets the bubble text direction from the text itself", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const styles = Array.from(rsDoc.querySelectorAll("style")).filter(
        style => style.sheet
      );
      let targetRule;
      for (const style of styles) {
        const rules = Array.from(style.sheet.cssRules);
        targetRule = rules.find(
          rule => rule.selectorText === ".respec-button-copy-paste::after"
        );
        if (targetRule) {
          break;
        }
      }
      expect(targetRule.style.unicodeBidi).toBe("plaintext");
    });

    it("drops the bubble under the button on a narrow page where anchoring is missing", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const styles = Array.from(rsDoc.querySelectorAll("style")).filter(
        style => style.sheet
      );
      let targetRule;
      for (const style of styles) {
        const mediaRules = Array.from(style.sheet.cssRules).filter(
          rule =>
            rule.conditionText && rule.conditionText.includes("max-width: 30em")
        );
        for (const mediaRule of mediaRules) {
          const rule = Array.from(mediaRule.cssRules).find(
            r => r.selectorText === ".respec-button-copy-paste::after"
          );
          if (rule) {
            targetRule = rule;
            break;
          }
        }
        if (targetRule) break;
      }
      expect(targetRule).toBeDefined();
      expect(targetRule.style.top).toBe("100%");
      expect(targetRule.style.translate).toBe("none");
      expect(["0", "0px"]).toContain(targetRule.style.insetInlineStart);
    });

    it("shows the buttons everywhere except print", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      let targetRule = null;
      for (const sheet of rsDoc.adoptedStyleSheets) {
        for (const rule of sheet.cssRules) {
          if (
            rule instanceof rsDoc.defaultView.CSSMediaRule &&
            rule.conditionText.includes("not print")
          ) {
            for (const subRule of rule.cssRules) {
              if (
                subRule instanceof rsDoc.defaultView.CSSStyleRule &&
                subRule.selectorText.includes(".respec-button-copy-paste")
              ) {
                targetRule = subRule;
                break;
              }
            }
          }
          if (targetRule) break;
        }
        if (targetRule) break;
      }
      expect(targetRule).not.toBeNull();
      expect(targetRule.style.display).toBe("grid");
    });

    it("keeps the buttons hidden if the start-up script throws an error", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const html = await rsDoc.respec.toHTML();
      const throwScript = `<script>
        Document.prototype.querySelectorAll = () => {
          throw new Error("start-up failed");
        };
      </script>`;

      const frame = document.createElement("iframe");
      const loaded = new Promise(resolve => {
        frame.addEventListener("load", () => resolve(frame.contentDocument));
      });
      frame.srcdoc = html.replace("<head>", `<head>${throwScript}`);
      document.body.appendChild(frame);
      const doc = await loaded;

      expect(doc.adoptedStyleSheets).toHaveSize(0);
      const button = doc.querySelector("pre.idl .respec-button-copy-paste");
      expect(doc.defaultView.getComputedStyle(button).display).toBe("none");

      frame.remove();
    });

    it("starts on a page that has a form named respec", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const html = await rsDoc.respec.toHTML();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const form = parsed.createElement("form");
      form.name = "respec";
      parsed.body.insertBefore(form, parsed.body.firstChild);
      const srcdoc = `<!DOCTYPE html>\n${parsed.documentElement.outerHTML}`;

      const frame = document.createElement("iframe");
      const loaded = new Promise(resolve => {
        frame.addEventListener("load", () => resolve(frame.contentDocument));
      });
      frame.srcdoc = srcdoc;
      document.body.appendChild(frame);
      const doc = await loaded;

      expect(doc.adoptedStyleSheets).toHaveSize(1);
      const button = doc.querySelector("pre.idl .respec-button-copy-paste");
      expect(doc.defaultView.getComputedStyle(button).display).toBe("grid");

      frame.remove();
    });

    it("falls back to a style element in a browser without adopted style sheets", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const html = await rsDoc.respec.toHTML();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const script = parsed.createElement("script");
      script.textContent =
        'Object.defineProperty(window, "CSSStyleSheet", { value: undefined, configurable: true });';
      parsed.head.insertBefore(script, parsed.head.firstChild);
      const srcdoc = `<!DOCTYPE html>\n${parsed.documentElement.outerHTML}`;

      const frame = document.createElement("iframe");
      const loaded = new Promise(resolve => {
        frame.addEventListener("load", () => resolve(frame.contentDocument));
      });
      frame.srcdoc = srcdoc;
      document.body.appendChild(frame);
      const doc = await loaded;

      const styles = doc.querySelectorAll("style.removeOnSave");
      expect(styles).toHaveSize(1);
      expect(styles[0].textContent).toBe("");
      expect(styles[0].sheet.cssRules[0].cssText).toContain(
        ".respec-button-copy-paste"
      );
      const button = doc.querySelector("pre.idl .respec-button-copy-paste");
      expect(doc.defaultView.getComputedStyle(button).display).toBe("grid");

      const frame2 = document.createElement("iframe");
      frame2.sandbox = "allow-same-origin";
      const loaded2 = new Promise(resolve => {
        frame2.addEventListener("load", () => resolve(frame2.contentDocument));
      });
      frame2.srcdoc = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
      document.body.appendChild(frame2);
      const doc2 = await loaded2;

      const button2 = doc2.querySelector("pre.idl .respec-button-copy-paste");
      expect(doc2.defaultView.getComputedStyle(button2).display).toBe("none");

      frame.remove();
      frame2.remove();
    });

    it("cleans a saved confirmation on a button parsed after the script", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const html = await rsDoc.respec.toHTML();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const script = parsed.getElementById("respec-copy-paste");
      parsed.body.insertBefore(script, parsed.body.firstChild);
      const button = parsed.querySelector("pre.idl .respec-button-copy-paste");
      button.setAttribute("data-copy-state", "copied");
      button.setAttribute("data-label", "Copied!");
      const srcdoc = `<!DOCTYPE html>\n${parsed.documentElement.outerHTML}`;

      const frame = document.createElement("iframe");
      const loaded = new Promise(resolve => {
        frame.addEventListener("load", () => resolve(frame.contentDocument));
      });
      frame.srcdoc = srcdoc;
      document.body.appendChild(frame);
      const doc = await loaded;

      const cleanButton = doc.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(cleanButton.dataset.copyState).toBeUndefined();
      expect(cleanButton.hasAttribute("data-label")).toBeFalse();

      frame.remove();
    });

    it("does not submit a form that holds the code block", async () => {
      const body = `
        <section>
          <form id="author-form">
            <pre class="idl">
              [Exposed=Window]
              interface Foo {};
            </pre>
          </form>
        </section>
      `;
      const rsDoc = await makeRSDoc(makeStandardOps(null, body));
      stubClipboard(rsDoc.defaultView);
      const form = rsDoc.getElementById("author-form");
      const button = form.querySelector(".respec-button-copy-paste");
      expect(button).not.toBeNull();
      let submitted = false;
      form.addEventListener("submit", event => {
        submitted = true;
        event.preventDefault();
      });

      await copyFrom(button);

      expect(submitted).toBeFalse();
    });

    describe("where the page has no clipboard API", () => {
      const extraFrames = [];
      afterAll(() => extraFrames.forEach(frame => frame.remove()));

      /** Opens the saved document in a page whose navigator has no clipboard. */
      async function openWithoutClipboard(rsDoc) {
        const html = await rsDoc.respec.toHTML();
        const removeClipboard = `<script>Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });</script>`;
        expect(html).toContain("<head>");
        return new Promise(resolve => {
          const frame = document.createElement("iframe");
          frame.addEventListener("load", () => resolve(frame.contentDocument));
          frame.srcdoc = html.replace("<head>", `<head>${removeClipboard}`);
          document.body.appendChild(frame);
          extraFrames.push(frame);
        });
      }

      it("hides the copy button, and warns when a click gets through anyway", async () => {
        const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
        const doc = await openWithoutClipboard(rsDoc);
        expect(doc.defaultView.navigator.clipboard).toBeUndefined();
        const button = doc.querySelector("pre.idl .respec-button-copy-paste");
        expect(doc.defaultView.getComputedStyle(button).display).toBe("none");
        const warn = spyOn(doc.defaultView.console, "warn");

        await copyFrom(button);

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.calls.mostRecent().args[0]).toContain("https");
      });
    });

    it("localizes the default title and the copied label to the document's language", async () => {
      const rsDoc = await makeRSDoc({
        config: makeBasicConfig(),
        htmlAttrs: { lang: "fr" },
        body: `${makeDefaultBody()}${cddlBody}`,
      });
      const button = rsDoc.querySelector("pre.cddl .respec-button-copy-paste");
      expect(button).not.toBeNull();
      expect(button.dataset.copiedLabel).toBe("Copié !");
      expect(button.dataset.failedLabel).toBe("Impossible de copier !");
      expect(button.title).toBe("Copier dans le presse-papiers");
      expect(button.getAttribute("aria-label")).toBe(button.title);
    });
  });
});
