// @ts-check
/**
 * Minimal karma launcher that drives Safari through safaridriver over the W3C
 * WebDriver protocol. The published karma-safari-launcher uses a redirect.html
 * hack that modern Safari treats as a download, and @onslip/karma-safari-launcher
 * depends on wd@1.x, which needs a native build that fails on Node 24+.
 *
 * Requires safaridriver to be enabled once:
 *   sudo safaridriver --enable
 */

const { spawn } = require("child_process");

const PORT = 4445;

/**
 * @param {string} method
 * @param {string} path
 * @param {object} [body]
 * @param {number} [timeout] in milliseconds
 */
async function webdriver(method, path, body, timeout = 10000) {
  const res = await fetch(`http://localhost:${PORT}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WebDriver ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Polls GET /status until safaridriver is accepting connections.
 * @param {number} [timeout] in milliseconds
 */
async function waitForReady(timeout = 15000) {
  const deadline = Date.now() + timeout;
  for (;;) {
    try {
      return await webdriver("GET", "/status", undefined, 2000);
    } catch (err) {
      if (Date.now() >= deadline) {
        throw new Error(`safaridriver not ready after ${timeout}ms`, {
          cause: err,
        });
      }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
}

function SafariLauncher(logger, baseBrowserDecorator) {
  baseBrowserDecorator(this);
  this.name = "Safari";

  const log = logger.create("launcher.Safari");
  /** @type {import("child_process").ChildProcess | null} */
  let driver = null;
  /** @type {string | null} */
  let sessionId = null;

  const cleanup = async () => {
    if (sessionId) {
      await webdriver("DELETE", `/session/${sessionId}`).catch(() => {});
      sessionId = null;
    }
    driver?.kill();
    driver = null;
  };

  this._start = async url => {
    let failed = false;
    const fail = async message => {
      if (failed) return;
      failed = true;
      log.error(message);
      await cleanup();
      this._done("failure");
    };

    driver = spawn("safaridriver", ["--port", String(PORT)]);
    driver.stderr.on("data", data =>
      log.debug("safaridriver:", String(data).trim())
    );
    const exited = new Promise((_, reject) => {
      driver.once("error", reject);
      driver.once("exit", (code, signal) =>
        reject(new Error(`safaridriver exited (code=${code} signal=${signal})`))
      );
    });
    // An exit while a session is live means Safari died mid-run; during
    // startup the race below reports it instead.
    exited.catch(err => {
      if (sessionId) fail(String(err));
    });

    try {
      await Promise.race([waitForReady(), exited]);
      // Creating a session opens a new Safari window. Allow longer than the
      // default: Safari is slow to launch on a cold CI runner.
      const { value } = await webdriver(
        "POST",
        "/session",
        { capabilities: { alwaysMatch: { browserName: "safari" } } },
        30000
      );
      sessionId = value?.sessionId;
      if (!sessionId) throw new Error("safaridriver returned no sessionId");
      await webdriver("POST", `/session/${sessionId}/url`, { url });
      log.info("Safari launched at", url);
    } catch (err) {
      await fail(
        `Safari failed to start: ${err}. Is safaridriver enabled (sudo safaridriver --enable) and port ${PORT} free?`
      );
    }
  };

  this.on("kill", async done => {
    await cleanup();
    done();
  });
}

SafariLauncher.$inject = ["logger", "baseBrowserDecorator"];

module.exports = {
  "launcher:Safari": ["type", SafariLauncher],
};
