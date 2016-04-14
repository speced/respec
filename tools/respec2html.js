#!/usr/local/bin/node

/*jshint node: true, browser: false*/
"use strict";
const async = require("marcosc-async");
const colors = require("colors");
const os = require("os");
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
  writeTo(outPath, data) {
    const fsp = require("fs-promise");
    const path = require("path");
    return async.task(function* () {
      let newFilePath = "";
      if (path.isAbsolute(outPath)) {
        newFilePath = outPath;
      } else {
        newFilePath = path.resolve(process.cwd(), outPath);
      }
      try {
        yield fsp.writeFile(newFilePath, data, "utf-8");
      } catch (err) {
        console.error(err, err.stack);
        process.exit(1);
      }
    });
  },
  makeTempDir(prefix) {
    const fs = require("fs");
    return new Promise((resolve, reject) => {
      fs.mkdtemp(prefix, (err, folder) => {
        return (err) ? reject(err) : resolve(folder);
      });
    });
  },
};

function makeConsoleMsgHandler(nightmare) {
  return function handleConsoleMessages(parsedArgs) {
    nightmare.on("console", (type, message) => {
      const abortOnWarning = parsedArgs.haltonwarn && type === "warn";
      const abortOnError = parsedArgs.haltonerror && type === "error";
      const output = `ReSpec ${type}: ${colors.debug(message)}`;
      switch (type) {
      case "error":
        console.error(colors.error(`😱 ${output}`));
        break;
      case "warn":
        // Ignore Nightmare's poling of respecDone
        if (/document\.respecDone/.test(message)) {
          return;
        }
        console.error(colors.warn(`😳 ${output}`));
        break;
      }
      if (abortOnError || abortOnWarning) {
        nightmare.proc.kill();
        process.exit(1);
      }
    });
  };
}

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
  const userData = yield tasks.makeTempDir(os.tmpDir() + "/respec2html-");
  const Nightmare = require("nightmare");
  const nightmare = new Nightmare({
    show: false,
    timeout: parsedArgs.timeout,
    webPreferences: {
      "images": false,
      "defaultEncoding": "utf-8",
      userData,
    }
  });
  nightmare.useragent("respec2html");
  const url = require("url")
    .parse(parsedArgs.src)
    .href;
  const handleConsoleMessages = makeConsoleMsgHandler(nightmare);
  handleConsoleMessages(parsedArgs);
  const html = yield nightmare
    .goto(url)
    .wait(function () {
      return document.respecDone;
    })
    .wait("#respec-modal-save-snapshot")
    .click("#respec-modal-save-snapshot")
    .wait(100)
    .evaluate(function () {
      var encodedText = document.querySelector("#respec-save-as-html").href;
      var decodedText = decodeURIComponent(encodedText);
      var cleanedUpText = decodedText.replace(/^data:text\/html;charset=utf-8,/, "");
      return cleanedUpText;
    })
    .end();
  if (!parsedArgs.out) {
    return process.stdout.write(html);
  }
  try {
    yield tasks.writeTo(parsedArgs.out, html);
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
});
