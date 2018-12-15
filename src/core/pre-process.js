/**
 * Module core/pre-process
 *
 * Corresponds to respecConfig.preProcess.
 *  - preProcess: an array of functions that get called
 *      before anything else happens. This is not recommended and the feature is not
 *      tested. Use with care, if you know what you're doing. Chances are you really
 *      want to be using a new module with your own profile
 */
import { pub, sub } from "./pubsubhub";

export const name = "core/pre-process";

let doneResolver;
export const done = new Promise(resolve => {
  doneResolver = resolve;
});

sub(
  "start-all",
  async config => {
    const result = [];
    if (Array.isArray(config.preProcess)) {
      const promises = config.preProcess
        .filter(f => {
          const isFunction = typeof f === "function";
          if (!isFunction) {
            pub("error", "Every item in `preProcess` must be a JS function.");
          }
          return isFunction;
        })
        .map(async f => {
          try {
            return await f(config, document);
          } catch (err) {
            pub(
              "error",
              `Function ${
                f.name
              } threw an error during \`preProcess\`. See developer console.`
            );
            console.error(err);
          }
        });
      const values = await Promise.all(promises);
      result.push(...values);
    }
    doneResolver(result);
  },
  { once: true }
);
