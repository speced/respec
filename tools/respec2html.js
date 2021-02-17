#!/usr/bin/env node
"use strict";
const colors = require("colors");
const marked = require("marked");
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
const { toHTML, write } = require("./respecDocWriter");

const commandLineArgs = require("command-line-args");
const getUsage = require("command-line-usage");
// Command line output
/** @type {commandLineArgs.OptionDefinition[]} */
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
  {
    default: false,
    description: "Log processing status to stdout.",
    name: "verbose",
    type: Boolean,
  },
  {
    defaultValue: "pretty",
    description: "Format for errors and warnings.",
    name: "format",
    type: String,
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
  const out = parsedArgs.out;
  const logError = getFormatter(parsedArgs.format);

  try {
    const { html, errors, warnings } = await toHTML(src, {
      timeout: parsedArgs.timeout * 1000,
      onError: logError,
      onWarning: logError,
      disableSandbox: parsedArgs["disable-sandbox"],
      devtools: parsedArgs.debug,
      verbose: parsedArgs.verbose && out !== "stdout",
    });

    const exitOnError = errors.length && parsedArgs.haltonerror;
    const exitOnWarning = warnings.length && parsedArgs.haltonwarn;
    if (exitOnError || exitOnWarning) {
      throw new Error(
        `${exitOnError ? "Errors" : "Warnings"} found during processing.`
      );
    }

    await write(out, html);
  } catch (err) {
    console.error(colors.error(err.stack));
    return process.exit(1);
  }
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});

class Renderer extends marked.Renderer {
  strong(text) {
    return colors.bold(text);
  }
  em(text) {
    return colors.italic(text);
  }
  codespan(text) {
    return colors.underline(text);
  }
  paragraph(text) {
    return text;
  }
  link(href, _title, text) {
    return colors.blue(`[${text}](${colors.dim.underline(href)})`);
  }
}

/** @param {string} str */
function markdown(str) {
  return marked(str, { smartypants: true, renderer: new Renderer() });
}

/** @param {string} format */
function getFormatter(format) {
  const jsonFields = ["name", "message", "plugin", "elements", "hint"];

  switch (format) {
    case "pretty":
      return rsError => prettyPrintRespecError(rsError, true);
    case "pretty:short":
      return rsError => prettyPrintRespecError(rsError, false);
    case "json":
      return rsError => console.error(JSON.stringify(rsError, jsonFields, 2));
    case "json:short":
      return rsError => console.error(JSON.stringify(rsError, jsonFields));
    case "simple":
      colors.disable();
      return rsError => prettyPrintRespecError(rsError, false);
    default:
      throw new Error(`Unknown --format=${format}`);
  }
}

/**
 * @param {Record<string, string | string[]>} rsError
 * @param {boolean} detailed
 */
function prettyPrintRespecError(rsError, detailed) {
  /** @type {(title: string, value: string) => void} */
  const print = (title, value) => {
    if (!value || !detailed) return;
    console.error(colors.bold(`${title}:`.padStart(7)), markdown(value));
  };

  const isWarning = rsError.name === "ReSpecWarning";
  const header = isWarning
    ? colors.bgYellow.black.bold("[WARNING]")
    : colors.bgRed.white.bold("[ERROR]");
  const message = isWarning
    ? colors.yellow(markdown(rsError.message))
    : colors.red(markdown(rsError.message));

  console.group(header, message);
  print("Count", rsError.elements && String(rsError.elements.length));
  print("Plugin", rsError.plugin);
  print("Hint", rsError.hint);
  console.groupEnd();
}
