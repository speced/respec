#!/usr/bin/env node
// @ts-check
const { Builder } = require("./builder.js");
const cmdPrompt = require("prompt");
const colors = require("colors");
const { exec } = require("child_process");
const loading = require("loading-indicator");
const MAIN_BRANCH = "develop";
const DEBUG = false;
const vnu = require("vnu-jar");
const path = require("path");
const os = require("os");

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

/** @param {string} program */
function commandRunner(program) {
  /**
   * @param {string} cmd
   * @param {{showOutput: boolean}} [options ]
   */
  const runner = (cmd, options = { showOutput: false }) => {
    console.log(colors.cyan(`Run: ${program} ${colors.grey(cmd)}`));
    if (DEBUG) {
      return Promise.resolve("");
    }
    return toExecPromise(`${program} ${cmd}`, { ...options, timeout: 200000 });
  };
  return runner;
}

const git = commandRunner("git");
const npm = commandRunner("npm");
const node = commandRunner("node");
const validator = commandRunner(`java -jar ${vnu}`);

cmdPrompt.start();

const Prompts = {
  async askQuestion(promptOps) {
    const res = await cmdPrompt.get(promptOps);
    // @ts-ignore
    if (res.question.toLowerCase() === "n") {
      throw new Error("🙅  user declined.");
    }
    return res.question;
  },

  /**
   * @param {string} from
   * @param {string} to
   */
  async askSwitchToBranch(from, to) {
    const promptOps = {
      description: `You're on branch ${colors.green(
        from
      )}. Switch to ${colors.green(to)}?`,
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y",
    };
    await this.askQuestion(promptOps);
    await git(`checkout ${to}`);
  },

  /** @param {string} branch */
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
      const warning = colors.yellow(
        "🚨 Make sure to run `git up; git checkout develop`"
      );
      console.warn(warning);
      throw err;
    }
  },

  /** @param {string} commits */
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
    const commitHints =
      /^l10n|^docs|^chore|^fix|^style|^refactor|^test|^feat|^breaking\schange/i;
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
          const icon =
            match && iconMap.has(match.toLowerCase())
              ? iconMap.get(match)
              : "❓";
          // colorize
          if (match) {
            result = result.replace(match.toLowerCase(), colors.green(match));
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
   * @param {string} commits
   * @param {string} version
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
    const rawVersion = await npm("view respec version");
    const version = rawVersion.trim();
    const latestTag = await git("describe --tags --abbrev=0");
    const commits = await git(`log ${latestTag.trim()}..HEAD --oneline`);
    if (!commits) {
      throw new Error("😢  No commits. Nothing to release.");
    }
    const stylizedCommits = this.stylelizeCommits(commits);

    console.log(`\n 🎁  Commits since ${version} \n`);

    console.log(stylizedCommits, "\n");
    if (!version) {
      throw new Error("Version string not found in package.json");
    }
    const computedVersion = this.suggestSemVersion(commits, version);
    const promptOps = {
      description: `Current version is ${version}, bump it to`,
      pattern: /^\d+\.\d+\.\d+$/i,
      message: "Values must be x.y.z",
      default: computedVersion,
    };
    const newVersion = await this.askQuestion(promptOps);
    return newVersion;
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
      description: `${colors.red(
        "🔥  Ready to make this live? 🔥"
      )}  (last chance!)`,
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y",
    };
    return await this.askQuestion(promptOps);
  },
};

/**
 *
 * @param {string} cmd
 * @param {{ timeout: number, showOutput: boolean }} options
 * @returns {Promise<string>}
 */
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
    proc.on("error", err => reject(err));
    proc.on("close", number => {
      if (number === 1) {
        reject(new Error("Abnormal termination"));
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
    new Indicator(colors.green(" Performing Git remote update... 📡 ")),
  ],
  [
    "push-to-server",
    new Indicator(colors.green(" Pushing everything back to server... 📡")),
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
    await npm(`version ${version} -m "v${version}" --no-git-tag-version`);

    // 3. Run the build script (node tools/builder.js).
    await npm("run builddeps");
    for (const name of ["w3c", "geonovum", "dini", "aom"]) {
      await Builder.build({ name });
    }
    console.log(colors.green(" Making sure the generated version is ok... 🕵🏻"));
    const source = `file:///${__dirname}/../examples/basic.built.html`;
    const tempFile = path.join(os.tmpdir(), "index.html");
    await node(`./tools/respec2html.js -e --timeout 30 ${source} ${tempFile}`, {
      showOutput: true,
    });

    // Do HTML validation
    console.log(colors.green(" Making sure HTML validator is happy... 🕵🏻"));
    await validator(`--stdout ${tempFile}`);
    console.log(colors.green(" Build Seems good... ✅"));

    // 4. Commit your changes
    await git("add builds package.json package-lock.json");
    await git(`commit -m "v${version}"`);
    await git(`tag "v${version}"`);

    // 5. Merge to gh-pages (git checkout gh-pages; git merge develop)
    await git("checkout gh-pages");
    await git("pull origin gh-pages");
    await git("merge develop");
    await git("checkout develop");
    await Prompts.askPushAll();
    indicators.get("push-to-server").show();
    await git("push origin develop");
    await git("push origin gh-pages");
    await git("push --tags");
    indicators.get("push-to-server").hide();
    console.log(colors.green(" Publishing to npm... 📡"));
    await npm("publish", { showOutput: true });
    if (initialBranch !== MAIN_BRANCH) {
      await Prompts.askSwitchToBranch(MAIN_BRANCH, initialBranch);
    }
  } catch (err) {
    console.error(colors.red(`\n☠  ${err.stack}`));
    const currentBranch = await getCurrentBranch();
    if (initialBranch !== currentBranch) {
      await git(`checkout ${initialBranch}`);
    }
    process.exit(1);
    return;
  }
  // all is good...
  process.exit(0);
};

run();
