// Module core/location-hash
// Resets window.location.hash to jump to the right point in the document

import { pub } from "core/pubsubhub";

export const name = "core/location-hash";

export function run(conf, doc, cb) {
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("start", "core/location-hash");
  // Only scroll to the hash if the document hasn't been scrolled yet
  // this ensures that a page refresh maintains the scroll position
  const { documentElement, body } = document;
  if (location.hash === "" || documentElement.scrollTop || body.scrollTop) {
    return cb();
  }
  let hash = "";
  try {
    hash = decodeURIComponent(location.hash).substr(1);
  } catch (err) {
    console.warn(err);
  }
  // Allow some degree of recovery for legacy fragments format.
  // See https://github.com/w3c/respec/issues/1353
  const hasLink = !!doc.getElementById(hash);
  const isLegacyFrag = /\W/.test(hash);
  if (!hasLink && isLegacyFrag) {
    const id = hash
      .replace(/[\W]+/gim, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    if (document.getElementById(id)) {
      hash = id;
    }
  }
  location.hash = `#${hash}`;
  cb();
}
