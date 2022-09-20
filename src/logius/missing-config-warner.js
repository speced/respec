import { showWarning } from "../core/utils.js";

const requiredConfigs = [
  "nl_organisationName",
  "labelText",
  "specStatus",
  "labelColorTable",
  "governanceTypeText",
  "sotdText",
];

export async function run(conf) {
  await warnMissingConfigs(conf);
}

async function warnMissingConfigs(conf) {
  requiredConfigs.forEach(element => {
    if (!conf[element]) {
      showWarning(
        `Warning, missing config option ${element}`,
        "warnMissingConfigs"
      );
    }
  });
}
