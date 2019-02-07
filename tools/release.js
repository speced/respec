#!/usr/bin/env node
"use strict";
const { Builder } = require("./builder");
const cmdPrompt = require("prompt");
const colors = require("colors");
const { exec } = require("child_process");
const fsp = require("fs-extra");
const loading = require("loading-indicator");
const path = require("path");
const MAIN_BRANCH = "develop";
const DEBUG = false;

// See: https://github.com/w3c/respec/issues/645
require("epipebomb")();

const loadOps = {
  frames: [
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌑",
    "🌚",
    "🌚",
    "🌚",
    "🌚",
    "🌒",
    "🌓",
    "🌔",
    "🌝",
    "🌝",
    "🌝",
    "🌝",
  ],
  delay: 100,
};

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
  l10n: "green",
});

function rel(f) {
  return path.join(__dirname, f);
}

function commandRunner(program) {
  return (cmd, options = { showOutput: false }) => {
    if (DEBUG) {
      console.log(
        colors.debug(`Pretending to run: ${program} ${colors.prompt(cmd)}`)
      );
      return Promise.resolve("");
    }
    return toExecPromise(`${program} ${cmd}`, { ...options, timeout: 200000 });
  };
}

const git = commandRunner("git");
const npm = commandRunner("npm");
const node = commandRunner("node");

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

  async askSwitchToBranch(from, to) {
    const promptOps = {
      description: `You're on branch ${colors.info(
        from
      )}. Switch to ${colors.info(to)}?`,
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y",
    };
    await this.askQuestion(promptOps);
    await git(`checkout ${to}`);
  },

  async askToPullBranch(branch) {
    const promptOps = {
      description: `Branch ${branch} needs a pull. Do you want me to do a pull?`,
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y",
    };
    await this.askQuestion(promptOps);
    await git(`pull origin ${branch}`);
  },

  async askUpToDateAndDev() {
    const promptOps = {
      description: "Are you up to date?",
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y",
    };
    try {
      await this.askQuestion(promptOps);
    } catch (err) {
      const warning = colors.warn(
        "🚨 Make sure to run `git up; git checkout develop`"
      );
      console.warn(warning);
      throw err;
    }
  },

  stylelizeCommits(commits) {
    const iconMap = new Map([
      ["a11y", "♿"],
      ["breaking change", "🚨"],
      ["chore", "🔨"],
      ["docs", "📖"],
      ["feat", "⭐️"],
      ["fix", "🐞"],
      ["l10n", "🌏"],
      ["perf", "🏎"],
      ["refactor", "💃"],
      ["style", "🖌"],
      ["test", "👍"],
    ]);
    const commitHints = /^l10n|^docs|^chore|^fix|^style|^refactor|^test|^feat|^breaking\schange/i;
    return (
      commits
        .split("\n")
        .filter(line => line)
        // drop the hash
        .map(line => line.substr(line.indexOf(" ") + 1))
        // colorize/iconify
        .map(line => {
          const match = commitHints.test(line)
            ? commitHints.exec(line)[0].toLowerCase()
            : "";
          let result = line;
          const icon = match && iconMap.has(match) ? iconMap.get(match) : "❓";
          // colorize
          if (match) {
            result = result.replace(match.toLowerCase(), colors[match](match));
          }
          return `  ${icon} ${result}`;
        })
        .sort()
        .join("\n")
    );
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
        if (/^feat/i.test(line)) {
          return "minor";
        }
        return "patch";
      })
      .reduce((collector, item) => collector.add(item), new Set());
    if (changes.has("major")) {
      major++;
      minor = 0;
      patch = 0;
    } else if (changes.has("minor")) {
      minor++;
      patch = 0;
    } else {
      patch++;
    }
    return `${major}.${minor}.${patch}`;
  },

  async askBumpVersion() {
    const version = await Builder.getRespecVersion();
    const commits = await git(
      "log `git describe --tags --abbrev=0`..HEAD --oneline"
    );
    if (!commits) {
      console.log(colors.warn("😢  No commits. Nothing to release."));
      return process.exit(1);
    }
    const stylizedCommits = this.stylelizeCommits(commits);

    console.log(`\n 🎁  Commits since ${version} \n`);

    console.log(stylizedCommits, "\n");
    if (!version) {
      throw new Error("Version string not found in package.json");
    }
    const newVersion = this.suggestSemVersion(commits, version);
    const packagePath = rel("../package.json");
    const data = await fsp.readFile(packagePath, "utf8");
    const pack = JSON.parse(data);
    const promptOps = {
      description: `Current version is ${version}, bump it to`,
      pattern: /^\d+\.\d+\.\d+$/i,
      message: "Values must be x.y.z",
      default: newVersion,
    };
    pack.version = await this.askQuestion(promptOps);
    await fsp.writeFile(
      packagePath,
      `${JSON.stringify(pack, null, 2)}\n`,
      "utf8"
    );
    return pack.version;
  },

  async askBuildAddCommitMergeTag() {
    const promptOps = {
      description: "Are you ready to build, add, commit, merge, and tag",
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y",
    };
    return await this.askQuestion(promptOps);
  },

  async askPushAll() {
    const promptOps = {
      description: `${colors.important(
        "🔥  Ready to make this live? 🔥"
      )}  (last chance!)`,
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y",
    };
    return await this.askQuestion(promptOps);
  },
};

