// ReSpec Worker v0.1.0
"use strict";
importScripts("https://www.w3.org/Tools/respec/respec-highlight.js");

hljs.configure({
  tabReplace: "  ", // 2 spaces
  languages: [
    "abnf",
    "css",
    "http",
    "javascript",
    "json",
    "markdown",
    "xml",
  ],
});

self.addEventListener("message", function(e) {
  switch (e.data.action) {
    case "highlight":
      const code = e.data.code;
      const langs = e.data.languages.length ? e.data.languages : undefined;
      const result = self.hljs.highlightAuto(code, langs);
      const data = Object.assign({
        value: result.value,
        language: result.language
      }, e.data);
      try {
        self.postMessage(data);
      } catch (err) {
        console.error("Could not transform some code?", err);
        // Post back the original unhighlighted code.
        const fallbackData = Object.assign({}, e.data, { value: e.data.code });
        self.postMessage(fallbackData);
      }
  }
});
