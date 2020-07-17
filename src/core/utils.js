// @ts-check
// Module core/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit
// anywhere else.
import { lang as docLang } from "./l10n.js";
import { html } from "./import-maps.js";
import { pub } from "./pubsubhub.js";
export const name = "core/utils";

const dashes = /-/g;
/**
 * Hashes a string from char code. Can return a negative number.
 * Based on https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
 *
 * @param {String} text
 */
function hashString(text) {
  let hash = 0;
  for (const char of text) {
    hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
  }
  return String(hash);
}

const localizationStrings = {
  en: {
    x_and_y: " and ",
    x_y_and_z: ", and ",
  },
  de: {
    x_and_y: " und ",
    x_y_and_z: " und ",
  },
};
const l10n = getIntlData(localizationStrings);

export const ISODate = new Intl.DateTimeFormat(["en-ca-iso8601"], {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const resourceHints = new Set([
  "dns-prefetch",
  "preconnect",
  "preload",
  "prerender",
]);

const fetchDestinations = new Set([
  "document",
  "embed",
  "font",
  "image",
  "manifest",
  "media",
  "object",
  "report",
  "script",
  "serviceworker",
  "sharedworker",
  "style",
  "worker",
  "xslt",
  "",
]);

// CSS selector for matching elements that are non-normative
export const nonNormativeSelector =
  ".informative, .note, .issue, .example, .ednote, .practice, .introductory";

/**
 * Creates a link element that represents a resource hint.
 *
 * @param {Object} opts Configure the resource hint.
 * @param {String} opts.hint The type of hint (see resourceHints).
 * @param {String} opts.href The URL for the resource or origin.
 * @param {String} [opts.corsMode] Optional, the CORS mode to use (see HTML spec).
 * @param {String} [opts.as] Optional, fetch destination type (see fetchDestinations).
 * @param {boolean} [opts.dontRemove] If the hint should remain in the spec after processing.
 * @return {HTMLLinkElement} A link element ready to use.
 */
export function createResourceHint(opts) {
  if (!opts || typeof opts !== "object") {
    throw new TypeError("Missing options");
  }
  if (!resourceHints.has(opts.hint)) {
    throw new TypeError("Invalid resources hint");
  }
  const url = new URL(opts.href, location.href);
  const linkElem = document.createElement("link");
  let { href } = url;
  linkElem.rel = opts.hint;
  switch (linkElem.rel) {
    case "dns-prefetch":
    case "preconnect":
      href = url.origin;
      if (opts.corsMode || url.origin !== document.location.origin) {
        linkElem.crossOrigin = opts.corsMode || "anonymous";
      }
      break;
    case "preload":
      if ("as" in opts && typeof opts.as === "string") {
        if (!fetchDestinations.has(opts.as)) {
          console.warn(`Unknown request destination: ${opts.as}`);
        }
        linkElem.setAttribute("as", opts.as);
      }
      break;
  }
  linkElem.href = href;
  if (!opts.dontRemove) {
    linkElem.classList.add("removeOnSave");
  }
  return linkElem;
}

// RESPEC STUFF
export function removeReSpec(doc) {
  doc.querySelectorAll(".remove, script[data-requiremodule]").forEach(elem => {
    elem.remove();
  });
}

/**
 * Adds error class to each element while emitting a warning
 * @param {HTMLElement|HTMLElement[]} elems
 * @param {String} msg message to show in warning
 * @param {String=} title error message to add on each element
 * @param {object} [options]
 * @param {string} [options.details]
 */
export function showInlineWarning(elems, msg, title, options = {}) {
  if (!Array.isArray(elems)) elems = [elems];
  const message = getErrorMessage(elems, msg, title, options);
  pub("warn", message);
  console.warn(msg, elems);
}

/**
 * Adds error class to each element while emitting a warning
 * @param {HTMLElement|HTMLElement[]} elems
 * @param {String} msg message to show in warning
 * @param {String} title error message to add on each element
 * @param {object} [options]
 * @param {string} [options.details]
 */
export function showInlineError(elems, msg, title, options = {}) {
  if (!Array.isArray(elems)) elems = [elems];
  const message = getErrorMessage(elems, msg, title, options);
  pub("error", message);
  console.error(msg, elems);
}

/**
 * @param {HTMLElement[]} elems
 * @param {String} msg
 * @param {String} title
 * @param {object} [options]
 * @param {string} [options.details]
 */
function getErrorMessage(elems, msg, title, { details }) {
  const links = elems
    .map((element, i) => {
      markAsOffending(element, msg, title);
      return generateMarkdownLink(element, i);
    })
    .join(", ");
  let message = `${msg} at: ${links}.`;
  if (details) {
    message += `\n\n<details>${details}</details>`;
  }
  return message;
}

/**
 * Adds error class to each element while emitting a warning
 * @param {HTMLElement} elem
 * @param {String} msg message to show in warning
 * @param {String=} title error message to add on each element
 */
function markAsOffending(elem, msg, title) {
  elem.classList.add("respec-offending-element");
  if (!elem.hasAttribute("title")) {
    elem.setAttribute("title", title || msg);
  }
  if (!elem.id) {
    addId(elem, "respec-offender");
  }
}

/**
 * @param {Element} element
 * @param {number} i
 */
function generateMarkdownLink(element, i) {
  return `[${i + 1}](#${element.id})`;
}

export class IDBKeyVal {
  /**
   * @param {import("idb").IDBPDatabase} idb
   * @param {string} storeName
   */
  constructor(idb, storeName) {
    this.idb = idb;
    this.storeName = storeName;
  }

  /** @param {string} key */
  async get(key) {
    return await this.idb
      .transaction(this.storeName)
      .objectStore(this.storeName)
      .get(key);
  }

  /**
   * @param {string[]} keys
   */
  async getMany(keys) {
    const keySet = new Set(keys);
    /** @type {Map<string, any>} */
    const results = new Map();
    let cursor = await this.idb.transaction(this.storeName).store.openCursor();
    while (cursor) {
      if (keySet.has(cursor.key)) {
        results.set(cursor.key, cursor.value);
      }
      cursor = await cursor.continue();
    }
    return results;
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  async set(key, value) {
    const tx = this.idb.transaction(this.storeName, "readwrite");
    tx.objectStore(this.storeName).put(value, key);
    return await tx.done;
  }

  async addMany(entries) {
    const tx = this.idb.transaction(this.storeName, "readwrite");
    for (const [key, value] of entries) {
      tx.objectStore(this.storeName).put(value, key);
    }
    return await tx.done;
  }

  async clear() {
    const tx = this.idb.transaction(this.storeName, "readwrite");
    tx.objectStore(this.storeName).clear();
    return await tx.done;
  }

  async keys() {
    const tx = this.idb.transaction(this.storeName);
    /** @type {Promise<string[]>} */
    const keys = tx.objectStore(this.storeName).getAllKeys();
    await tx.done;
    return keys;
  }
}

// STRING HELPERS
// Takes an array and returns a string that separates each of its items with the proper commas and
// "and". The second argument is a mapping function that can convert the items before they are
// joined
export function joinAnd(array = [], mapper = item => item, lang = docLang) {
  const items = array.map(mapper);
  if (Intl.ListFormat && typeof Intl.ListFormat === "function") {
    const formatter = new Intl.ListFormat(lang, {
      style: "long",
      type: "conjunction",
    });
    return formatter.format(items);
  }
  switch (items.length) {
    case 0:
    case 1: // "x"
      return items.toString();
    case 2: // x and y
      return items.join(l10n.x_and_y);
    default: {
      // x, y, and z
      const str = items.join(", ");
      const lastComma = str.lastIndexOf(",");
      const and = l10n.x_y_and_z;
      return `${str.substr(0, lastComma)}${and}${str.slice(lastComma + 2)}`;
    }
  }
}

// Takes a string, applies some XML escapes, and returns the escaped string.
// Note that overall using either Handlebars' escaped output or jQuery is much
// preferred to operating on strings directly.
export function xmlEscape(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * Trims string at both ends and replaces all other white space with a single space
 * @param {string} str
 */
export function norm(str) {
  return str.trim().replace(/\s+/g, " ");
}

/**
 * @param {string} lang
 */
function resolveLanguageAlias(lang) {
  const aliases = {
    "zh-hans": "zh",
    "zh-cn": "zh",
  };
  return aliases[lang] || lang;
}

/**
 * @template {Record<string, Record<string, string|Function>>} T
 * @param {T} localizationStrings
 * @returns {T[keyof T]}
 */
export function getIntlData(localizationStrings, lang = docLang) {
  lang = resolveLanguageAlias(lang.toLowerCase());
  // Proxy return type is a known bug:
  // https://github.com/Microsoft/TypeScript/issues/20846
  // @ts-ignore
  return new Proxy(localizationStrings, {
    /** @param {string} key */
    get(data, key) {
      const result = (data[lang] && data[lang][key]) || data.en[key];
      if (!result) {
        throw new Error(`No l10n data for key: "${key}"`);
      }
      return result;
    },
  });
}

// --- DATE HELPERS -------------------------------------------------------------------------------
// Takes a Date object and an optional separator and returns the year,month,day representation with
// the custom separator (defaulting to none) and proper 0-padding
export function concatDate(date, sep = "") {
  return ISODate.format(date).replace(dashes, sep);
}

// formats a date to "yyyy-mm-dd"
export function toShortIsoDate(date) {
  return ISODate.format(date);
}

// given either a Date object or a date in YYYY-MM-DD format,
// return a human-formatted date suitable for use in a W3C specification
export function humanDate(
  date = new Date(),
  lang = document.documentElement.lang || "en"
) {
  if (!(date instanceof Date)) date = new Date(date);
  const langs = [lang, "en"];
  const day = date.toLocaleString(langs, {
    day: "2-digit",
    timeZone: "UTC",
  });
  const month = date.toLocaleString(langs, {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.toLocaleString(langs, {
    year: "numeric",
    timeZone: "UTC",
  });
  // date month year
  return `${day} ${month} ${year}`;
}
// given either a Date object or a date in YYYY-MM-DD format,
// return an ISO formatted date suitable for use in a xsd:datetime item
export function isoDate(date) {
  return (date instanceof Date ? date : new Date(date)).toISOString();
}

// Given an object, it converts it to a key value pair separated by
// ("=", configurable) and a delimiter (" ," configurable).
// for example, {"foo": "bar", "baz": 1} becomes "foo=bar, baz=1"
export function toKeyValuePairs(obj, delimiter = ", ", separator = "=") {
  return Array.from(Object.entries(obj))
    .map(([key, value]) => `${key}${separator}${JSON.stringify(value)}`)
    .join(delimiter);
}

// STYLE HELPERS
// take a document and either a link or an array of links to CSS and appends
// a <link/> element to the head pointing to each
export function linkCSS(doc, styles) {
  const stylesArray = [].concat(styles);
  const frag = stylesArray
    .map(url => {
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      return link;
    })
    .reduce((elem, nextLink) => {
      elem.appendChild(nextLink);
      return elem;
    }, doc.createDocumentFragment());
  doc.head.appendChild(frag);
}

// TRANSFORMATIONS
// Run list of transforms over content and return result.
// Please note that this is a legacy method that is only kept in order
// to maintain compatibility
// with RSv1. It is therefore not tested and not actively supported.
/**
 * @this {any}
 * @param {string} content
 * @param {string} [flist]
 */
export function runTransforms(content, flist, ...funcArgs) {
  const args = [this, content, ...funcArgs];
  if (flist) {
    const methods = flist.split(/\s+/);
    for (const meth of methods) {
      /** @type {any} */
      const method = window[meth];
      if (method) {
        // the initial call passed |this| directly, so we keep it that way
        try {
          content = method.apply(this, args);
        } catch (e) {
          pub(
            "warn",
            `call to \`${meth}()\` failed with: ${e}. See error console for stack trace.`
          );
          console.error(e);
        }
      }
    }
  }
  return content;
}

/**
 * Cached request handler
 * @param {RequestInfo} input
 * @param {number} maxAge cache expiration duration in ms. defaults to 24 hours (86400000 ms)
 * @return {Promise<Response>}
 *  if a cached response is available and it's not stale, return it
 *  else: request from network, cache and return fresh response.
 *    If network fails, return a stale cached version if exists (else throw)
 */
export async function fetchAndCache(input, maxAge = 86400000) {
  const request = new Request(input);
  const url = new URL(request.url);

  // use data from cache data if valid and render
  let cache;
  let cachedResponse;
  if ("caches" in window) {
    try {
      cache = await caches.open(url.origin);
      cachedResponse = await cache.match(request);
      if (
        cachedResponse &&
        new Date(cachedResponse.headers.get("Expires")) > new Date()
      ) {
        return cachedResponse;
      }
    } catch (err) {
      console.error("Failed to use Cache API.", err);
    }
  }

  // otherwise fetch new data and cache
  const response = await fetch(request);
  if (!response.ok) {
    if (cachedResponse) {
      // return stale version
      console.warn(`Returning a stale cached response for ${url}`);
      return cachedResponse;
    }
  }

  // cache response
  if (cache && response.ok) {
    const clonedResponse = response.clone();
    const customHeaders = new Headers(response.headers);
    const expiryDate = new Date(Date.now() + maxAge);
    customHeaders.set("Expires", expiryDate.toString());
    const cacheResponse = new Response(await clonedResponse.blob(), {
      headers: customHeaders,
    });
    // put in cache, and forget it (there is no recovery if it throws, but that's ok).
    await cache.put(request, cacheResponse).catch(console.error);
  }
  return response;
}

// --- DOM HELPERS -------------------------------

export function htmlJoinComma(array, mapper = item => item) {
  const items = array.map(mapper);
  const joined = items.slice(0, -1).map(item => html`${item}, `);
  return html`${joined}${items[items.length - 1]}`;
}

/**
 * Separates each item with proper commas and "and".
 * @param {string[]} array
 * @param {(str: any) => object} mapper
 */
export function htmlJoinAnd(array, mapper = item => item) {
  const items = array.map(mapper);
  switch (items.length) {
    case 0:
    case 1: // "x"
      return items[0];
    case 2: // x and y
      return html`${items[0]}${l10n.x_and_y}${items[1]}`;
    default: {
      const joined = htmlJoinComma(items.slice(0, -1));
      return html`${joined}${l10n.x_y_and_z}${items[items.length - 1]}`;
    }
  }
}

/**
 * Creates and sets an ID to an element (elem) by hashing the text content.
 *
 * @param {HTMLElement} elem element to hash from
 * @param {String} prefix prefix to prepend to the generated id
 */
export function addHashId(elem, prefix = "") {
  const text = norm(elem.textContent);
  const hash = hashString(text);
  return addId(elem, prefix, hash);
}

/**
 * Creates and sets an ID to an element (elem)
 * using a specific prefix if provided, and a specific text if given.
 * @param {HTMLElement} elem element
 * @param {String} pfx prefix
 * @param {String} txt text
 * @param {Boolean} noLC do not convert to lowercase
 * @returns {String} generated (or existing) id for element
 */
export function addId(elem, pfx = "", txt = "", noLC = false) {
  if (elem.id) {
    return elem.id;
  }
  if (!txt) {
    txt = (elem.title ? elem.title : elem.textContent).trim();
  }
  let id = noLC ? txt : txt.toLowerCase();
  id = id
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\W+/gim, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  if (!id) {
    id = "generatedID";
  } else if (/\.$/.test(id) || !/^[a-z]/i.test(pfx || id)) {
    id = `x${id}`; // trailing . doesn't play well with jQuery
  }
  if (pfx) {
    id = `${pfx}-${id}`;
  }
  if (elem.ownerDocument.getElementById(id)) {
    let i = 0;
    let nextId = `${id}-${i}`;
    while (elem.ownerDocument.getElementById(nextId)) {
      i += 1;
      nextId = `${id}-${i}`;
    }
    id = nextId;
  }
  elem.id = id;
  return id;
}

/**
 * Returns all the descendant text nodes of an element.
 * @param {Node} el
 * @param {string[]} exclusions node localName to exclude
 * @param {object} options
 * @param {boolean} options.wsNodes if nodes that only have whitespace are returned.
 * @returns {Text[]}
 */
export function getTextNodes(el, exclusions = [], options = { wsNodes: true }) {
  const exclusionQuery = exclusions.join(", ");
  const acceptNode = (/** @type {Text} */ node) => {
    if (!options.wsNodes && !node.data.trim()) {
      return NodeFilter.FILTER_REJECT;
    }
    if (exclusionQuery && node.parentElement.closest(exclusionQuery)) {
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  };
  const nodeIterator = document.createNodeIterator(
    el,
    NodeFilter.SHOW_TEXT,
    acceptNode
  );
  /** @type {Text[]} */
  const textNodes = [];
  let node;
  while ((node = nodeIterator.nextNode())) {
    textNodes.push(/** @type {Text} */ (node));
  }
  return textNodes;
}

/**
 * For any element, returns an array of title strings that applies
 *   the algorithm used for determining the actual title of a
 *   <dfn> element (but can apply to other as well).
 * if args.isDefinition is true, then the element is a definition, not a
 *   reference to a definition. Any @title will be replaced with
 *   @data-lt to be consistent with Bikeshed / Shepherd.
 * This method now *prefers* the data-lt attribute for the list of
 *   titles. That attribute is added by this method to dfn elements, so
 *   subsequent calls to this method will return the data-lt based list.
 * @param {HTMLElement} elem
 * @returns {String[]} array of title strings
 */
export function getDfnTitles(elem) {
  const titleSet = new Set();
  // data-lt-noDefault avoid using the text content of a definition
  // in the definition list.
  // ltNodefault is === "data-lt-noDefault"... someone screwed up 😖
  const normText = "ltNodefault" in elem.dataset ? "" : norm(elem.textContent);
  const child = /** @type {HTMLElement | undefined} */ (elem.children[0]);
  if (elem.dataset.lt) {
    // prefer @data-lt for the list of title aliases
    elem.dataset.lt
      .split("|")
      .map(item => norm(item))
      .forEach(item => titleSet.add(item));
  } else if (
    elem.childNodes.length === 1 &&
    elem.getElementsByTagName("abbr").length === 1 &&
    child.title
  ) {
    titleSet.add(child.title);
  } else if (elem.textContent === '""') {
    titleSet.add("the-empty-string");
  }

  titleSet.add(normText);
  titleSet.delete("");

  // We could have done this with @data-lt (as the logic is same), but if
  // @data-lt was not present, we would end up using @data-local-lt as element's
  // id (in other words, we prefer textContent over @data-local-lt for dfn id)
  if (elem.dataset.localLt) {
    const localLt = elem.dataset.localLt.split("|");
    localLt.forEach(item => titleSet.add(norm(item)));
  }

  const titles = [...titleSet];
  return titles;
}

/**
 * For an element (usually <a>), returns an array of targets that
 * element might refer to, of the form
 * @typedef {object} LinkTarget
 * @property {string} for
 * @property {string} title
 *
 * For an element like:
 *  <p data-link-for="Int1"><a data-link-for="Int2">Int3.member</a></p>
 * we'll return:
 *  * {for: "int2", title: "int3.member"}
 *  * {for: "int3", title: "member"}
 *  * {for: "", title: "int3.member"}
 * @param {HTMLElement} elem
 * @returns {LinkTarget[]}
 */
export function getLinkTargets(elem) {
  /** @type {HTMLElement} */
  const linkForElem = elem.closest("[data-link-for]");
  const linkFor = linkForElem ? linkForElem.dataset.linkFor : "";
  const titles = getDfnTitles(elem);
  const results = titles.reduce((result, title) => {
    // supports legacy <dfn>Foo.Bar()</dfn> definitions
    const split = title.split(".");
    if (split.length === 2) {
      // If there are multiple '.'s, this won't match an
      // Interface/member pair anyway.
      result.push({ for: split[0], title: split[1] });
    }
    result.push({ for: linkFor, title });
    if (!linkForElem) result.push({ for: title, title });

    // Finally, we can try to match without link for
    if (linkFor !== "") result.push({ for: "", title });
    return result;
  }, []);
  return results;
}

/**
 * Changes name of a DOM Element
 * @param {Element} elem element to rename
 * @param {String} newName new element name
 * @returns {Element} new renamed element
 */
export function renameElement(elem, newName) {
  if (elem.localName === newName) return elem;
  const newElement = elem.ownerDocument.createElement(newName);
  // copy attributes
  for (const { name, value } of elem.attributes) {
    newElement.setAttribute(name, value);
  }
  // copy child nodes
  newElement.append(...elem.childNodes);
  elem.replaceWith(newElement);
  return newElement;
}

export function refTypeFromContext(ref, element) {
  const closestInformative = element.closest(nonNormativeSelector);
  let isInformative = false;
  if (closestInformative) {
    // check if parent is not normative
    isInformative =
      !element.closest(".normative") ||
      !closestInformative.querySelector(".normative");
  }
  // prefixes `!` and `?` override section behavior
  if (ref.startsWith("!")) {
    if (isInformative) {
      // A (forced) normative reference in informative section is illegal
      return { type: "informative", illegal: true };
    }
    isInformative = false;
  } else if (ref.startsWith("?")) {
    isInformative = true;
  }
  const type = isInformative ? "informative" : "normative";
  return { type, illegal: false };
}

/**
 * Wraps inner contents with the wrapper node
 * @param {Node} outer outer node to be modified
 * @param {Element} wrapper wrapper node to be appended
 */
export function wrapInner(outer, wrapper) {
  wrapper.append(...outer.childNodes);
  outer.appendChild(wrapper);
  return outer;
}

/**
 * Applies the selector for all its ancestors.
 * @param {Element} element
 * @param {string} selector
 */
export function parents(element, selector) {
  /** @type {Element[]} */
  const list = [];
  let parent = element.parentElement;
  while (parent) {
    const closest = parent.closest(selector);
    if (!closest) {
      break;
    }
    list.push(closest);
    parent = closest.parentElement;
  }
  return list;
}

/**
 * Calculates indentation when the element starts after a newline.
 * The value will be empty if no newline or any non-whitespace exists after one.
 * @param {Element} element
 *
 * @example `    <div></div>` returns "    " (4 spaces).
 */
export function getElementIndentation(element) {
  const { previousSibling } = element;
  if (!previousSibling || previousSibling.nodeType !== Node.TEXT_NODE) {
    return "";
  }
  const index = previousSibling.textContent.lastIndexOf("\n");
  if (index === -1) {
    return "";
  }
  const slice = previousSibling.textContent.slice(index + 1);
  if (/\S/.test(slice)) {
    return "";
  }
  return slice;
}

/**
 * Generates simple ids. The id's increment after it yields.
 *
 * @param {String} namespace A string like "highlight".
 * @param {number} counter A number, which can start at a given value.
 */
export function msgIdGenerator(namespace, counter = 0) {
  function* idGenerator(namespace, counter) {
    while (true) {
      yield `${namespace}:${counter}`;
      counter++;
    }
  }
  const gen = idGenerator(namespace, counter);
  return () => {
    return gen.next().value;
  };
}

export class InsensitiveStringSet extends Set {
  /**
   * @param {Array<String>} [keys] Optional, initial keys
   */
  constructor(keys = []) {
    super();
    for (const key of keys) {
      this.add(key);
    }
  }
  /**
   * @param {string} key
   */
  add(key) {
    if (!this.has(key) && !this.getCanonicalKey(key)) {
      return super.add(key);
    }
    return this;
  }
  /**
   * @param {string} key
   */
  has(key) {
    return (
      super.has(key) ||
      [...this.keys()].some(
        existingKey => existingKey.toLowerCase() === key.toLowerCase()
      )
    );
  }
  /**
   * @param {string} key
   */
  delete(key) {
    return super.has(key)
      ? super.delete(key)
      : super.delete(this.getCanonicalKey(key));
  }
  /**
   * @param {string} key
   */
  getCanonicalKey(key) {
    return super.has(key)
      ? key
      : [...this.keys()].find(
          existingKey => existingKey.toLowerCase() === key.toLowerCase()
        );
  }
}

export function makeSafeCopy(node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll("[id]").forEach(elem => elem.removeAttribute("id"));
  clone.querySelectorAll("dfn").forEach(dfn => renameElement(dfn, "span"));
  if (clone.hasAttribute("id")) clone.removeAttribute("id");
  removeCommentNodes(clone);
  return clone;
}

export function removeCommentNodes(node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT);
  for (const comment of [...walkTree(walker)]) {
    comment.remove();
  }
}

/**
 * @template {Node} T
 * @param {TreeWalker<T>} walker
 * @return {IterableIterator<T>}
 */
function* walkTree(walker) {
  while (walker.nextNode()) {
    yield /** @type {T} */ (walker.currentNode);
  }
}

/**
 * @template ValueType
 * @extends {Map<string, ValueType>}
 */
export class CaseInsensitiveMap extends Map {
  /**
   * @param {Array<[string, ValueType]>} [entries]
   */
  constructor(entries = []) {
    super();
    entries.forEach(([key, elem]) => {
      this.set(key, elem);
    });
    return this;
  }
  /**
   * @param {String} key
   * @param {ValueType} value
   */
  set(key, value) {
    super.set(key.toLowerCase(), value);
    return this;
  }
  /**
   * @param {String} key
   */
  get(key) {
    return super.get(key.toLowerCase());
  }
  /**
   * @param {String} key
   */
  has(key) {
    return super.has(key.toLowerCase());
  }
  /**
   * @param {String} key
   */
  delete(key) {
    return super.delete(key.toLowerCase());
  }
}