function toExecPromise(cmd, { timeout, showOutput }) {
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
    if (showOutput) {
      proc.stderr.pipe(process.stderr);
      proc.stdout.pipe(process.stdout);
    }
    proc.on("close", number => {
      if (number === 1) {
        process.exit(1);
      }
    });
  });
}

async function getBranchState() {
  const local = await git("rev-parse @");
  const remote = await git("rev-parse @{u}");
  const base = await git("merge-base @ @{u}");
  let result = "";
  switch (local) {
    case remote:
      result = "up-to-date";
      break;
    case base:
      result = "needs a pull";
      break;
    default:
      result = remote === base ? "needs to push" : "has diverged";
  }
  return result;
}

async function getCurrentBranch() {
  const branch = await git("rev-parse --abbrev-ref HEAD");
  return branch.trim();
}

class Indicator {
  constructor(msg) {
    this.message = msg;
  }
  show() {
    this.id = loading.start(this.message, loadOps);
  }
  hide() {
    loading.stop(this.id);
  }
}

const indicators = new Map([
  [
    "remote-update",
    new Indicator(colors.info(" Performing Git remote update... 📡 ")),
  ],
  [
    "build-merge-tag",
    new Indicator(
      colors.info(
        " Building, adding, commiting, merging, and tagging ReSpec... ⚒"
      )
    ),
  ],
  [
    "push-to-server",
    new Indicator(colors.info(" Pushing everything back to server... 📡")),
  ],
]);

const run = async () => {
  const initialBranch = await getCurrentBranch();
  try {
    // 1. Confirm maintainer is on up-to-date and on the develop branch ()
    indicators.get("remote-update").show();
    await git("remote update");
    indicators.get("remote-update").hide();
    if (initialBranch !== MAIN_BRANCH) {
      await Prompts.askSwitchToBranch(initialBranch, MAIN_BRANCH);
    }
    const branchState = await getBranchState();
    switch (branchState) {
      case "needs a pull":
        await Prompts.askToPullBranch(MAIN_BRANCH);
        break;
      case "up-to-date":
        break;
      case "needs to push":
        throw new Error(
          `Found unpushed commits on "${MAIN_BRANCH}" branch! Can't proceed.`
        );
      default:
        throw new Error(`Your branch is not up-to-date. It ${branchState}.`);
    }
    // 2. Bump the version in `package.json`.
    const version = await Prompts.askBumpVersion();
    await Prompts.askBuildAddCommitMergeTag();
    // 1.1 npm upgrade
    console.log(colors.info(" Performing npm upgrade... 📦"));
    await npm("update", { showOutput: true });

    // Updates could trash our previouls protection, so reprotect.
    console.log(colors.info(" Running snyk-protect... 🐺"));
    await npm("run snyk-protect", { showOutput: true });

    // 3. Run the build script (node tools/build-w3c-common.js).
    indicators.get("build-merge-tag").show();
    await npm("run build:components");
    await Builder.build({ name: "w3c-common" });
    console.log(colors.info(" Making sure the generated version is ok... 🕵🏻"));
    await node(
      `./tools/respec2html.js -e --timeout 30 --src file:///${__dirname}/../examples/basic.built.html --out /dev/null`,
      { showOutput: true }
    );
    console.log(colors.info(" Build Seems good... ✅"));
    // 4. Commit your changes (git commit -am v3.x.y)
    await git(`commit -am v${version}`);
    // 5. Merge to gh-pages (git checkout gh-pages; git merge develop)
    await git("checkout gh-pages");
    await git("pull origin gh-pages");
    await git("merge develop");
    await git("checkout develop");
    // 6. Tag the release (git tag v3.x.y)
    await git(`tag -m v${version} v${version}`);
    indicators.get("build-merge-tag").hide();
    await Prompts.askPushAll();
    indicators.get("push-to-server").show();
    await git("push origin develop");
    await git("push origin gh-pages");
    await git("push --tags");
    indicators.get("push-to-server").hide();
    console.log(colors.info(" Publishing to npm... 📡"));
    await npm("publish", { showOutput: true });
    // publishing generates a new build, which we don't want
    // on develop branch
    await git("checkout builds");
    if (initialBranch !== MAIN_BRANCH) {
      await Prompts.askSwitchToBranch(MAIN_BRANCH, initialBranch);
    }
  } catch (err) {
    console.error(colors.red(`\n☠  ${err.message}`));
    const currentBranch = getCurrentBranch();
    if (initialBranch !== currentBranch) {
      await git(`checkout ${initialBranch}`);
    }
    process.exit(1);
  }
};

run()
  .then(() => process.exit(0))
  .catch(err => console.error(err.stack));
