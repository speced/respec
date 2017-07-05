// Module core/location-hash
// Resets window.location.hash to jump to the right point in the document

import { pub } from "core/pubsubhub";

export const name = "core/location-hash";

export function run(conf, doc, cb) {
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("start", "core/location-hash");
  var hash = window.location.hash;

  // Only scroll to the hash if the document hasn't been scrolled yet
  // this ensures that a page refresh maintains the scroll position
  if (hash && !window.pageYOffset) {
    window.location.hash = "";
    window.location.hash = hash;
  }
  cb();
}
