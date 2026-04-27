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

const SAFARIDRIVER_PORT = Number.parseInt(
  process.env.SAFARIDRIVER_PORT || "4445",
  10
);
if (!Number.isFinite(SAFARIDRIVER_PORT)) {
  throw new Error(
    `Invalid SAFARIDRIVER_PORT: "${process.env.SAFARIDRIVER_PORT}"`
  );
}

/**
 * Simple W3C WebDriver client using Node's built-in http module.
 * @param {string} method
 * @param {string} path
 * @param {object} [body]
 * @param {number} [timeoutMs]
 */
function webdriver(method, path, body, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: "localhost",
        port: SAFARIDRIVER_PORT,
        path,
        method,
        timeout: timeoutMs,
        headers: {
          "Content-Type": "application/json",
          ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
        },
      },
      res => {
        let raw = "";
        res.on("data", chunk => (raw += chunk));
        res.on("end", () => {
          if (res.statusCode >= 400) {
            reject(
              new Error(
                `WebDriver ${method} ${path} → ${res.statusCode}: ${raw}`
              )
            );
            return;
          }
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve(raw);
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy(new Error(`WebDriver request timed out: ${method} ${path}`));
    });
    if (data) req.write(data);
    req.end();
  });
}

/**
 * Poll GET /status until safaridriver is accepting connections, or until
 * maxMs have elapsed.  Retries on ECONNREFUSED (driver not yet listening).
 * @param {number} [maxMs]
 */
function waitForReady(maxMs = 15000) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + maxMs;
    const attempt = () => {
      const req = http.request(
        {
          hostname: "localhost",
          port: SAFARIDRIVER_PORT,
          path: "/status",
          method: "GET",
          timeout: 2000,
        },
        res => {
          res.resume(); // drain the body
          if (res.statusCode < 400) {
            resolve();
          } else if (Date.now() < deadline) {
            setTimeout(attempt, 250);
          } else {
            reject(
              new Error(
                `safaridriver not ready after ${maxMs}ms (last status ${res.statusCode})`
              )
            );
          }
        }
      );
      req.on("error", err => {
        // ECONNREFUSED — driver not listening yet; keep retrying
        if (Date.now() < deadline) {
          setTimeout(attempt, 250);
        } else {
          reject(
            new Error(`safaridriver not ready after ${maxMs}ms: ${err.message}`)
          );
        }
      });
      req.on("timeout", () => req.destroy());
      req.end();
    };
    attempt();
  });
}

function SafariLauncher(logger, baseBrowserDecorator) {
  baseBrowserDecorator(this);

  const log = logger.create("launcher.Safari");
  let safariDriver = null;
  let sessionId = null;

  const cleanup = async () => {
    if (sessionId) {
      await webdriver("DELETE", `/session/${sessionId}`).catch(() => {});
      sessionId = null;
    }
    if (safariDriver) {
      safariDriver.kill();
      safariDriver = null;
    }
  };

  this._start = async url => {
    safariDriver = spawn("safaridriver", ["--port", String(SAFARIDRIVER_PORT)]);
    safariDriver.stderr.on("data", d =>
      log.debug("safaridriver:", d.toString().trim())
    );
    safariDriver.on("exit", async (code, signal) => {
      if (sessionId) {
        log.error(
          `safaridriver exited unexpectedly (code=${code} signal=${signal})`
        );
        // Null the process first so cleanup() doesn't try to kill an
        // already-dead process, then run full cleanup to tear down the session.
        safariDriver = null;
        await cleanup();
        this._done("failure");
      }
    });

    // Wait for safaridriver to be ready, but reject immediately if the
    // process errors or exits early (e.g. port in use, not enabled, invalid args).
    try {
      await new Promise((resolve, reject) => {
        let settled = false;
        const finish =
          fn =>
          (...args) => {
            if (settled) return;
            settled = true;
            fn(...args);
          };

        const onError = finish(err => {
          safariDriver.off("exit", onExit);
          log.error(
            `safaridriver failed to start — is it installed and enabled? Run: sudo safaridriver --enable (${err.message})`
          );
          reject(err);
        });
        const onExit = finish((code, signal) => {
          safariDriver.off("error", onError);
          reject(
            new Error(
              `safaridriver exited (code=${code} signal=${signal}) — port may be in use or safaridriver not enabled`
            )
          );
        });

        safariDriver.once("error", onError);
        safariDriver.once("exit", onExit);

        waitForReady(15000).then(
          finish(() => {
            safariDriver.off("error", onError);
            safariDriver.off("exit", onExit);
            resolve();
          }),
          finish(err => {
            safariDriver.off("error", onError);
            safariDriver.off("exit", onExit);
            reject(err);
          })
        );
      });
    } catch {
      await cleanup();
      this._done("failure");
      return;
    }

    try {
      // Create a W3C WebDriver session (opens a new Safari window).
      // Use a generous timeout: Safari can be slow to start on cold CI runners.
      const res = await webdriver(
        "POST",
        "/session",
        { capabilities: { alwaysMatch: { browserName: "safari" } } },
        30000
      );
      sessionId = res?.value?.sessionId;
      if (!sessionId) throw new Error("No sessionId from safaridriver");

      // Navigate to the karma URL
      await webdriver("POST", `/session/${sessionId}/url`, { url });
      log.info("Safari launched at", url);
    } catch (err) {
      log.error("Failed to start Safari:", err.message);
      await cleanup();
      this._done("failure");
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
