#!/usr/bin/env node

/*jshint node: true, browser: false*/
"use strict";
const { URL } = require("url");
const colors = require("colors");
const fetchAndWrite = require("./respecDocWriter").fetchAndWrite;
colors.setTheme({
  data: "grey",
  debug: "cyan",
  error: "red",
  help: "cyan",
  important: "red",
  info: "green",
  input: "grey",
  prompt: "grey",
  verbose: "cyan",
  warn: "yellow",
});

const commandLineArgs = require("command-line-args");
const getUsage = require("command-line-usage");
// Command line output
const optionList = [
  {
    alias: "h",
    defaultValue: false,
    description: "Display this usage guide.",
    name: "help",
    type: Boolean,
  },
  {
    alias: "s",
    defaultOption: true,
    description: "URL to ReSpec source file.",
    multiple: false,
    name: "src",
    type: String,
  },
  {
    alias: "o",
    defaultOption: false,
    description: "Path to output file. When omitted, just stdout.",
    multiple: false,
    name: "out",
    type: String,
  },
  {
    alias: "t",
    defaultValue: 10,
    description: "How long to wait before timing out (in seconds).",
    name: "timeout",
    type: Number,
  },
  {
    alias: "e",
    default: false,
    description: "Abort if the spec has any errors.",
    name: "haltonerror",
    type: Boolean,
  },
  {
    alias: "w",
    default: false,
    description: "Abort if ReSpec generates warnings.",
    name: "haltonwarn",
    type: Boolean,
  },
  {
    default: false,
    description: "Disable Chromium sandboxing if needed.",
    name: "disable-sandbox",
    type: Boolean,
  },
  {
    default: false,
    description: "Enable debugging and show Chrome's DevTools.",
    name: "debug",
    type: Boolean,
  },
];

const usageSections = [
  {
    header: "respec2html",
    content: "Converts a ReSpec source file to HTML and prints to std out.",
  },
  {
    header: "Options",
    optionList,
  },
  {
    header: "Examples",
    content: [
      {
        desc: "1. Output to a file. ",
        example:
          "$ ./respec2html.js --src http://example.com/spec.html --out spec.html",
      },
      {
        desc: "2. Halt on errors or warning ",
        example:
          "$ ./respec2html.js -e -w --src http://example.com/spec.html --out spec.html",
      },
    ],
  },
  {
    content: "Project home: {underline https://github.com/w3c/respec}",
    raw: true,
  },
];

(async function run() {
  let parsedArgs;
  try {
    parsedArgs = commandLineArgs(optionList);
  } catch (err) {
    console.info(getUsage(usageSections));
    console.error(colors.error(err.message));
    return process.exit(127);
  }
  if (!parsedArgs.src) {
    console.info(getUsage(usageSections));
    return process.exit(2);
  }
  if (parsedArgs.help) {
    console.info(getUsage(usageSections));
    return process.exit(0);
  }
  const src = new URL(parsedArgs.src, `file://${process.cwd()}/`).href;
  const whenToHalt = {
    haltOnError: parsedArgs.haltonerror,
    haltOnWarn: parsedArgs.haltonwarn,
  };
  const out = parsedArgs.out;
  try {
    await fetchAndWrite(src, out, whenToHalt, {
      timeout: parsedArgs.timeout * 1000,
      disableSandbox: parsedArgs["disable-sandbox"],
      debug: parsedArgs.debug,
    });
  } catch (err) {
    console.error(colors.error(err.stack));
    return process.exit(1);
  }
  process.exit(0);
})();
