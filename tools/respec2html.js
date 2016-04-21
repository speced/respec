#!/usr/local/bin/node

/*jshint node: true, browser: false*/
"use strict";
const async = require("marcosc-async");
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
const optionDefinitions = [{
  alias: "h",
  defaultValue: false,
  description: "Display this usage guide.",
  name: "help",
  type: Boolean,
}, {
  alias: "s",
  defaultOption: true,
  description: "URL to ReSpec source file.",
  multiple: false,
  name: "src",
  type: String,
}, {
  alias: "o",
  defaultOption: false,
  description: "Path to output file. When omitted, just stdout.",
  multiple: false,
  name: "out",
  type: String,
}, {
  alias: "t",
  defaultValue: 10,
  name: "timeout",
  type: Number,
}, {
  alias: "e",
  default: false,
  description: "Report ReSpec errors on stderr.",
  name: "haltonerror",
  type: Boolean,
}, {
  alias: "w",
  default: false,
  description: "Report ReSpec warnings on stderr.",
  name: "haltonwarn",
  type: Boolean,
}];

const tasks = {
  showHelp() {
    const getUsage = require("command-line-usage");
    const appDetails = {
      title: "respec2html",
      description: "Converts a ReSpec source file to HTML and prints to std out.",
      footer: "Project home: [underline]{https://github.com/w3c/respec}"
    };
    console.log(getUsage(optionDefinitions, appDetails));
  },
};

async.task(function* run() {
  const cli = require("command-line-args")(optionDefinitions);
  let parsedArgs;
  try {
    parsedArgs = cli.parse();
  } catch (err) {
    console.error(err.stack);
    tasks.showHelp();
    process.exit(2);
  }
  if (parsedArgs.help || !parsedArgs.src) {
    tasks.showHelp();
    return;
  }
  const src = parsedArgs.src;
  const whenToHalt = {
    haltOnError: parsedArgs.haltonerror,
    haltOnWarn: parsedArgs.haltonwarn,
  };
  const timeout = parsedArgs.timeout;
  const out = parsedArgs.out;
  try {
    yield fetchAndWrite(src, out, whenToHalt, timeout);
  } catch (err) {
    console.error(colors.red(err.stack));
    return process.exit(1);
  }
  process.exit(0);
});
