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
      getComputedStyle(button);
    return { display, position, top, left, width, height };
  }

  describe("in an exported document", () => {
    it("keeps the WebIDL and CDDL copy buttons, laid out as in the live document", async () => {
      const blocks = ["pre.idl", "pre.cddl"];
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody + cddlBody));
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

        it("copies once and shows the check and the bubble, then hides them when the timer ends", async () => {
          const [button] = buttons;
          const view = doc.defaultView;
          const copyIcon = button.querySelector("svg:not(.respec-copy-check)");
          const checkIcon = button.querySelector(".respec-copy-check");

          await copyFrom(button);

          expect(copied).toHaveSize(1);
          expect(button.hasAttribute("data-copied")).toBeTrue();
          expect(view.getComputedStyle(checkIcon).visibility).toBe("visible");
          expect(view.getComputedStyle(copyIcon).visibility).toBe("hidden");
          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "visible"
          );
          expect(view.getComputedStyle(button, "::after").content).toContain(
            "Copied"
          );

          expect(clock.timers).toHaveSize(1);
          clock.expire(0);

          expect(button.hasAttribute("data-copied")).toBeFalse();
          expect(view.getComputedStyle(checkIcon).visibility).toBe("hidden");
          expect(view.getComputedStyle(copyIcon).visibility).toBe("visible");

          await Promise.all(
            button.getAnimations({ subtree: true }).map(a => a.finished)
          );

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

          await Promise.all(animations.map(a => a.finished));

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
          expect(button.hasAttribute("data-copied"))
            .withContext("confirmation active after first timer ends")
            .toBeTrue();

          clock.expire(1);
          expect(button.hasAttribute("data-copied")).toBeFalse();
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

        it("acknowledges a refused copy with the failure text and hides it when the timer ends", async () => {
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

          expect(button.hasAttribute("data-copied")).toBeFalse();
          expect(button.hasAttribute("data-failed")).toBeTrue();
          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "visible"
          );
          expect(view.getComputedStyle(button, "::after").content).toContain(
            "Could not copy"
          );
          expect(view.getComputedStyle(checkIcon).visibility).toBe("hidden");
          expect(view.getComputedStyle(copyIcon).visibility).toBe("visible");
          expect(announced).toEqual(["Could not copy!"]);
          expect(clock.timers).toHaveSize(1);
          expect(warn).toHaveBeenCalledTimes(1);
          expect(unhandled).toEqual([]);

          clock.expire(0);

          expect(button.hasAttribute("data-failed")).toBeFalse();
          expect(view.getComputedStyle(button, "::after").content).toContain(
            "Could not copy"
          );
          expect(
            view.getComputedStyle(button, "::after").content
          ).not.toContain("Copied");

          await Promise.all(
            button.getAnimations({ subtree: true }).map(a => a.finished)
          );

          expect(view.getComputedStyle(button, "::after").visibility).toBe(
            "hidden"
          );
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

          expect(button.hasAttribute("data-failed")).toBeFalse();
          expect(button.hasAttribute("data-copied")).toBeTrue();
          expect(
            view.getComputedStyle(button, "::after").content
          ).not.toContain("Could not copy");
          expect(view.getComputedStyle(button, "::after").content).toContain(
            "Copied"
          );
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

          expect(button.hasAttribute("data-copied")).toBeTrue();
          expect(button.hasAttribute("data-failed")).toBeFalse();
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

          expect(button.hasAttribute("data-copied")).toBeFalse();
          expect(button.hasAttribute("data-failed")).toBeTrue();
          expect(announced).toEqual(["Could not copy!"]);
        });

        it("ends each button's confirmation on its own timer", async () => {
          const [first, second] = buttons;
          first.ariaNotify = undefined;

          await copyFrom(first);
          await copyFrom(second);
          const status = doc.getElementById("respec-copy-status");

          clock.expire(0);
          expect(first.hasAttribute("data-copied")).toBeFalse();
          expect(second.hasAttribute("data-copied"))
            .withContext("second confirmation still active")
            .toBeTrue();

          clock.expire(1);
          expect(second.hasAttribute("data-copied")).toBeFalse();
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
          expect(second.hasAttribute("data-copied")).toBeTrue();

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
      expect(button.hasAttribute("data-copied"))
        .withContext("confirmation started")
        .toBeTrue();

      const html = await rsDoc.respec.toHTML();
      const saved = new DOMParser().parseFromString(html, "text/html");

      const savedButton = saved.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(savedButton.hasAttribute("data-copied")).toBeFalse();
      expect(savedButton.hasAttribute("data-failed")).toBeFalse();
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
      button.setAttribute("data-copied", "123");
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
      expect(newButton.hasAttribute("data-copied")).toBeFalse();
      expect(newButton.hasAttribute("data-failed")).toBeFalse();
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
      expect(button.hasAttribute("data-failed"))
        .withContext("failure reported")
        .toBeTrue();

      const html = await rsDoc.respec.toHTML();
      const saved = new DOMParser().parseFromString(html, "text/html");

      const savedButton = saved.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(savedButton.hasAttribute("data-failed")).toBeFalse();
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

    it("moves the bubble under the button on a narrow page", async () => {
      const rsDocNarrow = await makeRSDoc(
        makeStandardOps(null, idlBody),
        undefined,
        "width: 320px; height: 600px"
      );
      const buttonNarrow = rsDocNarrow.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(
        rsDocNarrow.defaultView.getComputedStyle(buttonNarrow, "::after")
          .translate
      ).toBe("none");

      const rsDocWide = await makeRSDoc(
        makeStandardOps(null, idlBody),
        undefined,
        "width: 800px; height: 600px"
      );
      const buttonWide = rsDocWide.querySelector(
        "pre.idl .respec-button-copy-paste"
      );
      expect(
        rsDocWide.defaultView.getComputedStyle(buttonWide, "::after").translate
      ).not.toBe("none");
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

    it("cleans a saved confirmation on a button parsed after the script", async () => {
      const rsDoc = await makeRSDoc(makeStandardOps(null, idlBody));
      const html = await rsDoc.respec.toHTML();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const script = parsed.getElementById("respec-copy-paste");
      parsed.body.insertBefore(script, parsed.body.firstChild);
      const button = parsed.querySelector("pre.idl .respec-button-copy-paste");
      button.setAttribute("data-copied", "1");
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
      expect(cleanButton.hasAttribute("data-copied")).toBeFalse();
      expect(cleanButton.hasAttribute("data-failed")).toBeFalse();
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
