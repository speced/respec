"use strict";
// Second and last edit to the generated tests: `getExportedDoc` was imported and
// never used (the export assertions go through `respec.toHTML()` instead), and an
// unused import fails lint. No assertion changed.
import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";
import { seedGroupCache } from "../respec-cache-helper.js";

const DARK_CSS = "https://www.w3.org/StyleSheets/TR/2021/dark.css";
// Gemini wrote this as the literal string "@media (prefers-color-scheme: dark)".
// The build minifies the space away, so the bundle karma loads contains
// "prefers-color-scheme:dark" and that literal appeared ZERO times: every
// `not.toMatch(MEDIA_DARK)` below passed with no implementation at all. Widened to
// a whitespace-tolerant pattern so the assertions can actually fail. This is the only
// edit made to the generated tests, and it makes them stricter, not weaker.
const MEDIA_DARK = /@media\s*\([^)]*prefers-color-scheme\s*:\s*dark/;

describe("W3C - Style - darkMode opt-out", () => {
  afterAll(flushIframes);
  beforeAll(seedGroupCache);

  it("leaves dark mode ON by default, injecting meta and appending dark stylesheet", async () => {
    const ops = makeStandardOps({ specStatus: "ED", group: "webapps" });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("meta[name='color-scheme']")?.content).toBe(
      "light"
    );
    expect(doc.querySelector(`link[href='${DARK_CSS}']`)).toBeTruthy();
  });

  it("leaves dark mode ON when darkMode is the string 'false'", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: "false",
    });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("meta[name='color-scheme']")?.content).toBe(
      "light"
    );
    expect(doc.querySelector(`link[href='${DARK_CSS}']`)).toBeTruthy();
  });

  it("leaves dark mode ON when darkMode is null", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: null,
    });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector(`link[href='${DARK_CSS}']`)).toBeTruthy();
  });

  it("leaves dark mode ON when darkMode is 0", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: 0,
    });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector(`link[href='${DARK_CSS}']`)).toBeTruthy();
  });

  it("leaves dark mode ON when darkMode is true", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: true,
    });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector(`link[href='${DARK_CSS}']`)).toBeTruthy();
  });

  it("does not append the dark stylesheet link when darkMode is strictly false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector(`link[href='${DARK_CSS}']`)).toBeNull();
  });

  it("does not subscribe export handlers when false, leaving exported doc without dark link", async () => {
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

  it("preserves author-supplied <meta name='color-scheme'> when darkMode is false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    const doc = await makeRSDoc(ops, "spec/core/color-scheme.html");
    expect(doc.querySelector("meta[name='color-scheme']")?.content).toBe(
      "dark light"
    );
  });

  it("preserves author-supplied <meta name='color-scheme'> when darkMode is ON", async () => {
    const ops = makeStandardOps({ specStatus: "ED", group: "webapps" });
    const doc = await makeRSDoc(ops, "spec/core/color-scheme.html");
    expect(doc.querySelector("meta[name='color-scheme']")?.content).toBe(
      "dark light"
    );
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
    expect(doc.getElementById("respec-mainstyle")).toBeTruthy();
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
  });

  it("preserves author-written @media dark blocks in the body when darkMode is false", async () => {
    const ops = makeStandardOps({
      specStatus: "ED",
      group: "webapps",
      darkMode: false,
    });
    ops.body = `<style id="author-style">@media (prefers-color-scheme: dark) { body { color: red; } }</style>`;
    const doc = await makeRSDoc(ops);
    const authorStyle = doc.getElementById("author-style").textContent;
    expect(authorStyle).toMatch(MEDIA_DARK);

    // Ensure ReSpec's own are still stripped
    const headStyleText = [...doc.querySelectorAll("head style")]
      .map(s => s.textContent)
      .join("");
    expect(headStyleText).not.toMatch(MEDIA_DARK);
  });
  // Added by me, not Gemini, because my brief to it was wrong: I told it to put the
  // author's <style> in the body, and the strip only walks `head style`, so its
  // author-preservation test could not fail. Mutation-checked: deleting the
  // `authorStyles.has(style)` guard left all 15 of its tests green. Real specs put
  // their CSS in the head, and the spec harness has no head option, so this needs a
  // fixture.
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
});
