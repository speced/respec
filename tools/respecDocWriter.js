/**
 * Exports toHTML() method, allowing programmatic control of the spec generator.
 */
const puppeteer = require("puppeteer");
const path = require("path");
const { mkdtemp, readFile } = require("fs").promises;
const { tmpdir } = require("os");

const noop = () => {};

/**
 * Fetches a ReSpec "src" URL, and writes the processed static HTML to an "out" path.
 * @param {string} src A URL or filepath that is the ReSpec source.
 * @param {object} [options]
 * @param {number} [options.timeout] Milliseconds before processing should timeout.
 * @param {boolean} [options.useLocal] Use locally installed ReSpec instead of the one in document.
 * @param {(error: RsError) => void} [options.onError] What to do if a ReSpec processing has an error. Does nothing by default.
 * @param {(warning: RsError) => void} [options.onWarning] What to do if a ReSpec processing has a warning. Does nothing by default.
 * @param {(msg: string, timeRemaining: number) => void} [options.onProgress]
 * @param {boolean} [options.disableSandbox] See https://peter.sh/experiments/chromium-command-line-switches/#no-sandbox
 * @param {boolean} [options.devtools] Show the Chromium window with devtools open for debugging.
 * @return {Promise<{ html: string, errors: RsError[], warnings: RsError[] }>}
 * @throws {Error} If failed to process.
 */
async function toHTML(src, options = {}) {
  const {
    timeout = 300000,
    disableSandbox = false,
    devtools = false,
    useLocal = false,
  } = options;
  if (typeof options.onError !== "function") {
    options.onError = noop;
  }
  if (typeof options.onWarning !== "function") {
    options.onWarning = noop;
  }
  if (typeof options.onProgress !== "function") {
    options.onProgress = noop;
  }

  const log = msg => options.onProgress(msg, timer.remaining);
  const timer = createTimer(timeout);

  /** @type {RsError[]} */
  const errors = [];
  /** @type {RsError[]} */
  const warnings = [];
  const onError = error => {
    errors.push(error);
    options.onError(error);
  };
  const onWarning = warning => {
    warnings.push(warning);
    options.onWarning(warning);
  };

  const userDataDir = await mkdtemp(`${tmpdir()}/respec2html-`);
  const args = [];
  if (disableSandbox) args.push("--no-sandbox");

  log("Launching browser");
  const browser = await puppeteer.launch({ userDataDir, args, devtools });

  try {
    const page = await browser.newPage();

    handleConsoleMessages(page, onError, onWarning);
    if (useLocal) {
      await useLocalReSpec(page, log);
    }

    const url = new URL(src);
    log(`Navigating to ${url}`);
    const response = await page.goto(url.href, { timeout: timer.remaining });
    if (
      !response.ok() &&
      response.status() /* workaround: 0 means ok for local files */
    ) {
      // don't show params, as they can contain the API key!
      const debugURL = `${url.origin}${url.pathname}`;
      const msg = `📡 HTTP Error ${response.status()}: ${debugURL}`;
      throw new Error(msg);
    }
    log(`Navigation complete.`);

    await checkIfReSpec(page);
    const version = await getVersion(page);
    log(`Using ReSpec v${version.join(".")}`);

    log("Processing ReSpec document...");
    const html = await generateHTML(page, timer, version, url);
    log("Processed document.");

    // Race condition: Wait before page close for all console messages to be logged
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.close();
    log("Done.");

    return { html, errors, warnings };
  } finally {
    await browser.close();
  }
}

/**
 * Replace the ReSpec script in document with the locally installed one. This is
 * useful in CI env or when you want to pin the ReSpec version.
 *
 * @assumption The ReSpec script being used in the document is hosted on either
 * w3.org or w3c.github.io. If this assumption doesn't hold true (interception
 * fails), this function will timeout.
 *
 * The following ReSpec URLs are supported:
 * https://www.w3.org/Tools/respec/${profile}
 * https://w3c.github.io/respec/builds/${profile}.js
 * file:///home/path-to-respec/builds/${profile}.js
 * http://localhost:PORT/builds/${profile}.js
 * https://example.com/builds/${profile}.js
 *
 * @param {import("puppeteer").Page} page
 * @param {(msg: any) => void} log
 */
async function useLocalReSpec(page, log) {
  await page.setRequestInterception(true);

  page.on("request", async function requestInterceptor(request) {
    if (!isRespecScript(request)) {
      await request.continue();
      return;
    }

    const url = new URL(request.url());
    const respecProfileRegex = /\/(respec-[\w-]+)(?:\.js)?$/;
    const profile = url.pathname.match(respecProfileRegex)[1];
    const localPath = path.join(__dirname, "..", "builds", `${profile}.js`);
    const relPath = path.relative(process.cwd(), localPath);
    log(`Intercepted ${url} to respond with ${relPath}`);
    await request.respond({
      contentType: "text/javascript; charset=utf-8",
      body: await readFile(localPath),
    });
    // Workaround for https://github.com/puppeteer/puppeteer/issues/4208
    page.off("request", requestInterceptor);
    await page.setRequestInterception(false);
  });
}

