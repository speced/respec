"use strict";
import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";
import { seedGroupCache } from "../respec-cache-helper.js";

const DARK_CSS = "https://www.w3.org/StyleSheets/TR/2021/dark.css";
// Filter by `rel`, or the module's `rel="preload"` hint for the same URL satisfies the
// assertion on its own.
const DARK_SHEET = `link[rel~="stylesheet"][href='${DARK_CSS}']`;
// Whitespace-tolerant: karma loads the minified bundle, where the space in
// `(prefers-color-scheme: dark)` is gone.
const MEDIA_DARK = /@media\s*\([^)]*prefers-color-scheme\s*:\s*dark/;
// Assert on ReSpec's own sheet, not the joined total of `head style`. The strip skips the
// author `<style>` the harness leaves there, so a total stays non-empty regardless.
const respecStyleText = doc =>
  doc.getElementById("respec-mainstyle").textContent;
// Only a strict `=== false` turns dark mode off. `undefined` arrives as an absent key,
// because JSON.stringify drops it.
const DARK_MODE_STAYS_ON = [
  ["absent", undefined],
  ["the string 'false'", "false"],
  ["null", null],
  ["0", 0],
  ["true", true],
];

describe("W3C - Style - darkMode opt-out", () => {
  afterAll(flushIframes);
  beforeAll(seedGroupCache);

  for (const [label, darkMode] of DARK_MODE_STAYS_ON) {
    it(`leaves dark mode ON when darkMode is ${label}`, async () => {
      const ops = makeStandardOps({
        specStatus: "ED",
        group: "webapps",
        darkMode,
      });
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector("meta[name='color-scheme']")?.content).toBe(
        "light"
      );
      expect(doc.querySelector(DARK_SHEET)).toBeTruthy();
    });
  }

  it("removes both the dark stylesheet and its preload hint when darkMode is strictly false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    const doc = await makeRSDoc(ops);
    // Unfiltered by `rel` on purpose, so this also fails if the preload hint survives.
    expect(doc.querySelector(`link[href='${DARK_CSS}']`)).toBeNull();
  });

  it("omits the dark stylesheet from the exported doc when darkMode is false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    const doc = await makeRSDoc(ops);
    const exported = await doc.respec.toHTML();
    expect(exported).not.toContain(DARK_CSS);
  });

  it("includes the dark link in the exported doc when darkMode is ON", async () => {
    const ops = makeStandardOps({ specStatus: "ED", group: "webapps" });
    const doc = await makeRSDoc(ops);
    const exported = await doc.respec.toHTML();
    expect(exported).toContain(DARK_CSS);
  });

  it("does not inject <meta name='color-scheme'> when darkMode is strictly false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("meta[name='color-scheme']")).toBeNull();
  });

  it("keeps an author's color-scheme meta and still skips dark mode when darkMode is false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    const doc = await makeRSDoc(ops, "spec/core/color-scheme.html");
    expect(doc.querySelector("meta[name='color-scheme']")?.content).toBe(
      "dark light"
    );
    // The opt-out wins over the author's `dark` preference.
    expect(doc.querySelector(DARK_SHEET)).toBeNull();
  });

  it("reads dark from an author's color-scheme meta and enables the dark stylesheet", async () => {
    const ops = makeStandardOps({ specStatus: "ED", group: "webapps" });
    const doc = await makeRSDoc(ops, "spec/core/color-scheme.html");
    expect(doc.querySelector("meta[name='color-scheme']")?.content).toBe(
      "dark light"
    );
    // Assert on the export, not the live document: fixup.js sets `media = ""` on the
    // live link. These two attributes are the only trace that the module read the meta.
    const exported = await doc.respec.toHTML();
    const darkSheet = new DOMParser()
      .parseFromString(exported, "text/html")
      .querySelector(DARK_SHEET);
    expect(darkSheet.getAttribute("media")).toBe(
      "(prefers-color-scheme: dark)"
    );
    expect(darkSheet.hasAttribute("disabled")).toBe(false);
  });

  it("strips @media dark blocks from ReSpec's main styles when darkMode is false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    const doc = await makeRSDoc(ops);
    const headStyleText = [...doc.querySelectorAll("head style")]
      .map(s => s.textContent)
      .join("");
    expect(headStyleText).not.toMatch(MEDIA_DARK);
    expect(respecStyleText(doc).length).toBeGreaterThan(0);
  });

  it("strips @media dark blocks from triggered component styles when darkMode is false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    ops.body = `
      <ul><li class="assert"></li></ul>
      <pre class="cddl"></pre>
      <pre class="js"></pre>
    `;
    const doc = await makeRSDoc(ops);
    const headStyleText = [...doc.querySelectorAll("head style")]
      .map(s => s.textContent)
      .join("");
    expect(headStyleText).not.toMatch(MEDIA_DARK);
    expect(respecStyleText(doc).length).toBeGreaterThan(0);
  });

  it("strips @media dark blocks from config-triggered styles when darkMode is false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
      highlightVars: true,
    });
    const doc = await makeRSDoc(ops);
    const headStyleText = [...doc.querySelectorAll("head style")]
      .map(s => s.textContent)
      .join("");
    expect(headStyleText).not.toMatch(MEDIA_DARK);
    expect(respecStyleText(doc).length).toBeGreaterThan(0);
  });

  // Needs a fixture: the strip only walks `head style`, so a body `<style>` cannot fail,
  // and the harness offers no head option.
  it("leaves an author stylesheet in the head alone when darkMode is false", async () => {
    const ops = makeStandardOps({ darkMode: false });
    const doc = await makeRSDoc(ops, "spec/core/author-dark-style.html");
    const authorStyle = doc.getElementById("author-head-style");
    expect(authorStyle).toBeTruthy();
    expect(authorStyle.textContent).toMatch(MEDIA_DARK);
    expect(authorStyle.textContent).toContain("rebeccapurple");
    // ReSpec's own are still stripped in the same document.
    const respecStyles = [...doc.querySelectorAll("head style")]
      .filter(s => s.id !== "author-head-style")
      .map(s => s.textContent)
      .join("");
    expect(respecStyles).not.toMatch(MEDIA_DARK);
  });

  // Capturing author styles at import time strips the preProcess one; running the strip
  // on `end-all` strips the postProcess one.
  it("leaves author stylesheets added in preProcess and postProcess alone when darkMode is false", async () => {
    const ops = makeStandardOps();
    ops.config = null; // the fixture carries its own config, including the callbacks
    const doc = await makeRSDoc(ops, "spec/core/author-dark-style-late.html");
    const ids = ["author-preprocess-style", "author-postprocess-style"];
    // The third carries no id at all, which no allowlist could ever have covered.
    const authorStyles = [
      ...ids.map(id => doc.getElementById(id)),
      doc.querySelector("head style[data-author-no-id]"),
    ];
    for (const authorStyle of authorStyles) {
      expect(authorStyle).toBeTruthy();
      expect(authorStyle.textContent).toMatch(MEDIA_DARK);
      expect(authorStyle.textContent).toContain("rebeccapurple");
    }
    // ReSpec's own are still stripped in the same document.
    const respecStyles = [...doc.querySelectorAll("head style")]
      .filter(s => !authorStyles.includes(s))
      .map(s => s.textContent)
      .join("");
    expect(respecStyles).not.toMatch(MEDIA_DARK);
  });
});
