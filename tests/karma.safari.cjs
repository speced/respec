// @ts-check
/* eslint-env node */
/**
 * Minimal karma launcher for Safari using safaridriver (W3C WebDriver).
 * Avoids the old karma-safari-launcher redirect.html hack and the broken
 * wd@1.x dependency of @onslip/karma-safari-launcher on Node 24+.
 *
 * Requires safaridriver to be enabled once:
 *   sudo safaridriver --enable
 */

const { spawn } = require("child_process");
const http = require("http");

const SAFARIDRIVER_PORT = 4445;

/** Simple W3C WebDriver client using Node's built-in http module. */
function webdriver(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: "localhost",
        port: SAFARIDRIVER_PORT,
        path,
        method,
        headers: {
          "Content-Type": "application/json",
          ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
        },
      },
      res => {
        let raw = "";
        res.on("data", chunk => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve(raw);
          }
        });
      }
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function SafariLauncher(logger, baseBrowserDecorator) {
  baseBrowserDecorator(this);

  const log = logger.create("launcher.Safari");
  let safariDriver = null;
  let sessionId = null;

  this._start = async url => {
    // Start safaridriver
    safariDriver = spawn("safaridriver", ["--port", String(SAFARIDRIVER_PORT)]);
    safariDriver.stderr.on("data", d =>
      log.debug("safaridriver:", d.toString().trim())
    );

    // Wait for safaridriver to be ready
    await new Promise(r => setTimeout(r, 500));

    try {
      // Create a W3C WebDriver session (opens a new Safari window)
      const res = await webdriver("POST", "/session", {
        capabilities: { alwaysMatch: { browserName: "safari" } },
      });
      sessionId = res?.value?.sessionId;
      if (!sessionId) throw new Error("No sessionId from safaridriver");

      // Navigate to the karma URL
      await webdriver("POST", `/session/${sessionId}/url`, { url });
      log.info("Safari launched at", url);
    } catch (err) {
      log.error("Failed to start Safari:", err.message);
      this._done("failure");
    }
  };

  this.on("kill", async done => {
    if (sessionId) {
      await webdriver("DELETE", `/session/${sessionId}`).catch(() => {});
      sessionId = null;
    }
    if (safariDriver) {
      safariDriver.kill();
      safariDriver = null;
    }
    done();
  });
}

SafariLauncher.$inject = ["logger", "baseBrowserDecorator"];

module.exports = {
  "launcher:Safari": ["type", SafariLauncher],
};
