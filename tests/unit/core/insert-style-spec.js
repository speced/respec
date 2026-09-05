"use strict";

import {
  disableDarkStyles,
  insertStyle,
  stripDarkMediaBlocks,
} from "/src/core/insert-style.js";

describe("Core - insertStyle", () => {
  /** @type {Element[]} */
  let added;

  beforeEach(() => {
    added = [];
  });

  afterEach(() => {
    for (const el of added) el.remove();
  });

  /** @param {Parameters<typeof insertStyle>} args */
  function insert(...args) {
    const style = insertStyle(...args);
    added.push(style);
    return style;
  }

  it("appends to the head when given no anchor", () => {
    const style = insert("a{color:red}");
    expect(style.parentNode).toBe(document.head);
    expect(document.head.lastElementChild).toBe(style);
  });

  it("inserts ahead of an anchor in the head", () => {
    const anchor = document.createElement("meta");
    document.head.appendChild(anchor);
    added.push(anchor);
    const style = insert("a{color:red}", { before: anchor });
    expect(style.nextElementSibling).toBe(anchor);
    expect(style.parentNode).toBe(document.head);
  });

  it("appends to the head when the anchor is null", () => {
    const style = insert("a{color:red}", { before: null });
    expect(style.parentNode).toBe(document.head);
    expect(document.head.lastElementChild).toBe(style);
  });

  // Callers pass an unscoped `document.querySelector("link")`, which can return a node
  // outside the head.
  it("never inserts outside the head, whatever the anchor's parent is", () => {
    const stray = document.createElement("link");
    document.body.appendChild(stray);
    try {
      expect(() => insert("a{color:red}", { before: stray })).toThrowError();
      expect(document.body.querySelector("style")).toBeNull();
    } finally {
      stray.remove();
    }
  });

  it("sets the css as text, without escaping", () => {
    const css = 'a[data-x="1"] > b::after{content:"&"}';
    const style = insert(css);
    expect(style.textContent).toBe(css);
  });

  it("omits the class attribute when no className is given", () => {
    const style = insert("a{color:red}");
    expect(style.hasAttribute("class")).toBeFalse();
  });

  it("sets id and className when given", () => {
    const style = insert("a{color:red}", {
      id: "probe-id",
      className: "probe",
    });
    expect(style.id).toBe("probe-id");
    expect(style.className).toBe("probe");
  });
});

describe("Core - stripDarkMediaBlocks", () => {
  // Assert on the rules, not the text: the parser normalizes what it re-serializes, so a
  // string comparison here would be testing the serializer.

  /** @param {string} css @returns {string[]} the condition of each surviving `@media` */
  function conditions(css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(stripDarkMediaBlocks(css));
    return [...sheet.cssRules]
      .filter(r => r instanceof CSSMediaRule)
      .map(r => r.conditionText);
  }

  /** @param {string} css @returns {string[]} the selector of each surviving top-level rule */
  function selectors(css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(stripDarkMediaBlocks(css));
    return [...sheet.cssRules]
      .filter(r => r instanceof CSSStyleRule)
      .map(r => r.selectorText);
  }

  it("returns CSS with no dark block unchanged", () => {
    expect(stripDarkMediaBlocks("")).toBe("");
    expect(selectors("body { color: black; }")).toEqual(["body"]);
  });

  it("removes a dark block and keeps everything else", () => {
    const css =
      "a{color:red}@media (prefers-color-scheme: dark){b{color:#fff}}c{color:blue}";
    expect(conditions(css)).toEqual([]);
    expect(selectors(css)).toEqual(["a", "c"]);
  });

  it("leaves other media queries alone", () => {
    expect(conditions("@media print { body { color: black; } }")).toEqual([
      "print",
    ]);
    expect(
      conditions("@media (prefers-color-scheme: light) { a{color:red} }")
    ).toEqual(["(prefers-color-scheme: light)"]);
  });

  it("handles minified CSS, where the whole sheet is one line", () => {
    const css =
      "a{color:red}@media(prefers-color-scheme:dark){b{color:#fff}}c{color:blue}";
    expect(selectors(css)).toEqual(["a", "c"]);
  });

  it("removes a nested dark block whole, braces and all", () => {
    const css =
      "@media (prefers-color-scheme: dark) { @supports (display: grid) { a{color:red} } }";
    expect(stripDarkMediaBlocks(css)).toBe("");
  });

  it("removes every dark block, not just the first", () => {
    const css =
      "@media (prefers-color-scheme: dark){a{color:red}} @media (prefers-color-scheme: dark){b{color:blue}}";
    expect(conditions(css)).toEqual([]);
  });

  it("removes a dark condition combined with others", () => {
    expect(
      conditions(
        "@media screen and (prefers-color-scheme: dark) { a{color:red} }"
      )
    ).toEqual([]);
    expect(
      conditions("@media print, (prefers-color-scheme: dark) { a{color:red} }")
    ).toEqual([]);
  });

  it("keeps `not (prefers-color-scheme: dark)`, which forces a page light", () => {
    expect(
      conditions(
        "@media not (prefers-color-scheme: dark){body{background:#fff}}"
      )
    ).toEqual(["not (prefers-color-scheme: dark)"]);
  });

  it("keeps a rule holding a brace in a string", () => {
    const css =
      "@media (prefers-color-scheme: dark){a::after{content:'}'}}c{color:blue}";
    expect(selectors(css)).toEqual(["c"]);
  });

  it("keeps a rule whose declaration merely mentions a dark at-rule", () => {
    const css = "body { content: '@media (prefers-color-scheme: dark) {}'; }";
    expect(selectors(css)).toEqual(["body"]);
  });

  it("keeps a rule after a comment holding a dark opener", () => {
    const css = "/* @media (prefers-color-scheme: dark) { */ body{color:red}";
    expect(selectors(css)).toEqual(["body"]);
  });
});

// Keep dark CSS out of every other spec in this file, and keep this lifecycle in one spec:
// `disableDarkStyles()` sets a realm-wide flag that nothing resets, and jasmine randomizes
// order, so a second spec would find it already set.
describe("Core - disableDarkStyles", () => {
  it("strips dark rules from stylesheets already inserted, and from later ones", () => {
    const DARK = "@media (prefers-color-scheme: dark){.x{color:#fff}}";
    const existing = insertStyle(`.x{color:red}${DARK}`);
    expect(existing.textContent).toContain("prefers-color-scheme");

    disableDarkStyles();
    expect(existing.textContent).not.toContain("prefers-color-scheme");
    expect(existing.textContent).toContain(".x");

    const later = insertStyle(`.y{color:green}${DARK}`);
    expect(later.textContent).not.toContain("prefers-color-scheme");
    expect(later.textContent).toContain(".y");

    existing.remove();
    later.remove();
  });
});
