// Regression test for speced/respec#5436. Only Chrome reproduces the race, so this passes on
// other engines whether or not the fix is present.
const http = require("http");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

// A colour nothing else in the page uses, so its presence is unmistakably this stylesheet.
const DARK_MARKER = "rgb(11, 22, 33)";
const LIGHT = "rgb(255, 255, 255)";

describe("W3C - Style - dark stylesheet arriving late (#5436)", () => {
  let server;
  let browser;
  let port;

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
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

    browser = await puppeteer.launch({ headless: true });
  });

  afterAll(async () => {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  });

  it("stays light on a light OS when the dark stylesheet arrives late", async () => {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: "light" },
    ]);

    await page.setRequestInterception(true);
    page.on("request", request => {
      if (/dark\.css/.test(request.url())) {
        // Served locally so an offline machine cannot pass this by having no dark styles at
        // all, and delayed so the stylesheet lands between ReSpec's write and fixup.js's.
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
    await page.waitForSelector("input[name=color-scheme]");
    await new Promise(resolve => setTimeout(resolve, 3000));

    const bgColor = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bgColor).toBe(LIGHT);

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
