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
const { mkdtemp, writeFile } = require("fs").promises;
const path = require("path");
colors.setTheme({
  debug: "cyan",
  error: "red",
  warn: "yellow",
  info: "blue",
});

/**
 * Fetches a ReSpec "src" URL, and writes the processed static HTML to an "out" path.
 * @param {string} src A URL or filepath that is the ReSpec source.
 * @param {string | null | ""} out A path to write to. If null, goes to stdout. If "", then don't write, just return value.
 * @param {object} [whenToHalt] Allowing execution to stop without writing.
 * @param {boolean} [whenToHalt.haltOnError] Do not write if a ReSpec processing has an error.
 * @param {boolean} [whenToHalt.haltOnWarn] Do not write if a ReSpec processing has a warning.
 * @param {object} [options]
 * @param {number} [options.timeout] Milliseconds before processing should timeout.
 * @param {boolean} [options.disableSandbox] See https://peter.sh/experiments/chromium-command-line-switches/#no-sandbox
 * @param {boolean} [options.debug] Show the Chromium window with devtools open for debugging.
 * @param {boolean} [options.verbose] Log processing status to stdout.
 * @param {(error: RsError) => void} [options.onError] What to do if a ReSpec processing has an error. Logs to stderr by default.
 * @param {(warning: RsError) => void} [options.onWarning] What to do if a ReSpec processing has a warning. Logs to stderr by default.
 * @return {Promise<string>} Resolves with HTML when done writing. Rejects on errors.
 */
async function fetchAndWrite(
  src,
  out,
  whenToHalt = {},
  {
    timeout = 300000,
    disableSandbox = false,
    verbose = false,
    debug = false,
    onError = error =>
      console.error(
        colors.error(`💥 ReSpec error: ${colors.debug(error.message)}`)
      ),
    onWarning = warning =>
      console.warn(
        colors.warn(`⚠️ ReSpec warning: ${colors.debug(warning.message)}`)
      ),
  } = {}
) {
  const timer = createTimer(timeout);

  const log =
    verbose && out !== null
      ? msg => console.log(`[Timeout: ${timer.remaining}ms] ${msg}`)
      : () => {};

  const userDataDir = await mkdtemp(`${os.tmpdir()}/respec2html-`);
  const args = disableSandbox ? ["--no-sandbox"] : undefined;
  log("Launching browser");
  const browser = await puppeteer.launch({
    userDataDir,
    args,
    devtools: debug,
  });
  try {
    const page = await browser.newPage();

    const haltFlags = { error: false, warn: false };
    handleConsoleMessages(page, haltFlags, onError, onWarning);

    const url = new URL(src);
    log(`Navigating to ${url}`);
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
    log(`Navigation complete.`);
    await checkIfReSpec(page);
    log("Processing ReSpec document...");
    const html = await generateHTML(page, url, timer);
    log("Processed document.");
    const abortOnWarning = whenToHalt.haltOnWarn && haltFlags.warn;
    const abortOnError = whenToHalt.haltOnError && haltFlags.error;
    if (abortOnError || abortOnWarning) {
      throw new Error(
        `${abortOnError ? "Errors" : "Warnings"} found during processing.`
      );
    }
    await write(out, html);
    // Race condition: Wait before page close for all console messages to be logged
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.close();
    log("Done.");
    return html;
  } finally {
    await browser.close();
  }
}

/**
 * @param {import("puppeteer").Page} page
 * @param {string} url
 * @param {ReturnType<typeof createTimer>} timer
 */
async function generateHTML(page, url, timer) {
  await page.waitForFunction(() => window.hasOwnProperty("respecVersion"));
  const version = await page.evaluate(getVersion);
  try {
    return await page.evaluate(evaluateHTML, version, timer);
  } catch (err) {
    const msg = `\n😭  Sorry, there was an error generating the HTML. Please report this issue!\n${colors.debug(
      `${
        `Specification: ${url}\n` +
        `ReSpec version: ${version.join(".")}\n` +
        "File a bug: https://github.com/w3c/respec/\n"
      }${err ? `Error: ${err.stack}\n` : ""}`
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
 * @param {ReturnType<typeof createTimer>} timer
 */
async function evaluateHTML(version, timer) {
  await timeout(document.respecIsReady, timer.remaining);

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

  function timeout(promise, ms) {
    return new Promise((resolve, reject) => {
      promise.then(resolve, reject);
      const msg = `Timeout: document.respecIsReady didn't resolve in ${ms}ms.`;
      setTimeout(() => reject(msg), ms);
    });
  }
}

function getVersion() {
  if (window.respecVersion === "Developer Edition") {
    return [123456789, 0, 0];
  }
  return window.respecVersion.split(".").map(str => parseInt(str, 10));
}

/**
 * Specifies what to do when the browser emits "error" and "warn" console messages.
 * @param  {import("puppeteer").Page} page Instance of page to listen on.
 * @param {object} haltFlags
 * @param {boolean} [haltFlags.error]
 * @param {boolean} [haltFlags.warn]
 * @typedef {{ message: string }} RsError
 * @param {(error: RsError) => void} onError
 * @param {(error: RsError) => void} onWarning
 */
function handleConsoleMessages(page, haltFlags, onError, onWarning) {
  /** @param {import('puppeteer').JSHandle<any>} handle */
  async function stringifyJSHandle(handle) {
    return await handle.executionContext().evaluate(o => String(o), handle);
  }

  page.on("console", async message => {
    const args = await Promise.all(message.args().map(stringifyJSHandle));
    const msgText = message.text();
    const text = args.filter(msg => msg !== "undefined").join(" ");
    const type = message.type();
    if (
      (type === "error" || type === "warning") &&
      msgText && // browser errors have text
      !message.args().length // browser errors/warnings have no arguments
    ) {
      // Since Puppeteer 1.4 reports _all_ errors, including CORS
      // violations and slow preloads. Unfortunately, there is no way to distinguish
      // these errors from other errors, so using this ugly hack.
      // https://github.com/GoogleChrome/puppeteer/issues/1939
      return;
    }
    switch (type) {
      case "error":
        onError({ message: text });
        haltFlags.error = true;
        break;
      case "warning":
        // Ignore polling of respecDone
        if (/document\.respecDone/.test(text)) {
          return;
        }
        onWarning({ message: text });
        haltFlags.warn = true;
        break;
    }
  });
}

function createTimer(duration) {
  const start = Date.now();
  return {
    get remaining() {
      const spent = Date.now() - start;
      return Math.max(0, duration - spent);
    },
  };
}

/**
 * @param {string | null | ""} destination
 * @param {string} html
 */
async function write(destination, html) {
  switch (destination) {
    case "":
      break;
    case null:
      process.stdout.write(html);
      break;
    default: {
      const newFilePath = path.isAbsolute(destination)
        ? destination
        : path.resolve(process.cwd(), destination);
      await writeFile(newFilePath, html, "utf-8");
    }
  }
}

exports.fetchAndWrite = fetchAndWrite;