/** @param {import("puppeteer").HTTPRequest} req */
function isRespecScript(req) {
  if (req.method() !== "GET" || req.resourceType() !== "script") {
    return false;
  }

  const { host, pathname: path } = new URL(req.url());
  switch (host) {
    case "www.w3.org":
      return (
        path.startsWith("/Tools/respec/") && !path.includes("respec-highlight")
      );
    case "w3c.github.io":
      return path.startsWith("/respec/builds/");
    default:
      // localhost, file://, and everything else
      return /\/builds\/respec-[\w-]+\.js$/.test(path);
  }
}

/**
 * @param {import("puppeteer").Page} page
 * @typedef {[major: number, minor: number, patch: number]} ReSpecVersion
 * @returns {Promise<ReSpecVersion>}
 */
async function getVersion(page) {
  await page.waitForFunction(() => window.hasOwnProperty("respecVersion"));
  return await page.evaluate(() => {
    if (/^\D/.test(window.respecVersion)) {
      return [123456789, 0, 0];
    }
    return window.respecVersion.split(".").map(str => parseInt(str, 10));
  });
}

/**
 * @param {import("puppeteer").Page} page
 */
async function checkIfReSpec(page) {
  const isRespecDoc = await page.evaluate(isRespec);
  if (!isRespecDoc) {
    const msg = `🕵️‍♀️  That doesn't seem to be a ReSpec document. Please check manually: ${page.url()}`;
    throw new Error(msg);
  }
  return isRespecDoc;

  async function isRespec() {
    const query = "script[data-main*='profile-'], script[src*='respec']";
    if (document.head.querySelector(query)) {
      return true;
    }
    await new Promise(resolve => {
      document.onreadystatechange = () => {
        if (document.readyState === "complete") resolve();
      };
      document.onreadystatechange();
    });
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return Boolean(document.getElementById("respec-ui"));
  }
}

/**
 * @param {import("puppeteer").Page} page
 * @param {ReturnType<typeof createTimer>} timer
 * @param {ReSpecVersion} version
 * @param {URL} url
 */
async function generateHTML(page, timer, version, url) {
  try {
    return await page.evaluate(evaluateHTML, version, timer);
  } catch (err) {
    const msg = `\n😭  Sorry, there was an error generating the HTML. Please report this issue!\n${`${
      `Specification: ${url}\n` +
      `ReSpec version: ${version.join(".")}\n` +
      "File a bug: https://github.com/w3c/respec/\n"
    }${err ? `Error: ${err.stack}\n` : ""}`}`;
    throw new Error(msg);
  }
}

/**
 * @param {ReSpecVersion} version
 * @param {ReturnType<typeof createTimer>} timer
 */
async function evaluateHTML(version, timer) {
  await timeout(
    document.respec ? document.respec.ready : document.respecIsReady,
    timer.remaining
  );

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
  } else if (!document.respec || !document.respec.toHTML) {
    const { rsDocToDataURL } = await new Promise((resolve, reject) => {
      require(["core/exporter"], resolve, err => {
        reject(new Error(err.message));
      });
    });
    const dataURL = rsDocToDataURL("text/html");
    const encodedString = dataURL.replace(/^data:\w+\/\w+;charset=utf-8,/, "");
    return decodeURIComponent(encodedString);
  } else {
    return await document.respec.toHTML();
  }

  function timeout(promise, ms) {
    return new Promise((resolve, reject) => {
      promise.then(resolve, reject);
      const msg = `Timeout: document.respec.ready didn't resolve in ${ms}ms.`;
      setTimeout(() => reject(msg), ms);
    });
  }
}

/**
 * @typedef {object} RsErrorBasic
 * @property {string} RsErrorBasic.message
 *
 * @typedef {object} ReSpecError
 * @property {string} ReSpecError.message
 * @property {string} ReSpecError.plugin
 * @property {string} [ReSpecError.hint]
 * @property {HTMLElement[]} [ReSpecError.elements]
 * @property {string} [ReSpecError.title]
 * @property {string} [ReSpecError.details]
 *
 * @typedef {RsErrorBasic | ReSpecError} RsError
 */

/**
 * Specifies what to do when the browser emits "error" and "warn" console messages.
 * @param  {import("puppeteer").Page} page Instance of page to listen on.
 * @param {(error: RsError) => void} onError
 * @param {(error: RsError) => void} onWarning
 */
function handleConsoleMessages(page, onError, onWarning) {
  /** @param {import('puppeteer').JSHandle<any>} handle */
  async function stringifyJSHandle(handle) {
    return await handle.executionContext().evaluate(obj => {
      if (typeof obj === "string") {
        // Old ReSpec versions might report errors as strings.
        return JSON.stringify({ message: String(obj) });
      } else {
        // Ideally: `obj instanceof RsError` and `RsError instanceof Error`.
        return JSON.stringify(obj);
      }
    }, handle);
  }

  page.on("console", async message => {
    const args = await Promise.all(message.args().map(stringifyJSHandle));
    const msgText = message.text();
    const text = args.filter(msg => msg !== "undefined")[0] || "";
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
        return onError(JSON.parse(text));
      case "warning":
        return onWarning(JSON.parse(text));
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

exports.toHTML = toHTML;
