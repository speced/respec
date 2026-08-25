// @ts-check

const { exec } = require("child_process");
const http = require("http");
const serveHandler = require("serve-handler");

// Budget respec2html gets for processing the document, passed through as --timeout.
const processingTimeout = 30; // seconds

// Each spec spawns respec2html, which launches a browser before processing starts.
// tools/respecDocWriter.js gives that launch its own budget (LAUNCH_TIMEOUT, 120s) precisely
// because a cold runner can be slow, so the spec timeout has to cover launch AND processing.
// Setting it to the processing budget alone let jasmine kill the child mid-launch, which read
// as flakiness rather than a timeout.
const specTimeout = (120 + processingTimeout + 30) * 1000; // launch + processing + slack

describe("Headless (examples)", () => {
  /** @type {import("http").Server} */
  let server;
  /** @type {number} */
  let port;

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = specTimeout;
    server = http.createServer(serveHandler);
    // Port 0 asks the OS for a free port. A hardcoded port fails whenever something else is
    // already listening, and worse, a foreign server on it would let these specs pass while
    // serving someone else's files. Reporting a bind failure here also beats an uncaught
    // exception attributed to whichever spec happened to be running at the time.
    await new Promise((resolve, reject) => {
      const onError = error => reject(error);
      server.once("error", onError);
      server.listen(0, () => {
        server.off("error", onError);
        resolve(undefined);
      });
    });
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error(`Could not determine the test server's port: ${address}`);
    }
    port = address.port;
  });

  afterAll(async () => {
    if (!server) return;
    await new Promise(resolve => server.close(() => resolve(undefined)));
  });

  it("builds basic.html without errors", async () => {
    const exe = toExecutable(
      toCommand(`http://localhost:${port}/examples/basic.html`)
    );
    await expectAsync(exe.run()).toBeResolved();
  });

  it("builds basic.built.html without errors", async () => {
    const exe = toExecutable(
      toCommand(`http://localhost:${port}/examples/basic.built.html`)
    );
    await expectAsync(exe.run()).toBeResolved();
  });

  it("uses local respec version with --use-local", async () => {
    const exe = toExecutable(
      toCommand(`http://localhost:${port}/examples/basic.built.html`, {
        useLocal: true,
      })
    );
    const logs = await exe.run();
    expect(logs).toContain("Intercepted");
  });
});

function toCommand(src, { useLocal = false } = {}) {
  const command = `node ./tools/respec2html.js ${src}`;
  const options = ["-e", `--timeout ${processingTimeout}`, "--verbose"];
  if (useLocal) options.push("--use-local");
  return `${command} ${options.join(" ")}`;
}

function toExecutable(cmd) {
  return {
    get cmd() {
      return cmd;
    },
    run() {
      const env = { ...process.env, FORCE_COLOR: "0" };
      return new Promise((resolve, reject) => {
        exec(cmd, { env }, (err, _stdout, stderr) => {
          if (err) {
            return reject(err);
          }
          resolve(stderr);
        });
      });
    },
  };
}
