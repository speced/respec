#!/usr/bin/env node
// @ts-check
const { Builder } = require("./builder.cjs");
const cmdPrompt = require("prompt");
const { styleText } = require("node:util");
const { execFile, spawn } = require("child_process");
const loading = require("loading-indicator");
const fs = require("fs");
const DEBUG = false;
const vnu = require("vnu-jar");
const path = require("path");
const os = require("os");

// See: https://github.com/speced/respec/issues/645
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

/**
 * @param {string} file
 * @param {string[]} [baseArgs]
 */
function commandRunner(file, baseArgs = []) {
  /**
   * @param {string[]} cmd
   * @param {{showOutput: boolean}} [options]
   */
  const runner = (cmd, options = { showOutput: false }) => {
    const args = [...baseArgs, ...cmd];
    console.log(
      styleText("cyan", `Run: ${file} ${styleText("grey", args.join(" "))}`)
    );
    if (DEBUG) {
      return Promise.resolve("");
    }
    return toExecFilePromise(file, args, { ...options, timeout: 200000 });
  };
  return runner;
}

const git = commandRunner("git");
const npm = commandRunner("npm");
const pnpm = commandRunner("pnpm");
const node = commandRunner("node");
const validator = commandRunner("java", ["-jar", vnu]);

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
      description: `You're on branch ${styleText(
        "green",
        from
      )}. Switch to ${styleText("green", to)}?`,
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y",
    };
    await this.askQuestion(promptOps);
    await git(["checkout", to]);
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
    await git(["pull", "origin", branch]);
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
      const warning = styleText(
        "yellow",
        "🚨 Make sure to run `git checkout main` and reset any changes."
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
            result = result.replace(
              match.toLowerCase(),
              styleText("green", match)
            );
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
        if (/^breaking/i.test(line) || /^[a-z]+(\(.+\))?!:.+/i.test(line)) {
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
    const rawVersion = await npm(["view", "respec", "version"]);
    const version = rawVersion.trim();
    const latestTag = await git(["describe", "--tags", "--abbrev=0"]);
    const commits = await git([
      "log",
      `${latestTag.trim()}..HEAD`,
      "--oneline",
    ]);
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
      description: `${styleText(
        "red",
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
 * @param {string} file
 * @param {string[]} args
 * @param {{ timeout: number, showOutput: boolean }} options
 * @returns {Promise<string>}
 */
function toExecFilePromise(file, args, { timeout, showOutput }) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Command took too long: ${file} ${args.join(" ")}`));
      proc.kill("SIGTERM");
    }, timeout);
    const proc = execFile(file, args, (err, stdout) => {
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
  const local = await git(["rev-parse", "@"]);
  const remote = await git(["rev-parse", "@{u}"]);
  const base = await git(["merge-base", "@", "@{u}"]);
  let result;
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
  const branch = await git(["rev-parse", "--abbrev-ref", "HEAD"]);
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

async function preflight() {
  console.log(styleText("cyan", "\n  Preflight checks\n"));
  const errors = [];

  // Java (needed for vnu HTML validator)
  try {
    await toExecFilePromise("java", ["-version"], {
      timeout: 10000,
      showOutput: false,
    });
    console.log(styleText("green", "  ✓ Java runtime"));
  } catch {
    errors.push(
      "Java runtime not found (required by vnu HTML validator).\n" +
        "    Install: brew install java\n" +
        "    Then:    sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk" +
        " /Library/Java/JavaVirtualMachines/openjdk.jdk"
    );
  }

  // Puppeteer Chrome (needed for respec2html)
  try {
    const chromePath = await toExecFilePromise(
      "node",
      [
        "-e",
        'import("puppeteer").then(async p => process.stdout.write(await p.executablePath()))',
      ],
      { timeout: 15000, showOutput: false }
    );
    if (!fs.existsSync(chromePath.trim())) {
      throw new Error("Chrome binary missing");
    }
    console.log(styleText("green", "  ✓ Puppeteer Chrome"));
  } catch {
    errors.push(
      "Puppeteer Chrome not found (required by respec2html).\n" +
        "    Install: npx puppeteer browsers install chrome"
    );
  }

  // GitHub CLI (needed for creating GitHub Releases that trigger W3C CDN sync)
  try {
    await toExecFilePromise("gh", ["auth", "status"], {
      timeout: 10000,
      showOutput: false,
    });
    console.log(styleText("green", "  ✓ GitHub CLI (gh)"));
  } catch {
    errors.push(
      "GitHub CLI not found or not authenticated (required for creating releases).\n" +
        "    Install: brew install gh\n" +
        "    Then:    gh auth login"
    );
  }

  // npm auth. This is the credential that actually expires, and `npm publish` is the LAST step of
  // the release, so without this check the token is discovered to be stale only after main, gh-pages
  // and the tag have all been pushed, leaving the release half-done and needing manual recovery.
  // The registry comes from publishConfig so this probe and the publish below cannot target
  // different registries: a bare `npm whoami` (or a bare publish) would use the machine default,
  // which may be an internal mirror.
  const NPM_REGISTRY = require("../package.json").publishConfig?.registry;
  if (!NPM_REGISTRY) {
    errors.push(
      "package.json has no publishConfig.registry, so `npm publish` would target whatever\n" +
        "    registry this machine defaults to. Set it before releasing."
    );
  } else {
    try {
      const who = await toExecFilePromise(
        "npm",
        ["whoami", "--registry", NPM_REGISTRY],
        { timeout: 20000, showOutput: false }
      );
      console.log(styleText("green", `  ✓ npm auth (${who.trim()})`));
    } catch {
      errors.push(
        "npm is not authenticated for publishing (the token expires periodically).\n" +
          `    Check: npm whoami --registry ${NPM_REGISTRY}\n` +
          `    Fix:   npm login --registry ${NPM_REGISTRY}`
      );
    }
  }

  // origin/gh-pages must exist and be unambiguous
  try {
    const branches = await git(["branch", "-r", "--list", "*/gh-pages"]);
    const remotes = branches
      .trim()
      .split("\n")
      .filter(line => line.trim());
    const hasOrigin = remotes.some(r => r.trim() === "origin/gh-pages");
    if (!hasOrigin) {
      errors.push(
        "origin/gh-pages not found. The release requires it.\n" +
          "    Fix: git fetch origin gh-pages"
      );
    } else if (remotes.length > 1) {
      const defaultRemote = await git([
        "config",
        "checkout.defaultRemote",
      ]).catch(() => "");
      if (!defaultRemote.trim()) {
        errors.push(
          `"gh-pages" exists on ${remotes.length} remotes:\n${remotes.map(r => `      ${r.trim()}`).join("\n")}\n    Fix: git config checkout.defaultRemote origin`
        );
      } else {
        console.log(
          styleText("green", "  ✓ gh-pages branch (via defaultRemote)")
        );
      }
    } else {
      console.log(styleText("green", "  ✓ gh-pages branch"));
    }
  } catch {
    errors.push("Could not verify gh-pages branch status.");
  }

  if (errors.length) {
    console.log(styleText("red", "\n  ❌ Preflight failed:\n"));
    errors.forEach((err, i) => {
      console.log(styleText("red", `  ${i + 1}. ${err}\n`));
    });
    throw new Error("Fix the issues above and try again.");
  }
  console.log(styleText("green", "\n  ✅ All preflight checks passed.\n"));
}

/**
 * Runs a command interactively (stdio inherited), needed for npm publish OTP.
 * @param {string} file
 * @param {string[]} args
 * @returns {Promise<void>}
 */
function toSpawnPromise(file, args) {
  console.log(
    styleText("cyan", `Run: ${file} ${styleText("grey", args.join(" "))}`)
  );
  if (DEBUG) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const proc = spawn(file, args, { stdio: "inherit" });
    proc.on("close", code => {
      if (code !== 0) {
        reject(
          new Error(
            `Command failed with exit code ${code}: ${file} ${args.join(" ")}`
          )
        );
      } else {
        resolve();
      }
    });
    proc.on("error", reject);
  });
}

