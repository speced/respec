// @ts-check
/**
 * Module core/post-process
 *
 * Corresponds to respecConfig.postProcess and config.afterEnd.
 *  - postProcess: an array of functions that get called
 *      after processing finishes. This is not recommended and the feature is not
 *      tested. Use with care, if you know what you're doing. Chances are you really
 *      want to be using a new module with your own profile.
 *  - afterEnd: final thing that is called.
 */
import { showError } from "./utils.js";

export const name = "core/post-process";

export async function run(config) {
  if (Array.isArray(config.postProcess)) {
    const promises = config.postProcess
      .filter(f => {
        const isFunction = typeof f === "function";
        if (!isFunction) {
          const msg = "Every item in `postProcess` must be a JS function.";
          showError(msg, name);
        }
        return isFunction;
      })
      .map(async f => {
        try {
          return await f(config, document);
        } catch (err) {
          const msg = `Function ${f.name} threw an error during \`postProcess\`.`;
          const hint = "See developer console.";
          showError(msg, name, { hint });
          console.error(err);
        }
      });
    await Promise.all(promises);
  }
  if (typeof config.afterEnd === "function") {
    await config.afterEnd(config, document);
  }
}
