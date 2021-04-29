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
import { showError } from "./utils.js";

export const name = "core/pre-process";

export async function run(config) {
  if (Array.isArray(config.preProcess)) {
    const promises = config.preProcess
      .filter(f => {
        const isFunction = typeof f === "function";
        if (!isFunction) {
          const msg = "Every item in `preProcess` must be a JS function.";
          showError(msg, name);
        }
        return isFunction;
      })
      .map(async f => {
        try {
          return await f(config, document);
        } catch (err) {
          const msg = `Function ${f.name} threw an error during \`preProcess\`.`;
          const hint = "See developer console.";
          showError(msg, name, { hint });
          console.error(err);
        }
      });
    await Promise.all(promises);
  }
}
