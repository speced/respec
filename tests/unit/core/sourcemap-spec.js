"use strict";

import {
  getSourcemapLocation,
  getSourcemapOriginalText,
  tagOriginalSource,
} from "/src/core/sourcemap.js";

describe("Core - sourcemap", () => {
  describe("getSourcemapLocation", () => {
    it("prefers its own data-respec-line attribute", () => {
      const el = document.createElement("div");
      el.dataset.respecLine = "foo.html:5";
      el.append(document.createComment(" respec-sourcemap#foo.html:99 "));
      expect(getSourcemapLocation(el)).toBe("foo.html:5");
    });

    it("falls back to a leading comment marker", () => {
      const el = document.createElement("div");
      el.append(
        document.createComment(" respec-sourcemap#foo.html:10 "),
        document.createElement("span")
      );
      expect(getSourcemapLocation(el)).toBe("foo.html:10");
    });

    it("returns null when there is no marker anywhere nearby", () => {
      const el = document.createElement("div");
      expect(getSourcemapLocation(el)).toBeNull();
    });

    it("collapses same-file bounding comments to a path:start-end range", () => {
      const wrapper = document.createElement("div");
      const target = document.createElement("span");
      wrapper.append(
        document.createComment(" respec-sourcemap#foo.html:2 "),
        target,
        document.createComment(" respec-sourcemap#foo.html:4 ")
      );
      expect(getSourcemapLocation(target)).toBe("foo.html:2-4");
    });

    it("prefers the bound that didn't have to climb out of its own subtree", () => {
      const outer = document.createElement("div");
      const inner = document.createElement("div");
      const target = document.createElement("span");
      inner.append(
        document.createComment(" respec-sourcemap#a.html:1 "),
        target
      );
      outer.append(
        inner,
        document.createComment(" respec-sourcemap#b.html:9 ")
      );
      expect(getSourcemapLocation(target)).toBe("a.html:1");
    });

    it("uses whichever single bound exists when only one side has a marker", () => {
      const wrapper = document.createElement("div");
      const target = document.createElement("span");
      wrapper.append(
        document.createComment(" respec-sourcemap#foo.html:3 "),
        target
      );
      expect(getSourcemapLocation(target)).toBe("foo.html:3");
    });
  });

  describe("tagOriginalSource", () => {
    it("tags only the elements appended at or after fromIndex", () => {
      const df = document.createDocumentFragment();
      df.append("prefix text");
      const fromIndex = df.childNodes.length;
      const wrapper = document.createElement("code");
      const inner = document.createElement("a");
      wrapper.append(inner);
      df.append(wrapper, "suffix text");

      expect(() =>
        tagOriginalSource(df, fromIndex, "[= term =]")
      ).not.toThrow();
      expect(wrapper.getAttribute("data-respec-original")).toBe("[= term =]");
      expect(inner.getAttribute("data-respec-original")).toBe("[= term =]");
    });

    it("tags every top-level element of a multi-node match", () => {
      const df = document.createDocumentFragment();
      const cite = document.createElement("cite");
      const span = document.createElement("span");
      df.append(cite, span);

      tagOriginalSource(df, 0, "[[SPEC]]");
      expect(cite.getAttribute("data-respec-original")).toBe("[[SPEC]]");
      expect(span.getAttribute("data-respec-original")).toBe("[[SPEC]]");
    });
  });

  describe("getSourcemapOriginalText", () => {
    it("returns the stashed text", () => {
      const el = document.createElement("a");
      el.setAttribute("data-respec-original", "[= term =]");
      expect(getSourcemapOriginalText(el)).toBe("[= term =]");
    });

    it("returns null when nothing was stashed", () => {
      const el = document.createElement("a");
      expect(getSourcemapOriginalText(el)).toBeNull();
    });
  });

  describe("inSourcemapMode", () => {
    // Memoized per document, so each case runs in its own iframe rather than
    // risking cross-test contamination of the cached value.
    /** @param {boolean} hasAttrInitially */
    function checkInIframe(hasAttrInitially) {
      return new Promise(resolve => {
        const ifr = document.createElement("iframe");
        ifr.style.display = "none";
        ifr.addEventListener("load", () => {
          resolve(ifr.contentWindow.__respecTest);
          ifr.remove();
        });
        const attr = hasAttrInitially ? ' data-respec-line="init.html:1"' : "";
        ifr.srcdoc = `<!DOCTYPE html><html${attr}><head><script type="module">
          import { inSourcemapMode } from "/src/core/sourcemap.js";
          const first = inSourcemapMode();
          document.documentElement.setAttribute("data-respec-line", "later.html:1");
          const second = inSourcemapMode();
          window.__respecTest = { first, second };
        </script></head><body></body></html>`;
        document.body.appendChild(ifr);
      });
    }

    it("detects sourcemap mode from the root element's marker attribute", async () => {
      const { first } = await checkInIframe(true);
      expect(first).toBeTrue();
    });

    it("detects sourcemap mode being off", async () => {
      const { first } = await checkInIframe(false);
      expect(first).toBeFalse();
    });

    it("caches the result, ignoring later attribute changes", async () => {
      const { first, second } = await checkInIframe(false);
      expect(first).toBeFalse();
      expect(second).toBeFalse();
    });
  });
});
