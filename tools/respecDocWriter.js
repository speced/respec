/**
 * Exports fetchAndWrite() method, allowing programmatic control of the
 * spec generator.
 *
 * For usage, see example a https://github.com/w3c/respec/pull/692
 */
/*jshint node: true, browser: false*/
"use strict";
const os = require("os");
const puppeteer = require("puppeteer");
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
async function fetchAndWrite(src, out, whenToHalt, { timeout = 300000, disableSandbox = false } = {}) {
  const userDataDir = await mkdtemp(os.tmpdir() + "/respec2html-");
  const browser = await puppeteer.launch({
    userDataDir,
    args: disableSandbox && ["--no-sandbox"]
  });
  try {
    const page = await browser.newPage();
    const url = parseURL(src).href;
    const response = await page.goto(url, { timeout });
    const handleConsoleMessages = makeConsoleMsgHandler(page);
    handleConsoleMessages(whenToHalt);
    if (!response.ok() && response.status() /* workaround: 0 means ok for local files */) {
      const warn = colors.warn(`📡 HTTP Error ${response.status()}:`);
      const msg = `${warn} ${colors.debug(url)}`;
      throw new Error(msg);
    }
    await checkIfReSpec(page);
    const version = await checkReSpecVersion(page);
    const html = await generateHTML(page, version, url);
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
  finally {
    browser.close();
  }
}

async function generateHTML(page, version, url) {
  try {
    return await page.evaluate(evaluateHTML);
  } catch (err) {
    const msg =
      "\n😭  Sorry, there was an error generating the HTML. Please report this issue!\n" +
      colors.debug(
        `Specification: ${url}\n` +
          `ReSpec version: ${version.join(".")}\n` +
          "File a bug: https://github.com/w3c/respec/\n" +
          (err ? `Error: ${err}\n` : "")
      );
    throw new Error(msg);
  }
}

async function checkReSpecVersion(page) {
  await page.waitForFunction(() => window.hasOwnProperty("respecVersion"));
  const version = await page.evaluate(getVersion);
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

async function checkIfReSpec(page) {
  const isRespecDoc = await page.evaluate(isRespec);
  if (!isRespecDoc) {
    const msg = `${colors.warn(
      "🕵️‍♀️  That doesn't seem to be a ReSpec document. Please check manually:"
    )} ${colors.debug(page.url)}`;
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
    const { rsDocToDataURL } = await new Promise(resolve => {
      require(["core/exporter"], resolve);
    });
    return rsDocToDataURL("text/html");
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
 * @param  {puppeteer.Page} page Instance of page to listen on.
 * @return {Function}
 */
function makeConsoleMsgHandler(page) {
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
    page.on("console", async (message) => {
      const type = message.type();
      const args = await Promise.all(message.args().map(stringifyJSHandle));
      const text = args.join(" ");
      const abortOnWarning = whenToHalt.haltOnWarn && type === "warn";
      const abortOnError = whenToHalt.haltOnError && type === "error";
      const output = `ReSpec ${type}: ${colors.debug(text)}`;
      switch (type) {
        case "error":
          console.error(colors.error(`😱 ${output}`));
          break;
        case "warn":
          // Ignore polling of respecDone
          if (/document\.respecDone/.test(text)) {
            return;
          }
          console.warn(colors.warn(`🚨 ${output}`));
          break;
      }
      if (abortOnError || abortOnWarning) {
        process.exit(1);
      }
    });
  };
}

async function stringifyJSHandle(handle) {
  return await handle.executionContext().evaluate(o => String(o), handle);
}
exports.fetchAndWrite = fetchAndWrite;
