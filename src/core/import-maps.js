// @ts-check
// Temporary workaround until browsers get real import-maps

import * as _webidl2 from "../../node_modules/webidl2/index.js";
import _hyperHTML from "../../node_modules/hyperhtml/esm.js";
import _marked from "../../js/deps/builds/marked.js";
import _pluralize from "../../js/deps/builds/pluralize.js";

/** @type {import("hyperhtml").default} */
// @ts-ignore
export const hyperHTML = _hyperHTML;
export const webidl2 = _webidl2;
/** @type {import("marked")} */
// @ts-ignore
export const marked = _marked;
/** @type {import("pluralize")} */
// @ts-ignore
export const pluralize = _pluralize;

/**
 * @returns {Promise<import("idb")>}
 */
export async function importIdb() {
  try {
    return await import("idb");
  } catch {
    return await import("../../node_modules/idb/build/esm/index.js");
  }
}
