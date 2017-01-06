/**
 * Module core/postProcess
 *
 * Corresponds to respecConfig.postProcess and config.afterEnd.
 *  - postProcess: an array of functions that get called
 *      after processing finishes. This is not recommended and the feature is not
 *      tested. Use with care, if you know what you're doing. Chances are you really
 *      want to be using a new module with your own profile.
 *  - afterEnd: final thing that is called.
 */
import { sub } from "core/pubsubhub";

sub("end-all", config => {
  if (Array.isArray(config.postProcess)) {
    config.postProcess.forEach(f => f(config));
  }
  if (typeof config.afterEnd === "function") {
    config.afterEnd();
  }
}, { once: true });
