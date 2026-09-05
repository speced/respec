"use strict";

import { insertStyle } from "/src/core/insert-style.js";

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
