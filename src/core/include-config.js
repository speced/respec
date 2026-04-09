// @ts-check
// Module core/include-config
// Inject's the document's configuration into the head as JSON.
import { sub } from "./pubsubhub.js";
export const name = "core/include-config";

const removeList = ["githubToken", "githubUser"];

/**
 * @param {Conf} config
 */
export function run(config) {
  /** @type {Record<string, any>} */
  const userConfig = {};
  /**
   * @param {Record<string, unknown>} newValues
   */
  const amendConfig = newValues => Object.assign(userConfig, newValues);

  amendConfig(
    /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (config))
  );
  sub("amend-user-config", amendConfig);

  sub("end-all", () => {
    const script = document.createElement("script");
    script.id = "initialUserConfig";
    script.type = "application/json";
    for (const prop of removeList) {
      if (prop in userConfig) delete userConfig[prop];
    }
    script.innerHTML = JSON.stringify(userConfig, null, 2);
    document.head.appendChild(script);
  });
}
