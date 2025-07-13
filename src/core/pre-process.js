// @ts-check
/**
 * Module core/pre-process
 *
 * Corresponds to respecConfig.preProcess.
 *  - preProcess: an array of functions that get called
 *      before anything else happens. This is not recommended and the feature is not
 *      tested. Use with care, if you know what you're doing. Chances are you really
 *      want to be using a new module with your own profile
 */
import { makePluginUtils, showError } from "./utils.js";

export const name = "core/pre-process";

export async function run(config) {
  if (Array.isArray(config.preProcess)) {
    const functions = config.preProcess.filter(f => {
      const isFunction = typeof f === "function";
      if (!isFunction) {
        const msg = "Every item in `preProcess` must be a JS function.";
        showError(msg, name);
      }
      return isFunction;
    });
    for (const [i, f] of functions.entries()) {
      const fnName = `${name}/${f.name || `[${i}]`}`;
      const utils = makePluginUtils(fnName);
      try {
        await f(config, document, utils);
      } catch (err) {
        const msg = `Function ${f.name} threw an error during \`preProcess\`.`;
        const hint = "See developer console.";
        showError(msg, name, { hint, cause: err });
      }
    }
  }
}
