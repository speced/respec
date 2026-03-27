// ReSpec Worker v1.0.0
"use strict";
try {
  // RESPEC_HIGHLIGHT_URL is injected by core/worker.js and resolves to the
  // highlight script co-located with the ReSpec bundle (enabling local loading
  // in test environments). Falls back to the canonical www.w3.org URL.
  importScripts(
    self.RESPEC_HIGHLIGHT_URL ||
      "https://www.w3.org/Tools/respec/respec-highlight"
  );
} catch (err) {
  console.error("Network error loading highlighter", err);
}

self.addEventListener("message", ({ data: originalData }) => {
  const data = Object.assign({}, originalData);
  switch (data.action) {
    case "highlight-load-lang": {
      const { langURL, propName, lang } = data;
      importScripts(langURL);
      self.hljs.registerLanguage(lang, self[propName]);
      break;
    }
    case "highlight": {
      const { code } = data;
      const langs = data.languages.length ? data.languages : undefined;
      try {
        const { value, language } = self.hljs.highlightAuto(code, langs);
        Object.assign(data, { value, language });
      } catch (err) {
        console.error("Could not transform some code?", err);
        // Post back the original code
        Object.assign(data, { value: code, language: "" });
      }
      break;
    }
  }
  self.postMessage(data);
});
