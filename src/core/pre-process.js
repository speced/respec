/**
 * Module core/preProcess
 *
 * Corresponds to respecConfig.preProcess.
 *  - preProcess: an array of functions that get called
 *      before anything else happens. This is not recommended and the feature is not
 *      tested. Use with care, if you know what you're doing. Chances are you really
 *      want to be using a new module with your own profile
 */
import { sub } from "core/pubsubhub";

sub("start-all", config => {
  if (Array.isArray(config.preProcess)) {
    config.preProcess.forEach(f => f(config));
  }
}, { once: true });