/**
 * @param {string} version
 * @param {string} mainHead
 * @param {string} ghPagesHead
 * @param {string} initialBranch
 */
async function rollback(version, mainHead, ghPagesHead, initialBranch) {
  console.log(styleText("yellow", "\n  ⏪ Rolling back local changes...\n"));
  try {
    const currentBranch = await getCurrentBranch();
    if (currentBranch !== "main") {
      await git(["switch", "main"]);
    }
  } catch {
    // best effort
  }
  try {
    await git(["tag", "-d", `v${version}`]);
    console.log(styleText("yellow", `  Deleted tag v${version}`));
  } catch {
    // tag may not exist yet
  }
  if (mainHead) {
    try {
      await git(["reset", "--hard", mainHead]);
      console.log(
        styleText("yellow", `  Reset main to ${mainHead.slice(0, 8)}`)
      );
    } catch {
      console.log(styleText("red", "  Failed to reset main — check manually."));
    }
  }
  if (ghPagesHead) {
    try {
      await git(["switch", "gh-pages"]);
      await git(["reset", "--hard", ghPagesHead]);
      console.log(
        styleText("yellow", `  Reset gh-pages to ${ghPagesHead.slice(0, 8)}`)
      );
    } catch {
      console.log(
        styleText("red", "  Failed to reset gh-pages — check manually.")
      );
    } finally {
      await git(["switch", "main"]);
    }
  }
  try {
    const currentBranch = await getCurrentBranch();
    if (initialBranch !== currentBranch) {
      await git(["switch", initialBranch]);
    }
  } catch {
    // best effort
  }
}

const indicators = new Map([
  [
    "remote-update",
    new Indicator(styleText("green", " Performing Git remote update... 📡 ")),
  ],
  [
    "push-to-server",
    new Indicator(
      styleText("green", " Pushing everything back to server... 📡")
    ),
  ],
]);

