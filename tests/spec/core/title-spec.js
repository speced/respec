"use strict";

import {
  flushIframes,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Title", () => {
  afterAll(flushIframes);

  it("uses id='document-title' when another element already uses id='title'", async () => {
    const body = `
      <span id="title">not the title</span>
      <h1>My Spec Title</h1>
      ${makeDefaultBody()}
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    // The h1 should fall back to id="document-title"
    const h1 = doc.querySelector("h1.title");
    expect(h1).toBeTruthy();
    expect(h1.id).toBe("document-title");

    // The original id="title" element should still exist
    const original = doc.getElementById("title");
    expect(original).toBeTruthy();
    expect(original.localName).toBe("span");

    // An error should have been shown
    const errors = doc.respec.errors.filter(
      err => err.plugin === "core/title"
    );
    expect(errors).toHaveSize(1);
    expect(errors[0].message).toContain('id="title"');
  });

  it("uses id='title' normally when there is no collision", async () => {
    const body = `
      <h1 id="title">My Spec Title</h1>
      ${makeDefaultBody()}
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const h1 = doc.querySelector("h1#title");
    expect(h1).toBeTruthy();
    expect(h1.id).toBe("title");

    const errors = doc.respec.errors.filter(
      err => err.plugin === "core/title"
    );
    expect(errors).toHaveSize(0);
  });
});
