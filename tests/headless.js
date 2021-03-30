// @ts-check
/* eslint-env node */
const { exec } = require("child_process");
const http = require("http");
const serveHandler = require("serve-handler");

const port = 5000;
const timeout = 30; // seconds

describe("Headless (examples)", () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout * 1000;
    const server = http.createServer(serveHandler);
    server.listen(port);
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
});

function toCommand(src) {
  const command = `node ./tools/respec2html.js ${src}`;
  const options = ["-e", `--timeout ${timeout}`];
  return `${command} ${options.join(" ")}`;
}

function toExecutable(cmd) {
  return {
    get cmd() {
      return cmd;
    },
    run() {
      return new Promise((resolve, reject) => {
        const childProcess = exec(cmd, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
      });
    },
  };
}
