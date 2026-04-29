// ReSpec Worker
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

self.addEventListener("message", ({ data }) => {
  switch (data.action) {
    case "highlight-load-lang": {
      const { langURL, langScript, propName, lang } = data;
      console.warn(
        `[ReSpec] The "highlight-load-lang" worker action is deprecated ` +
          `and will be removed in a future version. ` +
          `To migrate, fetch your language script in the main thread and ` +
          `send the text as "langScript" instead of "langURL". ` +
          `The "langURL" path may fail in Firefox. ` +
          `See https://github.com/speced/respec/issues/5228`
      );
      try {
        if (langScript) {
          const blob = new Blob([langScript], {
            type: "application/javascript",
          });
          const objectURL = URL.createObjectURL(blob);
          try {
            importScripts(objectURL);
          } finally {
            URL.revokeObjectURL(objectURL);
          }
        } else if (langURL) {
          const { protocol, hostname } = new URL(langURL);
          const isSecure =
            protocol === "https:" ||
            (protocol === "http:" &&
              (hostname === "localhost" ||
                hostname === "127.0.0.1" ||
                hostname === "[::1]"));
          if (!isSecure) {
            throw new Error(
              `langURL must be https: or http: on localhost, got "${langURL}"`
            );
          }
          importScripts(langURL);
        } else {
          throw new Error(
            `No langScript or langURL provided for language "${lang}"`
          );
        }
        if (typeof self[propName] === "function") {
          self.hljs.registerLanguage(lang, self[propName]);
        } else {
          throw new Error(
            `Language definer "${propName}" is not a function on self`
          );
        }
      } catch (err) {
        console.error("Failed to load or register language", lang, err);
      }
      delete data.langScript;
      delete data.langURL;
      break;
    }
    case "highlight": {
      const { code } = data;
      const langs = data.languages?.length ? data.languages : undefined;
      try {
        const { value, language } = self.hljs.highlightAuto(code, langs);
        Object.assign(data, { value, language });
      } catch (err) {
        console.error("Could not transform some code?", err);
        Object.assign(data, { value: code, language: "" });
      }
      break;
    }
  }
  self.postMessage(data);
});
