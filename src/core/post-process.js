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
import { sub } from "core/pubsubhub";

export const name = "core/post-process";

let doneResolver;
export const done = new Promise(resolve => {
  doneResolver = resolve;
});

sub(
  "plugins-done",
  async config => {
    const result = [];
    if (Array.isArray(config.postProcess)) {
      const values = await Promise.all(
        config.postProcess
          .filter(f => typeof f === "function")
          .map(f => Promise.resolve(f(config, document)))
      );
      result.push(...values);
    }
    if (typeof config.afterEnd === "function") {
      result.push(await Promise.resolve(config.afterEnd(config, document)));
    }
    doneResolver(result);
  },
  { once: true }
);
