#!/usr/bin/env node

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

//See: https://github.com/w3c/respec/issues/645
require("epipebomb")();

colors.setTheme({
  "breaking change": "red",
  chore: "grey",
  data: "grey",
  debug: "cyan",
  docs: "grey",
  error: "red",
  feat: "green",
  fix: "red",
  help: "cyan",
  important: "red",
  info: "green",
  input: "grey",
  prompt: "grey",
  refactor: "green",
  style: "grey",
  test: "grey",
  verbose: "cyan",
  warn: "yellow",
});

function rel(f) {
  return path.join(__dirname, f);
}

function git(cmd) {
  if (DEBUG) {
    console.log(colors.debug(`Pretending to run: ${"git " + colors.prompt(cmd)}`));
    return Promise.resolve("");
  }
  return toExecPromise(`git ${cmd}`);
}

cmdPrompt.start();

const Prompts = {
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
    return async.task(function*() {
      const promptOps = {
        description: `You're on branch ${colors.info(from)}. Switch to ${colors.info(to)}?`,
        pattern: /^[yn]$/i,
        message: "Values can be 'y' or 'n'.",
        default: "y",
      };
      yield this.askQuestion(promptOps);
      yield git(`checkout ${to}`);
    }, this);
  },

  askToPullBranch(branch) {
    return async.task(function*() {
      const promptOps = {
        description: `Branch ${branch} needs a pull. Do you want me to do a pull?`,
        pattern: /^[yn]$/i,
        message: "Values can be 'y' or 'n'.",
        default: "y",
      };
      yield this.askQuestion(promptOps);
      yield git(`pull origin ${branch}`);
    }, this);
  },

  askUpToDateAndDev() {
    return async.task(function*() {
      const promptOps = {
        description: "Are you up to date?",
        pattern: /^[yn]$/i,
        message: "Values can be 'y' or 'n'.",
        default: "y",
      };
      try {
        yield this.askQuestion(promptOps);
      } catch (err) {
        const warning = colors.warn("🚨 Make sure to run `git up; git checkout develop`");
        console.warn(warning);
        throw err;
      }
    }, this);
  },

  stylelizeCommits(commits) {
    const iconMap = new Map([
      ["a11y", "♿"],
      ["breaking change", "🚨"],
      ["chore", "🔨"],
      ["docs", "📖"],
      ["feat", "⭐️"],
      ["fix", "🐞"],
      ["perf", "🏎"],
      ["refactor", "💃"],
      ["style", "🖌"],
      ["test", "👍"],
    ]);
    const commitHints = /^docs|^chore|^fix|^style|^refactor|^test|^feat|^breaking\schange/i;
    return commits
      .split("\n")
      .filter(line => line)
      // drop the hash
      .map(line => line.substr(line.indexOf(" ") + 1))
      // colorize/iconify
      .map(line => {
        const match = commitHints.test(line) ? commitHints.exec(line)[0].toLowerCase() : "";
        let result = line;
        let icon = (match && iconMap.has(match)) ? iconMap.get(match) : "❓";
        // colorize
        if (match) {
          result = result.replace(match.toLowerCase(), colors[match](match));
        }
        return `  ${icon} ${result}`;
      })
      .sort()
      .join("\n");
  },
  /**
   * Try to guess the version, based on the commits.
   * Given a version number MAJOR.MINOR.PATCH, increment the:
   *
   *  - MAJOR version when you make incompatible API changes,
   *  - MINOR version when you add functionality in a backwards-compatible manner, and
   *  - PATCH version when you make backwards-compatible bug fixes.
   */
  suggestSemVersion(commits, version) {
    let [major, minor, patch] = version
      .split(".")
      .map(value => parseInt(value));
    // We can guess at MINOR, based on feat. Otherwise, it's just a patch
    const changes = commits
      .split("\n")
      .filter(line => line)
      // drop the hash
      .map(line => line.substr(line.indexOf(" ") + 1))
      .map(line => {
        if (/^breaking/i.test(line)) {
          return "major";
        }
        if(/^feat/i.test(line)){
          return "minor";
        }
        return "patch";
      })
      .reduce(
        (collector, item) => collector.add(item), new Set()
      );
    if (changes.has("major")) {
      major++;
      minor = 0;
      patch = 0;
    } else if(changes.has("minor")) {
      minor++;
      patch = 0;       
    } else {
      patch++;
    }
    return `${major}.${minor}.${patch}`;
  },

  askBumpVersion() {
    return async.task(function*() {
      const version = yield Builder.getRespecVersion();
      const commits = yield git("log `git describe --tags --abbrev=0`..HEAD --oneline");
      const stylizedCommits = this.stylelizeCommits(commits);
      console.log(`\n ## Commits since ${version}`);
      console.log(stylizedCommits, "\n");
      if (!version) {
        throw new Error("Version string not found in package.json");
      }
      const newVersion = this.suggestSemVersion(commits, version);
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
    return async.task(function*() {
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
    return async.task(function*() {
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

function toExecPromise(cmd, timeout) {
  if (!timeout) {
    timeout = 40000;
  }
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Command took too long: ${cmd}`));
      proc.kill("SIGTERM");
    }, timeout);
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
  return async.task(function*() {
    const local = yield git(`rev-parse @`);
    const remote = yield git(`rev-parse @{u}`);
    const base = yield git(`merge-base @ @{u}`);
    let result = "";
    switch (local) {
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

function getCurrentBranch() {
  return async.task(function*() {
    const branch = yield git(`rev-parse --abbrev-ref HEAD`);
    return branch.trim();
  });
}

async.task(function*() {
  const initialBranch = yield getCurrentBranch();
  try {
    // 1. Confirm maintainer is on up-to-date and on the develop branch ()
    console.log(colors.info(" 📡  Performing Git remote update..."));
    yield git(`remote update`);
    if (initialBranch !== MAIN_BRANCH) {
      yield Prompts.askSwitchToBranch(initialBranch, MAIN_BRANCH);
    }
    const branchState = yield getBranchState();
    switch (branchState) {
      case "needs a pull":
        yield Prompts.askToPullBranch(MAIN_BRANCH);
        break;
      case "up-to-date":
        break;
      case "needs to push":
        var err = `Found unpushed commits on "${MAIN_BRANCH}" branch! Can't proceed.`;
        throw new Error(err);
      default:
        throw new Error(`Your branch is not up-to-date. It ${branchState}.`);
    }
    // 2. Bump the version in `package.json`.
    const version = yield Prompts.askBumpVersion();
    yield Prompts.askBuildAddCommitMergeTag();
    // 3. Run the build script (node tools/build-w3c-common.js).
    yield w3cBuild.buildW3C("latest");
    // 4. Commit your changes (git commit -am v3.x.y)
    yield git(`commit -am v${version}`);
    // 5. Merge to gh-pages (git checkout gh-pages; git merge develop)
    yield git(`checkout gh-pages`);
    yield git(`pull origin gh-pages`);
    yield git(`merge develop`);
    yield git(`checkout develop`);
    // 6. Tag the release (git tag v3.x.y)
    yield git(`tag -m v${version} v${version}`);
    yield Prompts.askPushAll();
    console.log(colors.info(" 📡  Pushing everything back to server..."));
    yield git("push origin develop");
    yield git("push origin gh-pages");
    yield git("push --tags");
    console.log(colors.info(" 📡  Publishing to npm..."));
    // We give npm publish 2 minute to time out, as it can be slow.
    yield toExecPromise("npm publish", 120000);
    if (initialBranch !== MAIN_BRANCH) {
      yield Prompts.askSwitchToBranch(MAIN_BRANCH, initialBranch);
    }
  } catch (err) {
    console.error(colors.red(`\n ☠️ ${err.message}`));
    const currentBranch = getCurrentBranch();
    if (initialBranch !== currentBranch) {
      yield git(`checkout ${initialBranch}`);
    }
    process.exit(1);
  }
}).then(
  () => process.exit(0)
).catch(
  err => console.error(err.stack)
);
