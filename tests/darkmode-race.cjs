// Regression test for speced/respec#5436. Only Chrome reproduces the race, so this passes on
// other engines whether or not the fix is present.
const http = require("http");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

// A color nothing else in the page uses, so its presence is unmistakably this stylesheet.
const DARK_MARKER = "rgb(11, 22, 33)";
const LIGHT = "rgb(255, 255, 255)";
// Cold CI runners need far longer than puppeteer's 30s default to start Chrome, which
// tools/respecDocWriter.js and tests/headless.cjs both budget 120s for.
const LAUNCH_TIMEOUT = 120000;

describe("W3C - Style - dark stylesheet arriving late (#5436)", () => {
  let server;
  let browser;
  let port;

  beforeAll(async () => {
    // Launch plus processing plus slack, the same shape tests/headless.cjs uses.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = LAUNCH_TIMEOUT + 60000;
    server = http.createServer((req, res) => {
      if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Race Condition Test</title>
              <script>
                var respecConfig = {
                  specStatus: "ED",
                  shortName: "x",
                  group: "webapps",
                  editors: [{name: "T"}],
                  xref: false
                };
              </script>
              <script src="/builds/respec-w3c.js"></script>
            </head>
            <body>
              <section id="abstract"><p>Abstract</p></section>
              <section id="sotd"><p>SOTD</p></section>
            </body>
          </html>
        `);
      } else {
        const filePath = path.join(__dirname, "../", req.url.split("?")[0]);
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end("Not Found");
            return;
          }
          const ext = path.extname(filePath);
          const contentTypes = {
            ".js": "text/javascript",
            ".css": "text/css",
          };
          res.writeHead(200, {
            "Content-Type": contentTypes[ext] || "text/plain",
          });
          res.end(data);
        });
      }
    });

    await new Promise(resolve => {
      server.listen(0, () => {
        port = server.address().port;
        resolve();
      });
    });

    browser = await puppeteer.launch({
      headless: true,
      timeout: LAUNCH_TIMEOUT,
    });
  });

  afterAll(async () => {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  });

  // Loads the document with the dark stylesheet held back, so it lands between ReSpec's write
  // and fixup.js's, and returns what the body settled on.
  async function settled(scheme) {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: scheme },
    ]);

    await page.setRequestInterception(true);
    page.on("request", request => {
      if (/dark\.css/.test(request.url())) {
        // These bytes are local and known, so a dark stylesheet that never arrived cannot be
        // mistaken for a correct light result. fixup.js and the maturity stylesheet still come
        // from www.w3.org, as they do across this suite, so this does need the network.
        setTimeout(() => {
          request.respond({
            status: 200,
            contentType: "text/css",
            body: `body { background-color: ${DARK_MARKER} !important; }`,
          });
        }, 500);
      } else {
        request.continue();
      }
    });

    await page.goto(`http://localhost:${port}/`);
    // fixup.js builds this control, so its presence means both scripts have run.
    await page.waitForSelector("input[name=color-scheme]");
    await new Promise(resolve => setTimeout(resolve, 3000));
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    return { page, bg };
  }

  it("stays light on a light system when the dark stylesheet arrives late", async () => {
    // Only this direction is pinned. The reported dark-system case passes on main in 5 of 5
    // runs here, so a spec for it would never fail without the fix; reproducing that direction
    // needs the live stylesheet and still only fails about 19 times in 20.
    const { page, bg } = await settled("light");
    expect(bg).toBe(LIGHT);

    // A light result could also mean the stylesheet never loaded, so prove it can apply.
    await page.evaluate(() => {
      document.querySelector("input[name=color-scheme][value=dark]")?.click();
    });
    await page.waitForFunction(
      expected => getComputedStyle(document.body).backgroundColor === expected,
      { timeout: 5000 },
      DARK_MARKER
    );
  });
});
