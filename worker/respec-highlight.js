/* eslint sort-imports: "off" */
import highlight from "highlight.js/lib/core";
import abnf from "highlight.js/lib/languages/abnf";
import css from "highlight.js/lib/languages/css";
import http from "highlight.js/lib/languages/http";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";

highlight.configure({
  tabReplace: "  ", // 2 spaces
  languages: ["abnf", "css", "http", "javascript", "json", "xml"],
});

highlight.registerLanguage("abnf", abnf);
highlight.registerLanguage("css", css);
highlight.registerLanguage("http", http);
highlight.registerLanguage("javascript", javascript);
highlight.registerLanguage("json", json);
highlight.registerLanguage("xml", xml);

export default highlight;
