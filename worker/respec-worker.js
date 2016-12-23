// ReSpec Worker v0.1.0
"use strict";
importScripts("/js/deps/highlight.js");

hljs.configure({
  tabReplace: "  ", // 2 spaces
  languages: [
   "css",
   "http",
   "javascript",
   "json",
   "markdown",
   "xml",
   "xquery",
  ],
});

self.addEventListener("message", function(e) {
  switch (e.data.action) {
    case "highlight":
      const code = e.data.code;
      const langs = e.data.languages.length ? e.data.languages : undefined;
      const result = self.hljs.highlightAuto(code, langs);
      const data = Object.assign({}, e.data, result);
      self.postMessage(data);
  }
});
