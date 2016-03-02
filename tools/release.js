#!/usr/local/bin/node

"use strict";
const cmdPrompt = require("prompt");
const async = require("marcosc-async");
const fsp = require("fs-promise");
const path = require("path");
const w3cBuild = require("./build-w3c-common");
const Builder = require("./builder").Builder;
const exec = require("child_process").exec;
const colors = require("colors");
const MAIN_BRANCH = "develop";
let DEBUG = false;

colors.setTheme({
  data: "grey",
  debug: "cyan",
  error: "red",
  help: "cyan",
  info: "green",
  important: "red",
  input: "grey",
  prompt: "grey",
  verbose: "cyan",
  warn: "yellow",
});
function rel(f) {
  return path.join(__dirname, f);
}

function git(cmd) {
  if(DEBUG){
    console.log(colors.debug(`Pretending to run: ${"git " + colors.prompt(cmd)}`));
    return Promise.resolve();
  }
  return toExecPromise(`git ${cmd}`);
}

cmdPrompt.start();

const Promps = {
  askQuestion(promptOps) {
    return new Promise((resolve, reject) => {
      cmdPrompt.get(promptOps, (err, res) => {
        if (err) {
          return reject(new Error(err));
        }
        if (res.question.toLowerCase() === "n") {
          return reject(new Error("🙅  user declined."));
        }
        resolve(res.question);
      });
    });
  },

  askSwitchToBranch(from, to) {
    return async.task(function * () {
      const promptOps = {
        description: `You're on branch ${colors.info(from)}. Switch to ${colors.info(to)}?`,
        pattern: /^[yn]$/i,
        message: "Values can be 'y' or 'n'.",
        default: "y",
      };
      return yield this.askQuestion(promptOps);
    }, this);
  },

  askUpToDateAndDev() {
    return async.task(function * () {
      const promptOps = {
        description: "Are you up to date?",
        pattern: /^[yn]$/i,
        message: "Values can be 'y' or 'n'.",
        default: "y",
      };
      try {
        yield this.askQuestion(promptOps);
      } catch (err) {
        const warning = colors.warn("Make sure to run `git up; git checkout develop`");
        console.warn(warning);
        throw err;
      }
    }, this);
  },

  askBumpVersion() {
    return async.task(function * () {
      const version = yield Builder.getRespecVersion();
      if (!version) {
        throw new Error("Version string not found in package.json");
      }
      const newVersion = version.split(".")
        .map((value, index) => (index === 2) ? parseInt(value) + 1 : value)
        .join(".");
      const packagePath = rel("../package.json");
      const data = yield fsp.readFile(packagePath, "utf8");
      const pack = JSON.parse(data);
      const promptOps = {
        description: `Current version is ${version}, bump it to`,
        pattern: /^\d+\.\d+\.\d+$/i,
        message: "Values must be x.y.z",
        default: newVersion
      };
      pack.version = yield this.askQuestion(promptOps);
      yield fsp.writeFile(packagePath, JSON.stringify(pack, null, 2) + "\n", "utf8");
      return pack.version;
    }, this);
  },

  askBuildAddCommitMergeTag() {
    return async.task(function * () {
      const promptOps = {
        description: "Are you ready to build, add, commit, merge, and tag",
        pattern: /^[yn]$/i,
        message: "Values can be 'y' or 'n'.",
        default: "y",
      };
      return yield this.askQuestion(promptOps);
    }, this);
  },

  askPushAll() {
    return async.task(function * () {
      const promptOps = {
        description: `${colors.important("🔥 Ready to make this live? 🔥")}  (last chance!)`,
        pattern: /^[yn]$/i,
        message: "Values can be 'y' or 'n'.",
        default: "y",
      };
      return yield this.askQuestion(promptOps);
    }, this);
  }
};

function toExecPromise(cmd) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Command took too long: ${cmd}`));
      proc.kill("SIGTERM");
    }, 20000);
    const proc = exec(cmd, (err, stdout) => {
      clearTimeout(id);
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

function getBranchState() {
  return async.task(function * () {
    const local = yield git(`rev-parse @`);
    const remote = yield git(`rev-parse @{u}`);
    const base = yield git(`merge-base @ @{u}`);
    let result = "";
    switch(local){
      case remote:
        result = "up-to-date";
        break;
      case base:
        result = "needs a pull";
        break;
      default:
        result = (remote === base) ? "needs to push" : "has diverged";
    }
    return result;
  });
}

async.task(function * () {
  try {
    // 1. Confirm maintainer is on up-to-date and on the develop branch ()
    console.log(colors.info(" 📡  Performing Git remote update..."));
    //yield git(`remote update`);
    const currentBranch = (yield git(`rev-parse --abbrev-ref HEAD`)).trim();
    if (currentBranch !== MAIN_BRANCH) {
      yield Promps.askSwitchToBranch(currentBranch, MAIN_BRANCH);
    }
    const branchState = yield getBranchState();
    if (branchState !== "up-to-date") {
      throw new Error("Your branch is not up-to-date. It ${branchState}.");
    }
    // 2. Bump the version in `package.json`.
    const version = yield Promps.askBumpVersion();
    const file = rel(`../builds/respec-w3c-common-${version}.js`);
    //yield Promps.askBuildAddCommitMergeTag();
    // 3. Run the build script (node tools/build-w3c-common.js).
    yield w3cBuild.buildW3C("latest", version);
    // 4. Add the new build (git add builds/respec-w3c-common-3.x.y.js).
    yield git(`add ${file} ${file}.map`);
    // 5. Commit your changes (git commit -am v3.x.y)
    yield git(`commit -am v${version}`);
    // 6. Merge to gh-pages (git checkout gh-pages; git merge develop)
    yield git(`checkout gh-pages`);
    yield git(`merge develop`);
    yield git(`checkout develop`);
    // 7. Tag the release (git tag v3.x.y)
    yield git(`tag -m v${version} v${version}`);
    yield Promps.askPushAll();
    console.log(colors.info(" 📡  Pushing everything back to server..."));
    yield git("push develop");
    yield git("push gh-pages");
    yield git("push --tags");
    console.log(colors.info(" 📡  Publishing to npm..."));
    yield toExecPromise("npm publish");
  } catch (err) {
    process.exit(1);
  }
}).then(
  () => process.exit(0)
).catch(
  err => console.error(err)
);
