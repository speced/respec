/* eslint sort-imports: "off" */
import highlight from "highlight.js/lib/core";
import abnf from "highlight.js/lib/languages/abnf";
import bnf from "highlight.js/lib/languages/bnf";
import css from "highlight.js/lib/languages/css";
import ebnf from "highlight.js/lib/languages/ebnf";
import http from "highlight.js/lib/languages/http";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

highlight.configure({
  tabReplace: "  ", // 2 spaces
  languages: [
    "abnf",
    "bnf",
    "css",
    "ebnf",
    "http",
    "javascript",
    "json",
    "xml",
    "yaml",
  ],
});

highlight.registerLanguage("abnf", abnf);
highlight.registerLanguage("bnf", bnf);
highlight.registerLanguage("css", css);
highlight.registerLanguage("ebnf", ebnf);
highlight.registerLanguage("http", http);
highlight.registerLanguage("javascript", javascript);
highlight.registerLanguage("json", json);
highlight.registerLanguage("xml", xml);
highlight.registerLanguage("yaml", yaml);

export default highlight;
