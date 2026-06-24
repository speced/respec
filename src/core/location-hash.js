// @ts-check
// Module core/location-hash
// As ReSpec injects a bunch of stuff async, the scroll position is not always
// at the right place when we are done processing. The purpose of this module
// is to reset window's location hash, which will cause the browser to scroll
// the window to the correct point in the document when processing is done.

export const name = "core/location-hash";
const DFN_ID_PREFIX = "dfn-";

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
      } else if (id.startsWith(DFN_ID_PREFIX)) {
        const legacyTerm = id.slice(DFN_ID_PREFIX.length);
        const numericSuffixMatch = legacyTerm.match(/^(.+)-(\d+)$/);
        const termWithLeadingHyphen = `-${legacyTerm}`;
        const scopedDfnElements = [
          ...document.querySelectorAll(
            `[data-dfn-type][id^='${DFN_ID_PREFIX}']`
          ),
        ];
        let matchingElements = scopedDfnElements.filter(({ id }) => {
          const scopedId = id.slice(DFN_ID_PREFIX.length);
          return (
            scopedId === legacyTerm || scopedId.endsWith(termWithLeadingHyphen)
          );
        });
        if (!matchingElements.length && numericSuffixMatch) {
          const [, baseTerm, index] = numericSuffixMatch;
          const baseTermWithLeadingHyphen = `-${baseTerm}`;
          matchingElements = scopedDfnElements.filter(({ id }) => {
            const scopedId = id.slice(DFN_ID_PREFIX.length);
            return (
              scopedId === baseTerm ||
              scopedId.endsWith(baseTermWithLeadingHyphen)
            );
          });
          if (matchingElements[Number(index)]) {
            newHash = matchingElements[Number(index)].id;
          }
        } else if (matchingElements.length === 1) {
          newHash = matchingElements[0].id;
        }
      }
    }
    window.location.hash = `#${newHash}`;
  });
}
