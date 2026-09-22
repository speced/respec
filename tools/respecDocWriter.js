/**
 * Exports toHTML() method, allowing programmatic control of the spec generator.
 */
import {
  getAnnotationFormat,
  respondAnnotated,
  tightenErrorLocations,
} from "./sourcemap.js";
import path from "path";
import puppeteer from "puppeteer";
import { readFile } from "fs/promises";

const noop = () => {};

/**
 * Time allowed for the browser process to start, separate from processing.
 * Cold CI runners regularly need longer than puppeteer's 30s default,
 * which surfaced as "Timed out ... waiting for the WS endpoint URL".
 */
const LAUNCH_TIMEOUT = 120000;

/**
 * Fetches a ReSpec "src" URL, and writes the processed static HTML to an "out" path.
 * @param {string} src A URL or filepath that is the ReSpec source.
 * @param {object} [options]
 * @param {number} [options.timeout] Milliseconds before processing should timeout.
 * @param {boolean} [options.useLocal] Use locally installed ReSpec instead of the one in document.
 * @param {boolean} [options.experimentalSourcemap] Experimental: annotate the document with markers so errors/warnings can report a source line. Markers are stripped from the returned `html`.
 * @param {(error: RsError) => void} [options.onError] What to do if a ReSpec processing has an error. Does nothing by default.
 * @param {(warning: RsError) => void} [options.onWarning] What to do if a ReSpec processing has a warning. Does nothing by default.
 * @param {(msg: string, timeRemaining: number) => void} [options.onProgress]
 * @param {boolean} [options.disableSandbox] See https://peter.sh/experiments/chromium-command-line-switches/#no-sandbox
 * @param {boolean} [options.disableGPU] See https://developer.chrome.com/blog/headless-chrome/#starting_headless_cli
 * @param {boolean} [options.devtools] Show the Chromium window with devtools open for debugging.
 * @return {Promise<{ html: string, errors: RsError[], warnings: RsError[] }>}
 * @throws {Error} If failed to process.
 */
export async function toHTML(src, options = {}) {
  const {
    timeout = 300000,
    disableSandbox = false,
    disableGPU = false,
    devtools = false,
    useLocal = false,
    experimentalSourcemap = false,
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
  /**
   * Starts once the browser is up, so a slow launch does not eat the caller's
   * processing budget. `timeout` documents time before *processing* times out.
   */
  let timer = createTimer(timeout);

  /** @type {RsError[]} */
  const errors = [];
  /** @type {RsError[]} */
  const warnings = [];
  /** @type {Map<string, string>} */
  const rawSources = new Map();
  const onError = error => {
    tightenErrorLocations(error, rawSources);
    errors.push(error);
    options.onError(error);
  };
  const onWarning = warning => {
    tightenErrorLocations(warning, rawSources);
    warnings.push(warning);
    options.onWarning(warning);
  };

  const args = [];
  if (disableSandbox) args.push("--no-sandbox");
  if (disableGPU) args.push("--disable-gpu");

  log("Launching browser");
  const browser = await puppeteer.launch({
    args,
    devtools,
    headless: true,
    timeout: LAUNCH_TIMEOUT,
  });
  // Charge only document processing against the caller's timeout.
  timer = createTimer(timeout);

  try {
    const page = await browser.newPage();

    handleConsoleMessages(page, onError, onWarning);
    const url = new URL(src);
    await setupInterception(page, {
      useLocal,
      sourcemap: experimentalSourcemap ? { mainUrl: url, rawSources } : false,
      log,
    });

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
 * Sets up request interception for `useLocal` and `sourcemap` together:
 * Puppeteer only tolerates one "request" handler deciding each request's
 * outcome.
 * @param {import("puppeteer").Page} page
 * @param {object} options
 * @param {boolean} options.useLocal
 * @param {false | { mainUrl: URL, rawSources: Map<string, string> }} options.sourcemap
 * @param {(msg: any) => void} options.log
 */
async function setupInterception(page, { useLocal, sourcemap, log }) {
  if (!useLocal && !sourcemap) return;
  await page.setRequestInterception(true);

  page.on("request", async request => {
    try {
      if (useLocal && isRespecScript(request)) {
        await respondWithLocalReSpec(request, log);
        return;
      }
      if (sourcemap) {
        const format = await getAnnotationFormat(
          request.url(),
          sourcemap.mainUrl.href,
          page
        );
        if (format) {
          await respondAnnotated(request, format, sourcemap.rawSources, log);
          return;
        }
      }
      await request.continue();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log(`Interception error for ${request.url()}: ${message}`);
      await request.continue().catch(() => {});
    }
  });
}

/**
 * @param {import("puppeteer").HTTPRequest} request
 * @param {(msg: any) => void} log
 */
async function respondWithLocalReSpec(request, log) {
  const url = new URL(request.url());
  const respecProfileRegex = /\/(respec-[\w-]+)(?:\.js)?$/;
  const profile = url.pathname.match(respecProfileRegex)[1];
  const localPath = path.join(
    import.meta.dirname,
    "..",
    "builds",
    `${profile}.js`
  );
  const relPath = path.relative(process.cwd(), localPath);
  log(`Intercepted ${url} to respond with ${relPath}`);
  await request.respond({
    contentType: "text/javascript; charset=utf-8",
    body: await readFile(localPath),
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
      return path.startsWith("/Tools/respec/");
    case "w3c.github.io":
    case "speced.github.io":
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
    return await page.evaluate(evaluateHTML, timer);
  } catch (err) {
    const msg = `\n😭  Sorry, there was an error generating the HTML. Please report this issue!\n${
      `Specification: ${url}\n` +
      `ReSpec version: ${version.join(".")}\n` +
      "File a bug: https://github.com/speced/respec/\n"
    }`;
    throw new Error(msg, { cause: err });
  }
}

/**
 * @param {ReturnType<typeof createTimer>} timer
 */
async function evaluateHTML(timer) {
  await timeout(
    document.respec ? document.respec.ready : document.respecIsReady,
    timer.remaining
  );

  if (!document.respec?.toHTML) {
    throw new Error(
      "document.respec.toHTML is not available. " +
        "Please upgrade to a newer version of ReSpec, " +
        "or use an older version of the ReSpec CLI."
    );
  }

  return await document.respec.toHTML();

  function timeout(promise, ms) {
    return new Promise((resolve, reject) => {
      promise.then(resolve, reject);
      const msg = `Timeout: document.respec.ready didn't resolve in ${ms}ms.`;
      setTimeout(() => reject(new Error(msg)), ms);
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
 * @property {(string | null)[]} [ReSpecError.location] source `path:line` (or `path:start-end`) per offending element
 * @property {(string | null)[]} [ReSpecError.originalText] raw matched inline-syntax text per offending element, used to narrow `location`
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
    return await handle.evaluate(obj => {
      if (typeof obj === "string" || obj === null || obj === undefined) {
        // Old ReSpec versions might report errors as strings.
        return JSON.stringify({ message: String(obj) });
      } else if (obj instanceof Error && !obj.plugin) {
        let cause;
        if (obj.cause instanceof Error) {
          cause = {
            name: obj.cause.name,
            message: obj.cause.message,
            stack: obj.cause.stack,
          };
        }
        return JSON.stringify({
          message: obj.message,
          plugin: "unknown",
          name: obj.name,
          cause,
          stack: obj.stack?.replace(
            obj.message,
            `${obj.message.slice(0, 30)}…`
          ),
        });
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
      (type === "error" || type === "warning" || type === "warn") &&
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
      case "warn":
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
