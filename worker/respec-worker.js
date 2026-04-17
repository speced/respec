// ReSpec Worker v1.1.0
"use strict";
// hljs is either inlined by core/worker.js (preferred) or loaded below via
// importScripts as a fallback when the inline fetch was not possible.
if (typeof self.hljs === "undefined" && self.RESPEC_HIGHLIGHT_URL) {
  try {
    importScripts(self.RESPEC_HIGHLIGHT_URL);
  } catch (err) {
    console.error("Network error loading highlighter", err);
  }
}

self.addEventListener("message", ({ data: originalData }) => {
  const data = Object.assign({}, originalData);
  if (data.action === "highlight") {
    const { code } = data;
    const langs = data.languages.length ? data.languages : undefined;
    try {
      const { value, language } = self.hljs.highlightAuto(code, langs);
      Object.assign(data, { value, language });
    } catch (err) {
      console.error("Could not transform some code?", err);
      Object.assign(data, { value: code, language: "" });
    }
  }
  self.postMessage(data);
});
