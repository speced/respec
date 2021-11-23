// @ts-check
// Temporary workaround until browsers get real import-maps

import * as _idb from "../../node_modules/idb/build/index.js";
import * as _webidl2 from "../../node_modules/webidl2/index.js";
import { MIMEType as _MIMEType } from "../../node_modules/sniffy-mimetype/index.js";
import { marked as _marked } from "../../node_modules/marked/lib/marked.esm.js";
import _pluralize from "../../js/deps/builds/pluralize.js";
import hyperHTML from "../../node_modules/hyperhtml/esm.js";

/** @type {import("idb")} */
// @ts-ignore
export const idb = _idb;
export const webidl2 = _webidl2;
/** @type {import("hyperhtml").default} */
// @ts-ignore
export const html = hyperHTML;
/** @type {import("marked")} */
// @ts-ignore
export const marked = _marked;
/** @type {import("pluralize")} */
// @ts-ignore
export const pluralize = _pluralize;

/** @type {import("sniffy-mimetype")} */
// @ts-ignore
export const MIMEType = _MIMEType;
