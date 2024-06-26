// @ts-check
// Module core/location-hash
// As ReSpec injects a bunch of stuff async, the scroll position is not always
// at the right place when we are done processing. The purpose of this module
// is to reset window's location hash, which will cause the browser to scroll
// the window to the correct point in the document when processing is done.

export const name = "core/location-hash";

export function run() {
  if (!window.location.hash) {
    return;
  }

  // We have to use .then() here because otherwise we would get stuck
  // awaiting this plugin to finish.
  document.respec.ready.then(() => {
    const hash = decodeURIComponent(window.location.hash).slice(1);

    let newHash = hash;
    /** @type {HTMLElement|null} */
    const element = document.getElementById(newHash);

    // Check if hash contains any non-word character.
    const isLegacyFrag = /\W/.test(newHash);

    // Allow some degree of recovery for legacy fragments format.
    // See https://github.com/speced/respec/issues/1353
    if (!element && isLegacyFrag) {
      const id = newHash
        // Replace all non-word characters with a dash.
        .replace(/[\W]+/gim, "-")
        // Remove any leading dashes.
        .replace(/^-+/, "")
        // Remove any trailing dashes.
        .replace(/-+$/, "");

      /** @type {HTMLElement|null} */
      const updatedElement = document.getElementById(id);
      if (updatedElement) {
        newHash = id;
      }
    }
    window.location.hash = `#${newHash}`;
  });
}
