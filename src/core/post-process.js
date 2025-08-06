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
import { makePluginUtils, showError } from "./utils.js";

export const name = "core/post-process";

export async function run(config) {
  if (Array.isArray(config.postProcess)) {
    const functions = config.postProcess.filter(f => {
      const isFunction = typeof f === "function";
      if (!isFunction) {
        const msg = "Every item in `postProcess` must be a JS function.";
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
        const msg = `Function ${fnName} threw an error during \`postProcess\`.`;
        const hint = "See developer console.";
        showError(msg, name, { hint, cause: err });
      }
    }
  }
  if (typeof config.afterEnd === "function") {
    await config.afterEnd(config, document);
  }
}
