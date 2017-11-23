/**
 * Exports fetchAndWrite() method, allowing programmatic control of the
 * spec generator.
 *
 * For usage, see example a https://github.com/w3c/respec/pull/692
 */
/*jshint node: true, browser: false*/
"use strict";
const os = require("os");
const Nightmare = require("nightmare");
const colors = require("colors");
const { promisify } = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const mkdtemp = promisify(fs.mkdtemp);
const path = require("path");
const parseURL = require("url").parse;
colors.setTheme({
  debug: "cyan",
  error: "red",
  warn: "yellow",
  info: "blue",
});

// Configuration for nightmare
const config = {
  show: false,
  timeout: 3000,
  webPreferences: {
    images: false,
    defaultEncoding: "utf-8",
    partition: "nopersist",
    userData: "",
  },
};

/**
 * Writes "data" to a particular outPath as UTF-8.
 * @private
 * @param  {String} outPath The relative or absolute path to write to.
 * @param  {String} data    The data to write.
 * @return {Promise}        Resolves when writing is done.
 */
async function writeTo(outPath, data) {
  let newFilePath = "";
  if (path.isAbsolute(outPath)) {
    newFilePath = outPath;
  } else {
    newFilePath = path.resolve(process.cwd(), outPath);
  }
  try {
    await writeFile(newFilePath, data, "utf-8");
  } catch (err) {
    console.error(err, err.stack);
    process.exit(1);
  }
}

/**
 * Fetches a ReSpec "src" URL, processes via NightmareJS and writes it to an
 * "out" path within a given "timeout".
 *
 * @public
 * @param  {String} src         A URL that is the ReSpec source.
 * @param  {String|null|""} out A path to write to. If null, goes to stdout.
 *                              If "", then don't write, just return value.
 * @param  {Object} whenToHalt  Object with two bool props (haltOnWarn,
 *                              haltOnError), allowing execution to stop
 *                              if either occurs.
 * @param  {Number} timeout     Optional. Milliseconds before NightmareJS
 *                              should timeout.
 * @return {Promise}            Resolves with HTML when done writing.
 *                              Rejects on errors.
 */
async function fetchAndWrite(src, out, whenToHalt, timeout = 300000) {
  const userData = await mkdtemp(os.tmpdir() + "/respec2html-");
  const nightmare = new Nightmare({ ...config, timeout, userData });
  nightmare.useragent("respec2html");
  const url = parseURL(src).href;
  const handleConsoleMessages = makeConsoleMsgHandler(nightmare);
  handleConsoleMessages(whenToHalt);
  const response = await nightmare.goto(url);
  if (response.code !== 200) {
    const warn = colors.warn(`📡 HTTP Error ${response.code}:`);
    const msg = `${warn} ${colors.debug(url)}`;
    nightmare.proc.kill();
    throw new Error(msg);
  }
  await checkIfReSpec(nightmare, url);
  const version = await checkReSpecVersion(nightmare);
  const html = await generateHTML(nightmare, version, url);
  switch (out) {
    case null:
      process.stdout.write(html);
      break;
    case "":
      break;
    default:
      try {
        await writeTo(out, html);
      } catch (err) {
        throw err;
      }
  }
  return html;
}

async function generateHTML(nightmare, version, url) {
  try {
    return await nightmare.evaluate(evaluateHTML).end();
  } catch (err) {
    const msg =
      `\n😭  Sorry, there was an error generating the HTML. Please report this issue!\n` +
      colors.debug(
        `Specification: ${url}\n` +
          `ReSpec version: ${version.join(".")}\n` +
          `File a bug: https://github.com/w3c/respec/\n` +
          (err ? `Error: ${err}\n` : "")
      );
    throw new Error(msg);
  }
}

async function checkReSpecVersion(nightmare) {
  const version = await nightmare
    .wait(() => {
      return window.hasOwnProperty("respecVersion");
    })
    .evaluate(getVersion);
  const [mayor] = version;
  // The exportDocument() method only appeared in vesion 18.
  if (mayor < 18) {
    let msg =
      "👴🏽  Ye Olde ReSpec version detected! " +
      colors.debug("Sorry, we only support ReSpec version 18.0.0 onwards.\n");
    msg += colors.debug(
      `The document has version: ${colors.info(version.join("."))}\n`
    );
    msg += colors.debug("Grab the latest ReSpec from: ");
    msg += colors.gray.underline("https:github.com/w3c/respec/");
    throw new Error(msg);
  }
  return version;
}

async function checkIfReSpec(nightmare, url) {
  const isRespecDoc = await nightmare.evaluate(isRespec);
  if (!isRespecDoc) {
    const msg = `${colors.warn(
      "🕵️‍♀️  That doesn't seem to be a ReSpec document. Please check manually:"
    )} ${colors.debug(url)}`;
    nightmare.proc.kill();
    throw new Error(msg);
  }
  return isRespecDoc;
}

async function isRespec() {
  try {
    const query = "script[data-main*='profile-'], script[src*='respec']";
    if (document.head.querySelector(query)) {
      return true;
    }
    await new Promise(resolve => {
      document.onreadystatechange = () => {
        if (document.readyState === "complete") {
          resolve();
        }
      };
      document.onreadystatechange();
    });
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return Boolean(document.querySelector("#respec-ui"));
  } catch (err) {
    throw err.stack;
  }
}

async function evaluateHTML() {
  try {
    await document.respecIsReady;
    const exportDocument = await new Promise(resolve => {
      require(["ui/save-html"], ({ exportDocument }) => {
        resolve(exportDocument);
      });
    });
    return exportDocument();
  } catch (err) {
    throw err.stack;
  }
}

function getVersion() {
  try {
    if (window.respecVersion === "Developer Edition") {
      return [123456789, 0, 0];
    }
    const version = window.respecVersion
      .split(".")
      .map(str => parseInt(str, 10));
    return version;
  } catch (err) {
    throw err.stack;
  }
}
/**
 * Handles messages from the browser's Console API.
 *
 * @param  {Nightmare} nightmare Instance of Nightmare to listen on.
 * @return {Function}
 */
function makeConsoleMsgHandler(nightmare) {
  /**
   * Specifies what to do when the browser emits "error" and "warn" console
   * messages.
   *
   * @param  {Object} whenToHalt Object with two bool props (haltOnWarn,
   *                             haltOnError), allowing execution to stop
   *                             if either occurs.
   * @return {Void}
   */
  return function handleConsoleMessages(whenToHalt) {
    nightmare.on("console", (type, message) => {
      const abortOnWarning = whenToHalt.haltOnWarn && type === "warn";
      const abortOnError = whenToHalt.haltOnError && type === "error";
      const output = `ReSpec ${type}: ${colors.debug(message)}`;
      switch (type) {
        case "error":
          if (typeof message === "object") {
            console.error(message);
          } else {
            console.error(colors.error(`😱 ${output}`));
          }
          break;
        case "warn":
          // Ignore Nightmare's poling of respecDone
          if (/document\.respecDone/.test(message)) {
            return;
          }
          console.warn(colors.warn(`🚨 ${output}`));
          break;
      }
      if (abortOnError || abortOnWarning) {
        nightmare.proc.kill();
        process.exit(1);
      }
    });
  };
}
exports.fetchAndWrite = fetchAndWrite;
