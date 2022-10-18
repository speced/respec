import { showError, showWarning } from "../core/utils.js";

export const name = "logius/missing-config-warner";

const requiredConfigs = ["headerLocalizationStrings", "licenses"];

const recommendedConfigs = [
  "specStatus",
  "nl_organisationName",
  "governanceTypeText",
  "sotdText",
];

const wikiURL = "https://github.com/Logius-standaarden/respec/wiki/";

export async function run(conf) {
  if (conf.useSideBar) {
    requiredConfigs.push("labelText");
    requiredConfigs.push("labelColorTable");
  }

  await errorMissingConfigs(conf);
  await warnMissingConfigs(conf);
}

async function errorMissingConfigs(conf) {
  requiredConfigs.forEach(element => {
    if (!conf[element]) {
      showError(`Missing config option ${element}`, "errorMissingConfigs", {
        hint: wikiURL + element,
      });
    }
  });
}

async function warnMissingConfigs(conf) {
  recommendedConfigs.forEach(element => {
    if (!conf[element]) {
      showWarning(`Missing config option ${element}`, "warnMissingConfigs", {
        hint: wikiURL + element,
      });
    }
  });
}
