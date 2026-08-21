"use strict";

import { highlightHref } from "../../../src/core/worker.js";

describe("Core - worker highlight URL", () => {
  // In source-module mode (dev server, karma) import.meta.url resolves to
  // src/core/worker.js, where no highlighter sits. The built one is at
  // builds/respec-highlight.js. Getting this wrong is silent: the fetch 404s,
  // the worker falls back to importScripts() on the W3C CDN, and the suite
  // still passes while exercising the *published* highlighter rather than the
  // locally built one.
  it("resolves a highlighter that exists in this environment", async () => {
    const response = await fetch(highlightHref);
    expect(response.ok).withContext(`fetching ${highlightHref}`).toBeTrue();
  });

  it("does not fall back to the W3C CDN when running locally", () => {
    expect(new URL(highlightHref).origin).toBe(location.origin);
  });
});
