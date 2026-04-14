// @ts-check
// ReSpec Worker v1.0.0
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
  switch (data.action) {
    case "highlight-load-lang": {
      const { langURL, propName, lang } = data;
      try {
        const parsedURL = new URL(langURL, self.location.href);
        const isAllowedProtocol =
          parsedURL.protocol === "https:" || parsedURL.protocol === "http:";
        const isSameOrigin = parsedURL.origin === self.location.origin;
        const isJavaScriptFile = parsedURL.pathname.endsWith(".js");
        const isValidPropName = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(propName);

        if (!isAllowedProtocol || !isSameOrigin || !isJavaScriptFile || !isValidPropName) {
          throw new Error("Invalid language module request");
        }

        importScripts(parsedURL.href);

        if (typeof self[propName] !== "function") {
          throw new Error("Loaded language module did not expose a valid language definition");
        }

        self.hljs.registerLanguage(lang, self[propName]);
      } catch (err) {
        console.error("Invalid language load request", err);
      }
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
