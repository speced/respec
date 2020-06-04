// Based on
// https://addyosmani.com/blog/puppeteer-recipes/#devtools-trace-screenshots
const puppeteer = require("puppeteer");
const path = require("path");
const { tmpdir } = require("os");
const { writeFile, readFile, mkdir } = require("fs").promises;

const url = new URL(process.argv[2]).href;
const file = path.resolve(process.argv[3]);
const TRACE_FILE = path.join(tmpdir(), "trace.json");

const waitForFunction = async () => await document.respecIsReady;
takeScreenshots(waitForFunction).catch(console.error);

async function takeScreenshots(waitForFunction) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.tracing.start({ screenshots: true, path: TRACE_FILE });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.evaluate(waitForFunction);
  await page.waitFor(1000);
  await page.tracing.stop();

  const tracing = await readJSON(TRACE_FILE);
  const screenshots = tracing.traceEvents
    .filter(isScreenshot)
    .map(s => `<img src="data:image/png;base64,${s.args.snapshot}">`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, toHTML(screenshots), "utf8");
  console.log(`Saved ${screenshots.length} screenshots in ${file}`);
  await browser.close();
}

function isScreenshot(traceEvent) {
  return (
    traceEvent.cat === "disabled-by-default-devtools.screenshot" &&
    traceEvent.name === "Screenshot" &&
    typeof traceEvent.args !== "undefined" &&
    typeof traceEvent.args.snapshot !== "undefined"
  );
}

async function readJSON(file) {
  const text = await readFile(file, "utf8");
  return JSON.parse(text);
}

function toHTML(screenshots) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          img {
            display: block;
            outline: 1px solid #eee;
            margin-bottom: 4px;
          }
        </style>
      </head>
      <body>
        ${screenshots.join("\n")}
      </body>
    </html>
  `;
}
