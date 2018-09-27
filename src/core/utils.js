/*jshint browser: true */
/*globals console*/
// Module core/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit
// anywhere else.
import { pub } from "core/pubsubhub";
import marked from "deps/marked";
export const name = "core/utils";

marked.setOptions({
  sanitize: false,
  gfm: true,
  headerIds: false,
});

const spaceOrTab = /^[ |\t]*/;
const endsWithSpace = /\s+$/gm;
const dashes = /-/g;
const gtEntity = /&gt;/gm;
const ampEntity = /&amp;/gm;

export function markdownToHtml(text) {
  const normalizedLeftPad = normalizePadding(text);
  // As markdown is pulled from HTML, > and & are already escaped and
  // so blockquotes aren't picked up by the parser. This fixes it.
  const potentialMarkdown = normalizedLeftPad
    .replace(gtEntity, ">")
    .replace(ampEntity, "&");
  const result = marked(potentialMarkdown);
  return result;
}

export const ISODate = new Intl.DateTimeFormat(["en-ca-iso8601"], {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const inlineElems = new Set([
  "a",
  "abbr",
  "acronym",
  "b",
  "bdo",
  "big",
  "br",
  "button",
  "cite",
  "code",
  "dfn",
  "em",
  "i",
  "img",
  "input",
  "kbd",
  "label",
  "map",
  "object",
  "q",
  "samp",
  "script",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "textarea",
  "time",
  "tt",
  "var",
]);

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

/**
 * Allows a node to be swapped into a different document at
 * some insertion point(Element). This function is useful for
 * opportunistic insertion of DOM nodes into a document, without
 * first knowing if that is the final document where the node will
 * reside.
 *
 * @param  {Node} node The node to be swapped.
 * @return {Function} A function that takes a new
 *                    insertion point (Node). When called,
 *                    node gets inserted into doc at before a given
 *                    insertion point (Node) - or just appended, if
 *                    the element has no children.
 */
export function makeOwnerSwapper(node) {
  if (!node) {
    throw new TypeError("Expected instance of Node.");
  }
  return insertionPoint => {
    insertionPoint.ownerDocument.adoptNode(node);
    if (insertionPoint.firstElementChild) {
      return insertionPoint.insertBefore(
        node,
        insertionPoint.firstElementChild
      );
    }
    insertionPoint.appendChild(node);
  };
}

export function calculateLeftPad(text) {
  if (typeof text !== "string") {
    throw new TypeError("Invalid input");
  }
  // Find smallest padding value
  const leftPad = text
    .split("\n")
    .filter(item => item)
    .reduce((smallest, item) => {
      // can't go smaller than 0
      if (smallest === 0) {
        return smallest;
      }
      const match = item.match(spaceOrTab)[0] || "";
      return Math.min(match.length, smallest);
    }, +Infinity);
  return leftPad === +Infinity ? 0 : leftPad;
}
/**
 * Creates a link element that represents a resource hint.
 *
 * @param {Object} opts Configure the resource hint.
 * @param {String} opts.hint The type of hint (see resourceHints).
 * @param {URL|String} opts.href The URL for the resource or origin.
 * @param {String} [opts.corsMode] Optional, the CORS mode to use (see HTML spec).
 * @param {String} [opts.as] Optional, fetch destination type (see fetchDestinations).
 * @param {Bool} [opts.dontRemove] If the hint should remain in the spec after processing.
 * @return {HTMLLinkElement} A link element ready to use.
 */
export function createResourceHint(opts) {
  if (!opts || typeof opts !== "object") {
    throw new TypeError("Missing options");
  }
  if (!resourceHints.has(opts.hint)) {
    throw new TypeError("Invalid resources hint");
  }
  const url = new URL(opts.href, document.location);
  const linkElem = document.createElement("link");
  let href = url.href;
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

export function normalizePadding(text = "") {
  if (!text) {
    return "";
  }
  if (typeof text !== "string") {
    throw TypeError("Invalid input");
  }
  if (text === "\n") {
    return "\n";
  }

  function isTextNode(node) {
    return node !== null && node.nodeType === Node.TEXT_NODE;
  }
  // Force into body
  const parserInput = "<body>" + text;
  const doc = new DOMParser().parseFromString(parserInput, "text/html");
  // Normalize block level elements children first
  Array.from(doc.body.children)
    .filter(elem => !inlineElems.has(elem.localName))
    .filter(elem => elem.localName !== "pre")
    .filter(elem => elem.localName !== "table")
    .forEach(elem => {
      elem.innerHTML = normalizePadding(elem.innerHTML);
    });
  // Normalize root level now
  Array.from(doc.body.childNodes)
    .filter(node => isTextNode(node) && node.textContent.trim() === "")
    .forEach(node =>
      node.parentElement.replaceChild(doc.createTextNode("\n"), node)
    );
  // Normalize text node
  if (!isTextNode(doc.body.firstChild)) {
    Array.from(doc.body.firstChild.children)
      .filter(child => child.localName !== "table")
      .forEach(child => {
        child.innerHTML = normalizePadding(child.innerHTML);
      });
  }
  doc.normalize();
  // use the first space as an indicator of how much to chop off the front
  const firstSpace = doc.body.innerText
    .replace(/^ *\n/, "")
    .split("\n")
    .filter(item => item && item.startsWith(" "))[0];
  const chop = firstSpace ? firstSpace.match(/ +/)[0].length : 0;
  if (chop) {
    // Chop chop from start, but leave pre elem alone
    Array.from(doc.body.childNodes)
      .filter(node => node.localName !== "pre")
      .filter(isTextNode)
      .filter(node => {
        // we care about text next to a block level element
        const prevSib = node.previousElementSibling;
        const nextTo = prevSib
          ? prevSib.localName
          : node.parentElement.localName;
        // and we care about text elements that finish on a new line
        return (
          !inlineElems.has(nextTo) || node.textContent.trim().includes("\n")
        );
      })
      .reduce((replacer, node) => {
        // We need to retain white space if the text Node is next to an in-line element
        let padding = "";
        const prevSib = node.previousElementSibling;
        const nextTo = prevSib
          ? prevSib.localName
          : node.parentElement.localName;
        if (/^[\t ]/.test(node.textContent) && inlineElems.has(nextTo)) {
          padding = node.textContent.match(/^\s+/)[0];
        }
        node.textContent = padding + node.textContent.replace(replacer, "");
        return replacer;
      }, new RegExp("^ {1," + chop + "}", "gm"));
    // deal with pre elements... we can chop whitespace from their siblings
    const endsWithSpace = new RegExp(`\\ {${chop}}$`, "gm");
    Array.from(doc.body.querySelectorAll("pre"))
      .map(elem => elem.previousSibling)
      .filter(isTextNode)
      .reduce((chop, node) => {
        if (endsWithSpace.test(node.textContent)) {
          node.textContent = node.textContent.substr(
            0,
            node.textContent.length - chop
          );
        }
        return chop;
      }, chop);
  }
  const result = endsWithSpace.test(doc.body.innerHTML)
    ? doc.body.innerHTML.trimRight() + "\n"
    : doc.body.innerHTML;
  return result;
}

/**
 * Removes common indents across the IDL texts,
 * so that indentation inside <pre> won't affect the rendered result.
 * @param {string} text IDL text
 */
export function reindent(text) {
  if (!text) {
    return text;
  }
  // TODO: use trimEnd when Edge supports it
  const lines = text.trimRight().split("\n");
  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }
  const indents = lines.filter(s => s.trim()).map(s => s.search(/[^\s]/));
  const leastIndent = Math.min(...indents);
  return lines.map(s => s.slice(leastIndent)).join("\n");
}

// RESPEC STUFF
export function removeReSpec(doc) {
  doc.querySelectorAll(".remove, script[data-requiremodule]").forEach(elem => {
    elem.remove();
  });
}

/**
 * Adds error class to each element while emitting a warning
 * @param {Element|Array:Elements} elems
 * @param {String} msg message to show in warning
 * @param {String} title error message to add on each element
 */
export function showInlineError(elems, msg, title) {
  if (!Array.isArray(elems)) elems = [elems];
  if (!elems.length) return;
  if (!title) title = msg;
  elems.forEach(elem => {
    elem.classList.add("respec-offending-element");
    elem.setAttribute("title", title);
  });
  pub("warn", msg + " See developer console for details.");
  console.warn(msg, elems);
}

// STRING HELPERS
// Takes an array and returns a string that separates each of its items with the proper commas and
// "and". The second argument is a mapping function that can convert the items before they are
// joined
export function joinAnd(array = [], mapper = item => item) {
  const items = array.map(mapper);
  switch (items.length) {
    case 0:
    case 1: // "x"
      return items.toString();
    case 2: // x and y
      return items.join(" and ");
    default: {
      // x, y, and z
      const str = items.join(", ");
      const lastComma = str.lastIndexOf(",");
      return `${str.substr(0, lastComma + 1)} and ${str.slice(lastComma + 2)}`;
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

// Trims string at both ends and replaces all other white space with a single space
export function norm(str) {
  return str.trim().replace(/\s+/g, " ");
}

// semverCompare
// https://github.com/substack/semver-compare
export function semverCompare(a, b) {
  const pa = a.split(".");
  const pb = b.split(".");
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
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

// takes a string, prepends a "0" if it is of length 1, does nothing otherwise
export function lead0(str) {
  return String(str).length === 1 ? "0" + str : str;
}

// takes a YYYY-MM-DD date and returns a Date object for it
export function parseSimpleDate(str) {
  return new Date(str);
}

// takes what document.lastModified returns and produces a Date object for it
export function parseLastModified(str) {
  if (!str) return new Date();
  return new Date(Date.parse(str));
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
  //date month year
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
export function runTransforms(content, flist) {
  let args = [this, content];
  const funcArgs = Array.from(arguments);
  funcArgs.shift();
  funcArgs.shift();
  args = args.concat(funcArgs);
  if (flist) {
    const methods = flist.split(/\s+/);
    for (let j = 0; j < methods.length; j++) {
      const meth = methods[j];
      if (window[meth]) {
        // the initial call passed |this| directly, so we keep it that way
        try {
          content = window[meth].apply(this, args);
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
 * @param {Request} request
 * @param {Object} maxAge cache expiration duration in ms. defaults to 24 hours (86400000 ms)
 * @return {Response}
 *  if a cached response is available and it's not stale, return it
 *  else: request from network, cache and return fresh response.
 *    If network fails, return a stale cached version if exists (else throw)
 */
export async function fetchAndCache(request, maxAge = 86400000) {
  if (typeof request === "string" || request instanceof URL) {
    request = new Request(request);
  }
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
  if (cache) {
    const clonedResponse = response.clone();
    const customHeaders = new Headers(response.headers);
    const expiryDate = new Date(Date.now() + maxAge);
    customHeaders.set("Expires", expiryDate);
    const cacheResponse = new Response(await clonedResponse.blob(), {
      headers: customHeaders,
    });
    // put in cache, and forget it (there is no recovery if it throws, but that's ok).
    await cache.put(request, cacheResponse).catch(console.error);
    return await cache.match(request);
  }
  return response;
}

// --- COLLECTION/ITERABLE HELPERS ---------------
/**
 * Spreads one iterable into another.
 *
 * @param {Iterable} collector
 * @param {any|Iterable} item
 * @returns {Array}
 */
export function flatten(collector, item) {
  const isObject = typeof item === "object";
  const isIterable =
    Object(item)[Symbol.iterator] && typeof item.values === "function";
  const items = !isObject
    ? [item]
    : isIterable
      ? [...item.values()].reduce(flatten, [])
      : Object.values(item);
  return [...collector, ...items];
}

// --- DOM HELPERS -------------------------------

/**
 * Creates and sets an ID to an element (elem)
 * using a specific prefix if provided, and a specific text if given.
 * @param {Element} elem element
 * @param {String} pfx prefix
 * @param {String} txt text
 * @param {Boolean} noLC
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
  } else if (/\.$/.test(id) || !/^[a-z]/i.test(id)) {
    id = "x" + id; // trailing . doesn't play well with jQuery
  }
  if (pfx) {
    id = `${pfx}-${id}`;
  }
  if (elem.ownerDocument.getElementById(id)) {
    let i = 0;
    let nextId = id + "-" + i;
    while (elem.ownerDocument.getElementById(nextId)) {
      nextId = id + "-" + i++;
    }
    id = nextId;
  }
  elem.id = id;
  return id;
}

/**
 * Returns all the descendant text nodes of an element.
 * @param {Node} el
 * @param {Array:String} exclusions node localName to exclude
 * @returns {Array:String}
 */
export function getTextNodes(el, exclusions = []) {
  const acceptNode = node => {
    return exclusions.includes(node.parentElement.localName)
      ? NodeFilter.FILTER_REJECT
      : NodeFilter.FILTER_ACCEPT;
  };
  const nodeIterator = document.createNodeIterator(
    el,
    NodeFilter.SHOW_TEXT,
    { acceptNode },
    false
  );
  const textNodes = [];
  let node;
  while ((node = nodeIterator.nextNode())) {
    textNodes.push(node);
  }
  return textNodes;
}

/**
 * For any element, returns an array of title strings that applies
 *   the algorithm used for determining the actual title of a
 *   <dfn> element (but can apply to other as well).
 * if args.isDefinition is true, then the element is a definition, not a
 *   reference to a definition. Any @title or @lt will be replaced with
 *   @data-lt to be consistent with Bikeshed / Shepherd.
 * This method now *prefers* the data-lt attribute for the list of
 *   titles. That attribute is added by this method to dfn elements, so
 *   subsequent calls to this method will return the data-lt based list.
 * @param {Element} elem
 * @param {Object} args
 * @returns {String[]} array of title strings
 */
export function getDfnTitles(elem, args) {
  let titleString = "";
  let normText = "";
  //data-lt-noDefault avoid using the text content of a definition
  //in the definition list.
  if (!elem.hasAttribute("data-lt-noDefault")) {
    normText = norm(elem.textContent).toLowerCase();
  }
  if (elem.dataset.lt) {
    // prefer @data-lt for the list of title aliases
    titleString = elem.dataset.lt.toLowerCase();
    if (normText !== "" && !titleString.startsWith(`${normText}|`)) {
      // Use the definition itself, so to avoid having to declare the definition twice.
      titleString = titleString + "|" + normText;
    }
  } else if (
    elem.childNodes.length === 1 &&
    elem.getElementsByTagName("abbr").length === 1 &&
    elem.children[0].title
  ) {
    titleString = elem.children[0].title;
  } else {
    titleString =
      elem.textContent === '""' ? "the-empty-string" : elem.textContent;
  }

  // now we have a string of one or more titles
  titleString = norm(titleString).toLowerCase();
  if (args && args.isDefinition === true) {
    if (elem.dataset.lt) {
      elem.dataset.lt = titleString;
    }
    // if there is no pre-defined type, assume it is a 'dfn'
    if (!elem.dataset.dfnType) elem.dataset.dfnType = "dfn";
  }

  const titles = titleString
    .split("|")
    .filter(item => item !== "")
    .reduce((collector, item) => collector.add(item), new Set());
  return [...titles];
}

/**
 * For an element (usually <a>), returns an array of targets that
 * element might refer to, of the form
 * @typedef {for: 'interfacename', title: 'membername'} LinkTarget
 *
 * For an element like:
 *  <p link-for="Int1"><a for="Int2">Int3.member</a></p>
 * we'll return:
 *  * {for: "int2", title: "int3.member"}
 *  * {for: "int3", title: "member"}
 *  * {for: "", title: "int3.member"}
 * @param {Element} elem
 * @returns {LinkTarget[]}
 */
export function getLinkTargets(elem) {
  const linkForElem = elem.closest("[data-link-for]");
  const linkFor = linkForElem ? linkForElem.dataset.linkFor.toLowerCase() : "";
  const titles = getDfnTitles(elem);

  return titles.reduce((result, title) => {
    result.push({ for: linkFor, title });
    const split = title.split(".");
    if (split.length === 2) {
      // If there are multiple '.'s, this won't match an
      // Interface/member pair anyway.
      result.push({ for: split[0], title: split[1] });
    }
    result.push({ for: "", title });
    return result;
  }, []);
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
  for (let i = 0, n = elem.attributes.length; i < n; i++) {
    const { name, value } = elem.attributes[i];
    newElement.setAttribute(name, value);
  }

  // copy child nodes
  do {
    newElement.appendChild(elem.firstChild);
  } while (elem.firstChild);

  // TODO: replace with ChildNode.replaceWith, when available in Safari
  elem.parentNode.replaceChild(newElement, elem);
  return newElement;
}
