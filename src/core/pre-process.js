/**
 * Module core/pre-process
 *
 * Corresponds to respecConfig.preProcess.
 *  - preProcess: an array of functions that get called
 *      before anything else happens. This is not recommended and the feature is not
 *      tested. Use with care, if you know what you're doing. Chances are you really
 *      want to be using a new module with your own profile
 */
import { sub } from "core/pubsubhub";

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
      const values = await Promise.all(
        config.preProcess
          .filter(f => typeof f === "function")
          .map(f => Promise.resolve(f(config, document)))
      );
      result.push(...values);
    }
    doneResolver(result);
  },
  { once: true }
);
