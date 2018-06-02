// Module core/location-hash
// Resets window.location.hash to jump to the right point in the document

import { pub } from "core/pubsubhub";
import { ScrollBomb } from "core/utils";
export const name = "core/location-hash";

export function run() {
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("start", "core/location-hash");
  if (!location.hash) {
    return;
  }
  const scrollBomb = new ScrollBomb("Scroll position in user control");
  let hash = decodeURIComponent(location.hash).substr(1);
  const hasLink = !!document.getElementById(hash);
  const isLegacyFrag = /\W/.test(hash);
  // Allow some degree of recovery for legacy fragments format.
  // See https://github.com/w3c/respec/issues/1353
  if (!hasLink && isLegacyFrag) {
    const id = hash
      .replace(/[\W]+/gim, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    if (document.getElementById(id)) {
      hash = id;
    }
  }
  Promise.race([document.respecIsReady, scrollBomb.arm()])
    .then(() => {
      scrollBomb.disarm();
      location.hash = `#${hash}`;
    })
    .catch(err => {
      console.info(err);
    });
}
