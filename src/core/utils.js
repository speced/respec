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
 * @param {String} text
 */
function hashString(text) {
  let hash = 0;
  for (const char of text) {
    hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
  }
  return String(hash);
}

export const ISODate = new Intl.DateTimeFormat(["en-ca-iso8601"], {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** CSS selector for matching elements that are non-normative */
export const nonNormativeSelector =
  ".informative, .note, .issue, .example, .ednote, .practice, .introductory";

/**
 * Creates a link element that represents a resource hint.
 *
 * @param {ResourceHintOption} opts Configure the resource hint.
 * @return {HTMLLinkElement} A link element ready to use.
 */
export function createResourceHint(opts) {
  const url = new URL(opts.href, document.baseURI);
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
      if ("as" in opts) {
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
/**
 * @param {Document} doc
 */
export function removeReSpec(doc) {
  doc.querySelectorAll(".remove, script[data-requiremodule]").forEach(elem => {
    elem.remove();
  });
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

// STRING HELPERS
/**
 * @param {"conjunction"|"disjunction"} type
 * @param {"long"|"narrow"} style
 */
function joinFactory(type, style = "long") {
  const formatter = new Intl.ListFormat(docLang, { style, type });
  /**
   * @template T
   * @param {string[]} items
   * @param {(value: string, index: number, array: string[]) => any} [mapper]
   */
  return (items, mapper) => {
    let elemCount = 0;
    return formatter.formatToParts(items).map(({ type, value }) => {
      if (type === "element" && mapper) {
        return mapper(value, elemCount++, items);
      }
      return value;
    });
  };
}

/**
 * Takes an array and returns a string that separates each of its items with the
 * proper commas and "and". The second argument is a mapping function that can
 * convert the items before they are joined.
 */
const conjunction = joinFactory("conjunction");
const disjunction = joinFactory("disjunction");

/**
 *
 * @param {string[]} items
 * @param {(value: undefined, index: number, array: undefined[]) => string} [mapper]
 */
export function joinAnd(items, mapper) {
  return conjunction(items, mapper).join("");
}

/**
 *
 * @param {string[]} items
 * @param {(value: undefined, index: number, array: undefined[]) => string} [mapper]
 */
export function joinOr(items, mapper) {
  return disjunction(items, mapper).join("");
}

/**
 * Takes a string, applies some XML escapes, and returns the escaped string.
 * @param {string} str
 */
export function xmlEscape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * Trims string at both ends and replaces all other white space with a single
 * space.
 * @param {string} str
 */
export function norm(str) {
  return str.trim().replace(/\s+/g, " ");
}

/**
 * @param {string} lang
 */
export function resolveLanguageAlias(lang) {
  const lCaseLang = lang.toLowerCase();
  const aliases = {
    "zh-hans": "zh",
    "zh-cn": "zh",
  };
  return aliases[lCaseLang] || lCaseLang;
}

/**
 * @template {Record<string, Record<string, string|Function>>} T
 * @param {T} localizationStrings
 * @returns {T[keyof T]}
 */
export function getIntlData(localizationStrings, lang = docLang) {
  lang = resolveLanguageAlias(lang);
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
/**
 * Takes a Date object and an optional separator and returns the year,month,day
 * representation with the custom separator (defaulting to none) and proper
 * 0-padding.
 * @param {Date} date
 */
export function concatDate(date, sep = "") {
  return ISODate.format(date).replace(dashes, sep);
}

/**
 * Formats a date to "yyyy-mm-dd".
 * @param {Date} date
 */
export function toShortIsoDate(date) {
  return ISODate.format(date);
}

/**
 * Given either a Date object or a date in `YYYY-MM-DD` format, return a
 * human-formatted date suitable for use in the specification.
 * @param {Date | string} [date]
 */
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

/**
 * Given either a Date object or a date in `YYYY-MM-DD` format, return an ISO
 * formatted date suitable for use in a xsd:datetime item
 * @param {Date | string} date
 */
export function isoDate(date) {
  return (date instanceof Date ? date : new Date(date)).toISOString();
}

/**
 * Checks if a date is in expected format used by ReSpec (yyyy-mm-dd)
 * @param {string} rawDate
 */
export function isValidConfDate(rawDate) {
  const date = /\d{4}-\d{2}-\d{2}/.test(rawDate)
    ? new Date(rawDate)
    : "Invalid Date";
  return date.toString() !== "Invalid Date";
}

/**
 * Given an object, it converts it to a key value pair separated by ("=", configurable) and a delimiter (" ," configurable).
 * @example {"foo": "bar", "baz": 1} becomes "foo=bar, baz=1"
 * @param {Record<string, any>} obj
 */
export function toKeyValuePairs(obj, delimiter = ", ", separator = "=") {
  return Array.from(Object.entries(obj))
    .map(([key, value]) => `${key}${separator}${JSON.stringify(value)}`)
    .join(delimiter);
}

// STYLE HELPERS
/**
 * Take a document and either a link or an array of links to CSS and appends a
 * `<link rel="stylesheet">` element to the head pointing to each.
 * @param {Document} doc
 * @param {string | string[]} urls
 */
export function linkCSS(doc, urls) {
  const stylesArray = [].concat(urls);
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

/**
 * Run list of transforms over content and return result.
 *
 * Please note that this is a legacy method that is only kept in order to
 * maintain compatibility with RSv1. It is therefore not tested and not actively
 * supported.
 * @this {any}
 * @param {string} content
 * @param {string} [flist] List of global function names.
 * @param {unknown[]} [funcArgs] Arguments to pass to each function.
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
          const msg = `call to \`${meth}()\` failed with: ${e}.`;
          const hint = "See developer console for stack trace.";
          showWarning(msg, "utils/runTransforms", { hint });
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
 * @param {number} maxAge cache expiration duration in ms. defaults to 24 hours
 * @return {Promise<Response>}
 *  if a cached response is available and it's not stale, return it
 *  else: request from network, cache and return fresh response.
 *    If network fails, return a stale cached version if exists (else throw)
 */
export async function fetchAndCache(input, maxAge = 24 * 60 * 60 * 1000) {
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
    customHeaders.set("Expires", expiryDate.toISOString());
    const cacheResponse = new Response(await clonedResponse.blob(), {
      headers: customHeaders,
    });
    // put in cache, and forget it (there is no recovery if it throws, but that's ok).
    await cache.put(request, cacheResponse).catch(console.error);
  }
  return response;
}

// --- DOM HELPERS -------------------------------

/**
 * Separates each item with proper commas.
 * @template T
 * @param {T[]} array
 * @param {(item: T) => any} [mapper]
 */
export function htmlJoinComma(array, mapper = item => item) {
  const items = array.map(mapper);
  const joined = items.slice(0, -1).map(item => html`${item}, `);
  return html`${joined}${items[items.length - 1]}`;
}
/**
 *
 * @param {string[]} array
 * @param {(item: any) => any[]} [mapper]
 */
export function htmlJoinAnd(array, mapper) {
  const result = [].concat(conjunction(array, mapper));
  return result.map(item => (typeof item === "string" ? html`${item}` : item));
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
 * Creates and sets an ID to an element (elem) using a specific prefix if
 * provided, and a specific text if given.
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
 * @param {boolean} options.wsNodes return only whitespace-only nodes.
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
 * For any element, returns an array of title strings that applies the algorithm
 * used for determining the actual title of a `<dfn>` element (but can apply to
 * other as well).
 *
 * This method now *prefers* the `data-lt` attribute for the list of titles.
 * That attribute is added by this method to `<dfn>` elements, so subsequent
 * calls to this method will return the `data-lt` based list.
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
 * For an element (usually <a>), returns an array of targets that element might
 * refer to, in the object structure:
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
 * @param {Object} options
 * @param {boolean} options.copyAttributes
 *
 * @returns {Element} new renamed element
 */
export function renameElement(
  elem,
  newName,
  options = { copyAttributes: true }
) {
  if (elem.localName === newName) return elem;
  const newElement = elem.ownerDocument.createElement(newName);
  // copy attributes
  if (options.copyAttributes) {
    for (const { name, value } of elem.attributes) {
      newElement.setAttribute(name, value);
    }
  }
  // copy child nodes
  newElement.append(...elem.childNodes);
  elem.replaceWith(newElement);
  return newElement;
}

/**
 * @param {string} ref
 * @param {HTMLElement} element
 */
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
 * Calculates indentation when the element starts after a newline. The value
 * will be empty if no newline or any non-whitespace exists after one.
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
  /** @returns {Generator<string, never, never>}  */
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

/** @extends {Set<string>} */
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

/**
 * @param {HTMLElement} node
 */
export function makeSafeCopy(node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll("[id]").forEach(elem => elem.removeAttribute("id"));
  clone.querySelectorAll("dfn").forEach(dfn => {
    renameElement(dfn, "span", { copyAttributes: false });
  });
  if (clone.hasAttribute("id")) clone.removeAttribute("id");
  removeCommentNodes(clone);
  return clone;
}

/**
 * @param {Node} node
 */
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

export class RespecError extends Error {
  /**
   * @param {Parameters<typeof showError>[0]} message
   * @param {Parameters<typeof showError>[1]} plugin
   * @param {Parameters<typeof showError>[2] & { isWarning: boolean }} options
   */
  constructor(message, plugin, options) {
    super(message);
    const name = options.isWarning ? "ReSpecWarning" : "ReSpecError";
    Object.assign(this, { message, plugin, name, ...options });
    if (options.elements) {
      options.elements.forEach(elem =>
        markAsOffending(elem, message, options.title)
      );
    }
  }

  toJSON() {
    const { message, name, stack } = this;
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/26792
    const { plugin, hint, elements, title, details } = this;
    return { message, name, plugin, hint, elements, title, details, stack };
  }
}

/**
 * @param {string} message
 * @param {string} pluginName Name of plugin that caused the error.
 * @param {object} [options]
 * @param {string} [options.hint] How to solve the error?
 * @param {HTMLElement[]} [options.elements] Offending elements.
 * @param {string} [options.title] Title attribute for offending elements. Can be a shorter form of the message.
 * @param {string} [options.details] Any further details/context.
 */
export function showError(message, pluginName, options = {}) {
  const opts = { ...options, isWarning: false };
  pub("error", new RespecError(message, pluginName, opts));
}

/**
 * @param {string} message
 * @param {string} pluginName Name of plugin that caused the error.
 * @param {object} [options]
 * @param {string} [options.hint] How to solve the error?
 * @param {HTMLElement[]} [options.elements] Offending elements.
 * @param {string} [options.title] Title attribute for offending elements. Can be a shorter form of the message.
 * @param {string} [options.details] Any further details/context.
 */
export function showWarning(message, pluginName, options = {}) {
  const opts = { ...options, isWarning: true };
  pub("warn", new RespecError(message, pluginName, opts));
}

/**
 * Makes a string `coded`.
 *
 * @param {string} item
 * @returns {string}
 */
export function toMDCode(item) {
  return item ? `\`${item}\`` : "";
}

/**
 * Joins an array of strings, wrapping each string in back-ticks (`) for inline markdown code.
 *
 * @param {string[]} array
 * @param {object} options
 * @param {boolean} options.quotes Surround each item in quotes
 */
export function codedJoinOr(array, { quotes } = { quotes: false }) {
  return joinOr(array, quotes ? s => toMDCode(addQuotes(s)) : toMDCode);
}

/**
 * Wraps in back-ticks ` for code.
 *
 * @param {string[]} array
 * @param {object} options
 * @param {boolean} options.quotes Surround each item in quotes
 */
export function codedJoinAnd(array, { quotes } = { quotes: false }) {
  return joinAnd(array, quotes ? s => toMDCode(addQuotes(s)) : toMDCode);
}

function addQuotes(item) {
  return String(item) ? `"${item}"` : "";
}

/**
 * Tagged template string, helps with linking to documentation.
 * Things inside [squareBrackets] are considered direct links to the documentation.
 * To alias something, one can use a "|", like [respecConfig|#respec-configuration].
 * @param {TemplateStringsArray} strings
 * @param {string[]} keys
 */
export function docLink(strings, ...keys) {
  return strings
    .map((s, i) => {
      const key = keys[i];
      if (!key) {
        return s;
      }
      // Linkables are wrapped in square brackets
      if (!key.startsWith("[") && !key.endsWith("]")) {
        return s + key;
      }

      const [linkingText, href] = key.slice(1, -1).split("|");
      if (href) {
        const url = new URL(href, "https://respec.org/docs/");
        return `${s}[${linkingText}](${url})`;
      }
      return `${s}[\`${linkingText}\`](https://respec.org/docs/#${linkingText})`;
    })
    .join("");
}
