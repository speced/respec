/* eslint-env node */
/* eslint-disable no-console */
const { execSync } = require("node:child_process");
const fs = require("fs");
const path = require("path");
const htmlCompare = require("html-compare");
const currentHtmlPath = path.join(__dirname, "testIndexStable.html");
const stableHtmlPath = path.join(__dirname, "testIndex.html");
const logFilePath = path.join(__dirname, "./html-test.log");
const writeStream = fs.createWriteStream(logFilePath, { flags: "w" });
let writeToLog = false;

const args = process.argv.slice(2);
if (args[0] === "--createLog") {
  writeToLog = true;
}

// create snapshot
execSync(
  "npx respec --localhost --src examples/logius-profile/logius-voorbeeld.html --out tests/testIndex.html",
  (error, stdout, stderr) => {
    console.log(error);
    console.log(stdout);
    console.log(stderr);
  }
);

// load old snapshot
const stable = fs.readFileSync(stableHtmlPath, "utf8");

// load current snapshot
const current = fs.readFileSync(currentHtmlPath, "utf8");

const result = htmlCompare.compare(stable, current);
if (result.different) {
  if (writeToLog) {
    writeStream.write("HTML fragments are different, changes:" + "\n");
    result.changes.map(change => {
      // htmlCompare adds ESC[39m format colors to the text, regx is to make the file readable in the log file
      writeStream.write(
        `${`${`In node ${change.before.parentPath}:\n\t${change.message}`.replace(
          // eslint-disable-next-line no-control-regex
          /\u001b[^m]*?m/g,
          ""
        )}\n`}\n`
      );
    });
    console.log(`Log file written to: ${logFilePath}`);
  } else {
    console.log("HTML fragments are different, changes:");
    result.changes.map(change => {
      console.log(`In node ${change.before.parentPath}:\n\t${change.message}`);
    });
  }
} else {
  console.log("No changes found.");
}
