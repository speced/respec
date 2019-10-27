// @ts-check
// Temporary workaround until browsers get real import-maps

import * as _idb from "../../node_modules/idb/build/esm/index.js";
import * as _webidl2 from "../../node_modules/webidl2/index.js";
import { html as _html, raw as _raw } from "../../js/deps/builds/nanohtml.js";
import _marked from "../../js/deps/builds/marked.js";
import _pluralize from "../../js/deps/builds/pluralize.js";

/** @type {import("idb")} */
// @ts-ignore
export const idb = _idb;
export const webidl2 = _webidl2;
/** @type {import("nanohtml").default} */
// @ts-ignore
export const hyperHTML = _html;
/** @type {import("nanohtml/raw").default} */
// @ts-ignore
export const raw = _raw;
/** @type {import("marked")} */
// @ts-ignore
export const marked = _marked;
/** @type {import("pluralize")} */
// @ts-ignore
export const pluralize = _pluralize;
