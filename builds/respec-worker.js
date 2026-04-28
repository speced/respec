// ReSpec Worker v1.0.0
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
      const { langScript, propName, lang } = data;
      try {
        if (!langScript) {
          throw new Error(`No script content provided for language "${lang}"`);
        }
        // importScripts() from blob workers is blocked for cross-origin URLs
        // (blob worker origin is "null"). Create a same-origin blob URL from
        // the pre-fetched script content to load the language safely.
        const blob = new Blob([langScript], { type: "application/javascript" });
        const objectURL = URL.createObjectURL(blob);
        try {
          importScripts(objectURL);
        } finally {
          URL.revokeObjectURL(objectURL);
        }
        self.hljs.registerLanguage(lang, self[propName]);
      } catch (err) {
        console.error("Failed to load or register language", lang, err);
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
