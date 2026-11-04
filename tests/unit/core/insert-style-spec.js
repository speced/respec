"use strict";

import { disableDarkStyles, insertStyle } from "/src/core/insert-style.js";

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

// `disableDarkStyles()` flips a realm-wide flag that nothing resets, so `beforeAll` does it
// once for this whole block rather than a spec doing it and leaking into the others. Keep dark
// CSS out of every spec outside this block.
describe("Core - dark styles removed", () => {
  /** @type {HTMLStyleElement} */
  let insertedBefore;
  /** @type {HTMLStyleElement[]} */
  const added = [];

  beforeAll(() => {
    insertedBefore = insertStyle(
      ".pre{color:red}@media (prefers-color-scheme: dark){.pre{color:#fff}}"
    );
    added.push(insertedBefore);
    disableDarkStyles();
  });

  afterAll(() => {
    for (const el of added) el.remove();
  });

  /** @param {string} css @returns {string} what landed in the document */
  function inserted(css) {
    const style = insertStyle(css);
    added.push(style);
    return style.textContent;
  }

  /** @param {string} css @returns {string[]} the condition of each surviving `@media` */
  function conditions(css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(inserted(css));
    return [...sheet.cssRules]
      .filter(r => r instanceof CSSMediaRule)
      .map(r => r.conditionText);
  }

  /** @param {string} css @returns {string[]} the selector of each surviving top-level rule */
  function selectors(css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(inserted(css));
    return [...sheet.cssRules]
      .filter(r => r instanceof CSSStyleRule)
      .map(r => r.selectorText);
  }

  it("rewrites stylesheets inserted before the option was read", () => {
    expect(insertedBefore.textContent).not.toContain("prefers-color-scheme");
    expect(insertedBefore.textContent).toContain(".pre");
  });

  it("leaves CSS with nothing to remove byte-identical", () => {
    const css = 'a[data-x="1"] > b::after{content:"&"}';
    expect(inserted(css)).toBe(css);
  });

  it("removes a dark block and keeps everything else", () => {
    const css =
      "a{color:red}@media (prefers-color-scheme: dark){b{color:#fff}}c{color:blue}";
    expect(conditions(css)).toEqual([]);
    expect(selectors(css)).toEqual(["a", "c"]);
  });

  it("leaves other media queries alone", () => {
    expect(conditions("@media print{body{color:black}}")).toEqual(["print"]);
    expect(
      conditions("@media (prefers-color-scheme: light){a{color:red}}")
    ).toEqual(["(prefers-color-scheme: light)"]);
  });

  it("handles minified CSS, where the whole sheet is one line", () => {
    expect(
      selectors(
        "a{color:red}@media(prefers-color-scheme:dark){b{color:#fff}}c{color:blue}"
      )
    ).toEqual(["a", "c"]);
  });

  it("removes a nested dark block whole, braces and all", () => {
    expect(
      inserted(
        "@media (prefers-color-scheme: dark){@supports (display:grid){a{color:red}}}"
      )
    ).toBe("");
  });

  it("removes every dark block, not just the first", () => {
    expect(
      conditions(
        "@media (prefers-color-scheme: dark){a{color:red}} @media (prefers-color-scheme: dark){b{color:blue}}"
      )
    ).toEqual([]);
  });

  it("removes a dark condition combined with others", () => {
    expect(
      conditions("@media screen and (prefers-color-scheme: dark){a{color:red}}")
    ).toEqual([]);
    expect(
      conditions("@media print,(prefers-color-scheme: dark){a{color:red}}")
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
    expect(
      selectors(
        "@media (prefers-color-scheme: dark){a::after{content:'}'}}c{color:blue}"
      )
    ).toEqual(["c"]);
  });

  it("keeps a rule whose declaration merely mentions a dark at-rule", () => {
    expect(
      selectors("body{content:'@media (prefers-color-scheme: dark) {}'}")
    ).toEqual(["body"]);
  });

  it("keeps a rule after a comment holding a dark opener", () => {
    expect(
      selectors("/* @media (prefers-color-scheme: dark) { */ body{color:red}")
    ).toEqual(["body"]);
  });
});
