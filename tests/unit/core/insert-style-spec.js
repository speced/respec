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
  // outside the head. Inserting relative to the anchor rather than through `head` put
  // ReSpec's CSS in the body.
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
  it("returns CSS with no dark block unchanged", () => {
    expect(stripDarkMediaBlocks("")).toBe("");
    expect(stripDarkMediaBlocks("body { color: black; }")).toBe(
      "body { color: black; }"
    );
  });

  it("removes a dark block", () => {
    expect(
      stripDarkMediaBlocks(
        "@media (prefers-color-scheme: dark) { body { color: white; } }"
      )
    ).toBe("");
  });

  it("leaves other media queries alone", () => {
    const print = "@media print { body { color: black; } }";
    expect(stripDarkMediaBlocks(print)).toBe(print);
    const light = "@media (prefers-color-scheme: light) { a{} }";
    expect(stripDarkMediaBlocks(light)).toBe(light);
  });

  it("handles minified CSS, where the whole sheet is one line", () => {
    expect(
      stripDarkMediaBlocks(
        "a{}@media(prefers-color-scheme:dark){b{color:#fff;}}c{}"
      )
    ).toBe("a{}c{}");
  });

  it("counts nested braces rather than stopping at the first closer", () => {
    expect(
      stripDarkMediaBlocks(
        "@media (prefers-color-scheme: dark) { @supports (display: grid) { a{} } }"
      )
    ).toBe("");
  });

  it("removes every dark block, not just the first", () => {
    expect(
      stripDarkMediaBlocks(
        "@media (prefers-color-scheme: dark){a{}} @media (prefers-color-scheme: dark){b{}}"
      )
    ).toBe(" ");
  });

  it("matches a dark condition combined with others", () => {
    expect(
      stripDarkMediaBlocks(
        "@media screen and (prefers-color-scheme: dark) { a{} }"
      )
    ).toBe("");
    expect(
      stripDarkMediaBlocks("@media print, (prefers-color-scheme: dark) { a{} }")
    ).toBe("");
  });

  it("matches across newlines inside the condition", () => {
    expect(
      stripDarkMediaBlocks("@media\n(prefers-color-scheme:\ndark\n) { a{} }")
    ).toBe("");
  });

  it("leaves everything outside the block byte-identical", () => {
    expect(
      stripDarkMediaBlocks(
        "a{} \n@media (prefers-color-scheme: dark) { b{} }\n c{}"
      )
    ).toBe("a{} \n\n c{}");
  });

  // The two cases below pin a KNOWN limitation, not desired behaviour. Braces and at-rules
  // inside a CSS string confuse the scan. Acceptable because only ReSpec's own stylesheets
  // reach this function, and none of them contain one; `insertStyle` is what guarantees an
  // author's CSS never gets here. If a fix ever lands, these two should fail and be
  // rewritten to the correct expectation.
  it("known limitation: an at-rule inside a string is treated as real", () => {
    expect(
      stripDarkMediaBlocks(
        "body { content: '@media (prefers-color-scheme: dark) {}'; }"
      )
    ).toBe("body { content: ''; }");
  });

  it("known limitation: a closing brace inside a string ends the block early", () => {
    expect(
      stripDarkMediaBlocks(
        "@media (prefers-color-scheme: dark) { a::after { content: '}'; } }"
      )
    ).toBe(" }");
  });
});

describe("Core - stripDarkMediaBlocks, destructive input", () => {
  // Each of these once deleted valid CSS. They now leave the sheet alone, because the end of
  // an unbalanced block is unknown and guessing at it loses rules silently.
  it("leaves the sheet alone when a dark block never closes", () => {
    const css =
      "a { color: red; } @media (prefers-color-scheme: dark) { b { color: white; } c { color: blue; }";
    expect(stripDarkMediaBlocks(css)).toBe(css);
  });

  it("leaves the sheet alone when a comment holds the opener", () => {
    const css = "/* @media (prefers-color-scheme: dark) { */ body{color:red}";
    expect(stripDarkMediaBlocks(css)).toBe(css);
  });

  it("keeps `not (prefers-color-scheme: dark)`, which forces a page light", () => {
    const css =
      "@media not (prefers-color-scheme: dark){body{background:#fff}}";
    expect(stripDarkMediaBlocks(css)).toBe(css);
  });
});

// `disableDarkStyles` sets a module flag that lives for the whole realm and nothing resets it,
// and jasmine runs specs in random order, so the before and after states cannot be split into
// two specs: whichever ran second would find the flag already set. One spec walks the whole
// lifecycle instead. Keep dark CSS out of every other spec in this file for the same reason.
describe("Core - disableDarkStyles", () => {
  it("strips dark rules from stylesheets already inserted, and from later ones", () => {
    const DARK = "@media (prefers-color-scheme: dark){.x{color:#fff}}";
    const existing = insertStyle(`.x{color:red}${DARK}`);
    expect(existing.textContent).toContain("prefers-color-scheme");

    disableDarkStyles();
    expect(existing.textContent).toBe(".x{color:red}");

    const later = insertStyle(`.y{color:green}${DARK}`);
    expect(later.textContent).toBe(".y{color:green}");

    existing.remove();
    later.remove();
  });
});
