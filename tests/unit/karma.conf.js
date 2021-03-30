// @ts-check
/* eslint-env node */
const baseConfig = require("../karma.conf.base.js");

/** @param {import("karma").Config} config */
module.exports = config => {
  const options = baseConfig(config);

  options.files.push({
    pattern: "tests/unit/SpecHelper.js",
    type: "module",
    included: false,
  });
  options.files.push({
    pattern: "tests/unit/**/*-spec.js",
    type: "module",
    included: false,
  });

  config.set(options);
};
