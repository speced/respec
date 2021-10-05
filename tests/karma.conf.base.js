// @ts-check
/* eslint-env node */
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
      "node_modules/@(idb|hyperhtml|marked|webidl2|sniffy-mimetype)/**/*.js",
    included: false,
  },
  {
    pattern: "tests/@(data|support-files)/**/*",
    included: false,
  },
  {
    pattern: "tests/**/*.html",
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
    frameworks: ["jasmine"],
    files,
    exclude: ["**/*.swp", "*.swp", ".DS_Store"],

    proxies: {
      "/about-blank.html": "/base/tests/about-blank.html",
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
    reporters: ["mocha", "kjhtml"],
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
    },
  };

  if (process.env.BROWSERS) {
    options.browsers = process.env.BROWSERS.split(" ");
  }

  if (process.env.GITHUB_WORKFLOW) {
    const localPlugins = [
      require.resolve("../tools/github-action-reporter.js"),
    ];
    options.reporters.push("respec-github-action");
    options.plugins = ["karma-*"].concat(localPlugins);
  }

  config.set(options);
  return options;
};
module.exports.files = files;
