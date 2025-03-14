import { showError, showWarning } from "../core/utils.js";

export const name = "logius/missing-config-warner";

const requiredConfigs = ["licenses", "license"];

const recommendedConfigs = [
  "specStatus",
  "nl_organisationName",
  "sotdText",
  "thisVersion",
  "latestVersion",
  "prevVersion",
];

const wikiURL = "https://github.com/Logius-standaarden/respec/wiki/";

export async function run(conf) {
  if (conf.useLabel) {
    requiredConfigs.push("labelColor");
  }

  await errorMissingConfigs(conf);
  await warnMissingConfigs(conf);
}

async function errorMissingConfigs(conf) {
  requiredConfigs.forEach(element => {
    if (!conf[element]) {
      showError(
        `Missing config option <code>${element}</code>`,
        "errorMissingConfigs",
        {
          hint: wikiURL + element,
        }
      );
    }
  });
}

async function warnMissingConfigs(conf) {
  recommendedConfigs.forEach(element => {
    if (!conf[element]) {
      showWarning(
        `Missing config option <code>${element}</code>`,
        "warnMissingConfigs",
        {
          hint: wikiURL + element,
        }
      );
    }
  });
}