const run = async () => {
  const initialBranch = await getCurrentBranch();
  let version = "";
  let mainHead = "";
  let ghPagesHead = "";
  let pushed = false;
  try {
    // Refresh remote refs before preflight (gh-pages check needs current data)
    indicators.get("remote-update").show();
    await git(["remote", "update"]);
    indicators.get("remote-update").hide();

    await preflight();

    // 1. Confirm maintainer is on up-to-date and on the main branch
    if (initialBranch !== "main") {
      await Prompts.askSwitchToBranch(initialBranch, "main");
    }
    const branchState = await getBranchState();
    switch (branchState) {
      case "needs a pull":
        await Prompts.askToPullBranch("main");
        break;
      case "up-to-date":
        break;
      case "needs to push":
        throw new Error(
          `Found unpushed commits on "main" branch! Can't proceed.`
        );
      default:
        throw new Error(`Your branch is not up-to-date. It ${branchState}.`);
    }

    // Save state for rollback (before any mutations)
    mainHead = (await git(["rev-parse", "HEAD"])).trim();

    // 2. Bump the version in `package.json`.
    version = await Prompts.askBumpVersion();
    await Prompts.askBuildAddCommitMergeTag();
    await npm([
      "version",
      version,
      "-m",
      `v${version}`,
      "--no-git-tag-version",
    ]);

    // 3. Install exactly what the lockfile says, then build.
    // builds/*.js bundle code straight out of node_modules (src/core/import-maps.js imports
    // node_modules/marked/lib/marked.esm.js, for example), and step 1 has just checked out main.
    // Without this, a release run on a stale node_modules publishes bundles built from the OLD
    // dependency versions while committing the NEW pnpm-lock.yaml, so the artifact and the
    // lockfile disagree. --frozen-lockfile makes that a hard failure rather than a silent drift.
    console.log(styleText("green", " Installing dependencies... 📦"));
    await pnpm(["install", "--frozen-lockfile"]);

    // 3b. Run the build script (node tools/builder.js).
    await npm(["run", "builddeps"]);
    for (const name of ["w3c", "dini", "aom"]) {
      await Builder.build({ name });
    }
    console.log(
      styleText("green", " Making sure the generated version is ok... 🕵🏻")
    );
    const source = `file:///${__dirname}/../examples/basic.built.html`;
    const tempFile = path.join(os.tmpdir(), "index.html");
    await node(
      ["./tools/respec2html.js", "-e", "--timeout", "30", source, tempFile],
      {
        showOutput: true,
      }
    );

    // Do HTML validation
    console.log(
      styleText("green", " Making sure HTML validator is happy... 🕵🏻")
    );
    await validator(["--stdout", tempFile]);
    console.log(styleText("green", " Build Seems good... ✅"));

    // 4. Commit your changes
    await git(["add", "builds", "package.json", "pnpm-lock.yaml"]);
    await git(["commit", "-m", `v${version}`]);
    await git(["tag", `v${version}`]);

    // 5. Merge to gh-pages
    try {
      ghPagesHead = (await git(["rev-parse", "origin/gh-pages"])).trim();
    } catch {
      // gh-pages may not exist locally yet
    }
    await git(["checkout", "gh-pages"]).catch(() =>
      git(["checkout", "--track", "origin/gh-pages"])
    );
    await git(["pull", "origin", "gh-pages"]);
    await git(["merge", "main"]);
    await git(["checkout", "main"]);

    // 6. Push — point of no return after first successful push
    await Prompts.askPushAll();
    indicators.get("push-to-server").show();
    await git(["push", "origin", "main"]);
    await git(["push", "origin", "gh-pages"]);
    await git(["push", "--tags"]);
    pushed = true;
    indicators.get("push-to-server").hide();

    // 7. Publish to npm (interactive for OTP auth)
    console.log(styleText("green", " Publishing to npm... 📡"));
    await toSpawnPromise("npm", ["publish"]);

    // 8. Create GitHub Release (triggers W3C CDN sync)
    console.log(styleText("green", " Creating GitHub Release... 📡"));
    await toExecFilePromise(
      "gh",
      ["release", "create", `v${version}`, "--generate-notes"],
      { timeout: 30000, showOutput: true }
    );

    if (initialBranch !== "main") {
      await Prompts.askSwitchToBranch("main", initialBranch);
    }
  } catch (err) {
    console.error(styleText("red", `\n☠  ${err.stack}`));
    if (pushed) {
      console.log(
        styleText(
          "yellow",
          `\n  Git push succeeded but a later step failed.\n` +
            `  You may need to run manually:\n` +
            `    npm publish\n` +
            `    gh release create v${version} --generate-notes\n`
        )
      );
    } else {
      await rollback(version, mainHead, ghPagesHead, initialBranch);
    }
    process.exit(1);
    return;
  }
  // all is good...
  process.exit(0);
};

run();
