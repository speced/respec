// ReSpec Worker v0.1.1
"use strict";
try {
  importScripts("https://www.w3.org/Tools/respec/respec-highlight.js");
  hljs.configure({
    tabReplace: "  ", // 2 spaces
    languages: ["abnf", "css", "http", "javascript", "json", "markdown", "xml"],
  });
} catch (err) {
  console.error("Network error loading/configuring highlighter", err);
}

try {
  importScripts("https://www.w3.org/Tools/respec/webidl2.js");
} catch (err) {
  console.error("Network error loading WebIDL parser", err);
}

function hightlight(data) {
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
}

function parseIDL(data) {
  let error = null;
  let result = null;
  try {
    result = self.webidl2.parse(data.text, { ws: true });
  } catch (err) {
    error = err.message;
  }
  Object.assign(data, { result, error });
}

self.addEventListener("message", ({ data: originalData }) => {
  const data = Object.assign({}, originalData);
  switch (data.action) {
    case "highlight":
      hightlight(data);
      break;
    case "parse-idl":
      parseIDL(data);
      break;
  }
  self.postMessage(data);
});
