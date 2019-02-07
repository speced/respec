/**
 * Exports fetchAndWrite() method, allowing programmatic control of the
 * spec generator.
 *
 * For usage, see example a https://github.com/w3c/respec/pull/692
 */
/* jshint node: true, browser: false */
"use strict";
const os = require("os");
const puppeteer = require("puppeteer");
const colors = require("colors");
const { promisify } = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const mkdtemp = promisify(fs.mkdtemp);
const path = require("path");
const { URL } = global.URL ? { URL: global.URL } : require("url");
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
async function fetchAndWrite(
  src,
  out,
  whenToHalt,
  { timeout = 300000, disableSandbox = false, debug = false } = {}
) {
  const userDataDir = await mkdtemp(`${os.tmpdir()}/respec2html-`);
  const args = disableSandbox ? ["--no-sandbox"] : undefined;
  const browser = await puppeteer.launch({
    userDataDir,
    args,
    devtools: debug,
  });
  try {
    const page = await browser.newPage();
    const handleConsoleMessages = makeConsoleMsgHandler(page);
    handleConsoleMessages(whenToHalt);
    const url = new URL(src);
    const response = await page.goto(url, { timeout });
    if (
      !response.ok() &&
      response.status() /* workaround: 0 means ok for local files */
    ) {
      const warn = colors.warn(`📡 HTTP Error ${response.status()}:`);
      // don't show params, as they can contain the API key!
      const debugURL = `${url.origin}${url.pathname}`;
      const msg = `${warn} ${colors.debug(debugURL)}`;
      throw new Error(msg);
    }
    await checkIfReSpec(page);
    const html = await generateHTML(page, url);
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
  } finally {
    browser.close();
  }
}

/**
 * @param {import("puppeteer").Page} page
 * @param {string} url
 */
async function generateHTML(page, url) {
  await page.waitForFunction(() => window.hasOwnProperty("respecVersion"));
  const version = await page.evaluate(getVersion);
  try {
    return await page.evaluate(evaluateHTML, version);
  } catch (err) {
    const msg = `\n😭  Sorry, there was an error generating the HTML. Please report this issue!\n${colors.debug(
      `${`Specification: ${url}\n` +
        `ReSpec version: ${version.join(".")}\n` +
        "File a bug: https://github.com/w3c/respec/\n"}${
        err ? `Error: ${err.stack}\n` : ""
      }`
    )}`;
    throw new Error(msg);
  }
}

/**
 * @param {import("puppeteer").Page} page
 */
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
  return Boolean(document.getElementById("respec-ui"));
}

/**
 * @param {number[]} version
 */
async function evaluateHTML(version) {
  await document.respecIsReady;
  const [major, minor] = version;
  if (major < 20 || (major === 20 && minor < 10)) {
    console.warn(
      "👴🏽  Ye Olde ReSpec version detected! Please update to 20.10.0 or above. " +
        `Your version: ${window.respecVersion}.`
    );
    // Document references an older version of ReSpec that does not yet
    // have the "core/exporter" module. Try with the old "ui/save-html"
    // module.
    const { exportDocument } = await new Promise((resolve, reject) => {
      require(["ui/save-html"], resolve, err => {
        reject(new Error(err.message));
      });
    });
    return exportDocument("html", "text/html");
  } else {
    const { rsDocToDataURL } = await new Promise((resolve, reject) => {
      require(["core/exporter"], resolve, err => {
        reject(new Error(err.message));
      });
    });
    const dataURL = rsDocToDataURL("text/html");
    const encodedString = dataURL.replace(/^data:\w+\/\w+;charset=utf-8,/, "");
    return decodeURIComponent(encodedString);
  }
}

function getVersion() {
  if (window.respecVersion === "Developer Edition") {
    return [123456789, 0, 0];
  }
  return window.respecVersion.split(".").map(str => parseInt(str, 10));
}
/**
 * Handles messages from the browser's Console API.
 *
 * @param  {import("puppeteer").Page} page Instance of page to listen on.
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
    page.on("console", async message => {
      const args = await Promise.all(message.args().map(stringifyJSHandle));
      const msgText = message.text();
      const text = args.filter(msg => msg !== "undefined").join(" ");
      const type = message.type();
      if (
        type === "error" &&
        msgText && // browser errors have text
        !message.args().length // browser errors have no arguments
      ) {
        // Since Puppeteer 1.4 reports _all_ errors, including CORS
        // violations. Unfortunately, there is no way to distinguish these errors
        // from other errors, so using this ugly hack.
        // https://github.com/GoogleChrome/puppeteer/issues/1939
        return;
      }
      const abortOnWarning = whenToHalt.haltOnWarn && type === "warning";
      const abortOnError = whenToHalt.haltOnError && type === "error";
      const output = `ReSpec ${type}: ${colors.debug(text)}`;
      switch (type) {
        case "error":
          console.error(colors.error(`😱 ${output}`));
          break;
        case "warning":
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
