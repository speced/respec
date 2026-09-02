// @ts-check

const path = require("path");

/** @type {import("karma").ConfigOptions["files"]} */
const files = [
  {
    pattern: "builds/**/*.*",
    included: false,
  },
  {
    pattern: "@(src|js)/**/*",
    included: false,
  },
  {
    pattern: "worker/*.js",
    included: false,
  },
  {
    pattern:
      "node_modules/@(idb|hyperhtml|marked|webidl2|sniffy-mimetype|cddlparser)/**/*.js",
    included: false,
  },
  {
    pattern: "tests/@(data|support-files)/**/*",
    included: false,
  },
  {
    pattern: "tests/**/*.@(html|json)",
    included: false,
  },
  {
    pattern: "tests/test-main.js",
    type: "module",
  },
];

/** @param {import("karma").Config} config */
module.exports = config => {
  /** @type {import("karma").ConfigOptions} */
  const options = {
    basePath: path.join(__dirname, ".."),
    plugins: [
      require("karma-jasmine"),
      require("karma-mocha-reporter"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("karma-safari-launcher"),
    ],
    frameworks: ["jasmine"],
    files,
    exclude: ["**/*.swp", "*.swp", ".DS_Store"],

    proxies: {
      "/about-blank.html": "/base/tests/about-blank.html",
      // Root path, or the worker's scope would not cover karma's own page and
      // the spec iframes that inherit control from it.
      "/respec-test-sw.js": "/base/tests/spec/respec-test-sw.js",
      "/assets/": "/base/assets/",
      "/js/": "/base/js/",
      "/src/": "/base/src/",
      "/node_modules/": "/base/node_modules/",
      "/builds/": "/base/builds/",
      "/tests/": "/base/tests/",
      "/spec/": "/base/tests/spec/",
      "/unit/": "/base/tests/unit/",
      "/deps/": "/base/js/deps/",
      "/js/deps/": "/base/js/deps/",
      "/base/deps/": "/base/js/deps/",
      "/worker/respec-worker.js": "/base/worker/respec-worker.js",
      "/support-files/": "/base/tests/support-files/",
    },

    preprocessors: {},
    reporters: ["mocha"],
    port: 9876,
    colors: true,

    logLevel: config.LOG_WARN,
    autoWatch: true,
    singleRun: false,
    concurrency: 1,
    browserNoActivityTimeout: 100000,
    reportSlowerThan: 300,

    client: {
      // @ts-expect-error
      args: ["--grep", config.grep || ""],
      // Redirects xref, group, caniuse, baseline and bibliography requests to
      // local servers; see .github/copilot-instructions.md. Empty means production.
      serviceOrigins: {
        ...(process.env.RESPEC_SERVICES_BASE && {
          "https://respec.org": process.env.RESPEC_SERVICES_BASE,
        }),
        ...(process.env.SPECREF_BASE && {
          "https://api.specref.org": process.env.SPECREF_BASE,
        }),
      },
    },
  };

  // Set both or bibliography goes untested: core/biblio.js falls back to
  // respec.org/bibrefs, and an origin rewrite cannot separate that from xref.
  if (process.env.SPECREF_BASE && !process.env.RESPEC_SERVICES_BASE) {
    process.emitWarning(
      "SPECREF_BASE is set but RESPEC_SERVICES_BASE is not. Bibliography falls back " +
        "to respec.org/bibrefs, so those requests still go to production. Set both to " +
        "test bibliography against a local service.",
      "ReSpecServiceOrigins"
    );
  }

  if (process.env.BROWSERS) {
    options.browsers = process.env.BROWSERS.split(" ");
  }

  if (process.env.GITHUB_WORKFLOW) {
    const localPlugins = [require("../tools/github-action-reporter.cjs")];
    options.reporters.push("respec-github-action");
    options.plugins = options.plugins.concat(localPlugins);
  }

  config.set(options);
  return options;
};
module.exports.files = files;
