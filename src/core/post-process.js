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

const TIMEOUT = 15000;

/**
 * @param {Promise<void> | void} task
 * @param {string} label
 */
function withTimeout(task, label) {
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => {
      reject(new Error(`${label} timed out.`));
    }, TIMEOUT);
    Promise.resolve(task)
      .then(resolve, reject)
      .finally(() => {
        clearTimeout(timerId);
      });
  });
}

/**
 * @param {Conf} config
 */
export async function run(config) {
  if (Array.isArray(config.postProcess)) {
    const functions = config.postProcess.filter((/** @type {any} */ f) => {
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
        await withTimeout(
          f(config, document, utils),
          `postProcess function "${fnName}"`
        );
      } catch (err) {
        const msg = `Function ${fnName} threw an error during \`postProcess\`.`;
        const hint = "See developer console.";
        showError(msg, name, { hint, cause: /** @type {Error} */ (err) });
      }
    }
  }
  if (typeof config.afterEnd === "function") {
    try {
      await withTimeout(config.afterEnd(config, document), "config.afterEnd");
    } catch (err) {
      const msg = "Function afterEnd threw an error.";
      const hint = "See developer console.";
      showError(msg, name, { hint, cause: /** @type {Error} */ (err) });
    }
  }
}
