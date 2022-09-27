/* eslint-env node */
/* eslint-disable no-console */
const { execSync } = require("node:child_process");
const fs = require("fs");
const path = require("path");
const htmlCompare = require("html-compare");
const currentHtmlPath = path.join(__dirname, "testIndexStable.html");
const stableHtmlPath = path.join(__dirname, "testIndex.html");

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
  console.log("HTML fragments are different, changes:");
  result.changes.map(change => {
    console.log(`In node ${change.before.parentPath}:\n\t${change.message}`);
  });
} else {
  console.log("No changes found.");
}
