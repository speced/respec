/*jshint browser: true */
/*globals console*/
// Module core/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit
// anywhere else.
import { pub } from "core/pubsubhub";

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
  return function(insertionPoint) {
    node.remove();
    insertionPoint.ownerDocument.adoptNode(node);
    if (insertionPoint.firstElementChild) {
      return insertionPoint.insertBefore(node, insertionPoint.firstElementChild);
    }
    insertionPoint.appendChild(node);
  };
}

export function calculateLeftPad(text) {
  if (typeof text !== "string") {
    throw new TypeError("Invalid input");
  }
  var spaceOrTab = /^[\ |\t]*/;
  // Find smallest padding value
  var leftPad = text
    .split("\n")
    .filter(function(item) {
      return item;
    })
    .reduce(function(smallest, item) {
      // can't go smaller than 0
      if (smallest === 0) {
        return smallest;
      }
      var match = item.match(spaceOrTab)[0] || "";
      return Math.min(match.length, smallest);
    }, +Infinity);
  return (leftPad === +Infinity) ? 0 : leftPad;
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
  var url = new URL(opts.href, document.location);
  var linkElem = document.createElement("link");
  var href = url.href;
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
          console.warn("Unknown request destination: " + opts.as);
        }
        linkElem.setAttribute("as", opts.as);
      }
      break;
    case "prerender":
      href = url.href;
      break;
  }
  linkElem.href = href;
  if (!opts.dontRemove) {
    linkElem.classList.add("removeOnSave");
  }
  return linkElem;
}
/**
 * Makes a ES conforming iterator allowing objects to be used with
 * methods that can interface with Iterators (Array.from(), etc.).
 *
 * @param  {Function} nextLikeFunction A function that returns a next value;
 * @return {Object} An object that implements the Iterator prop.
 */
export function toESIterable(nextLikeFunction) {
  if (typeof nextLikeFunction !== "function") {
    throw TypeError("Expected a function");
  }
  var next = function() {
    return {
      value: nextLikeFunction(),
      get done() {
        return this.value === null;
      }
    };
  };
  // We structure the iterator like this, or else
  // RequireJS gets upset.
  var iterator = {};
  iterator[Symbol.iterator] = function() {
    return {
      next: next
    };
  };
  return iterator;
}
const endsWithSpace = /\s+$/gm;
export function normalizePadding(text) {
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
    return node.nodeType === Node.TEXT_NODE;
  }
  // Force into body
  var parserInput = "<body>" + text;
  var doc = new DOMParser().parseFromString(parserInput, "text/html");
  // Normalize block level elements children first
  Array
    .from(doc.body.children)
    .filter(elem => !inlineElems.has(elem.localName))
    .filter(elem => elem.localName !== "pre")
    .forEach(elem => elem.innerHTML = normalizePadding(elem.innerHTML));
  // Normalize root level now
  Array
    .from(doc.body.childNodes)
    .filter(node => isTextNode(node) && node.textContent.trim() === "")
    .forEach(node => node.parentElement.replaceChild(doc.createTextNode("\n"), node));
  // Normalize text node
  if (!isTextNode(doc.body.firstChild)) {
    Array
      .from(doc.body.children)
      .forEach(child => child.innerHTML = normalizePadding(child.innerHTML));
  }
  doc.normalize();
  // use the first space as an indicator of how much to chop off the front
  const firstSpace = doc.body.innerText.split("\n").filter(item => item && item.startsWith(" "))[0];
  var chop = firstSpace ? firstSpace.match(/\ +/)[0].length : 0;
  if (chop) {
    const replacer = new RegExp("^\ {1," + chop + "}", "gm");
    Array
      .from(doc.body.childNodes)
      .filter(node => node.localName !== "pre")
      .filter(isTextNode)
      .filter(node => {
        // we care about text next to a block level element
        const prevSib = node.previousElementSibling;
        const nextTo = prevSib ? prevSib.localName : node.parentElement.localName;
        // and we care about text elements that finish on a new line
        return !inlineElems.has(nextTo) || node.textContent.trim().includes("\n");
      })
      .forEach(node => {
        // We need to retain white space if the text Node is next to an in-line element
        let padding = "";
        const prevSib = node.previousElementSibling;
        const nextTo = prevSib ? prevSib.localName : node.parentElement.localName;
        if (/^[\t\ ]/.test(node.textContent) && inlineElems.has(nextTo)) {
          padding = node.textContent.match(/^\s+/)[0];
        }
        node.textContent = padding + node.textContent.replace(replacer, "");
      });
  }
  const result = endsWithSpace.test(doc.body.innerHTML) ? doc.body.innerHTML.trimRight() + "\n" : doc.body.innerHTML;
  return result;
}

// RESPEC STUFF
export function removeReSpec(doc) {
  Array
    .from(
      doc.querySelectorAll(".remove, script[data-requiremodule]")
    ).forEach(function(elem) {
      elem.remove();
    });
}

// STRING HELPERS
// Takes an array and returns a string that separates each of its items with the proper commas and
// "and". The second argument is a mapping function that can convert the items before they are
// joined
export function joinAnd(arr, mapper) {
  if (!arr || !arr.length) return "";
  mapper = mapper || function(ret) {
    return ret;
  };
  var ret = "";
  if (arr.length === 1) return mapper(arr[0], 0);
  for (var i = 0, n = arr.length; i < n; i++) {
    if (i > 0) {
      if (n === 2) ret += " ";
      else ret += ", ";
      if (i == n - 1) ret += "and ";
    }
    ret += mapper(arr[i], i);
  }
  return ret;
}

// Takes a string, applies some XML escapes, and returns the escaped string.
// Note that overall using either Handlebars' escaped output or jQuery is much
// preferred to operating on strings directly.
export function xmlEscape(s) {
  return s.replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

// Trims string at both ends and replaces all other white space with a single space
export function norm(str) {
  return str.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/).join(" ");
}

// --- DATE HELPERS -------------------------------------------------------------------------------
// Takes a Date object and an optional separator and returns the year,month,day representation with
// the custom separator (defaulting to none) and proper 0-padding
export function concatDate(date, sep) {
  if (!sep) sep = "";
  return "" + date.getFullYear() + sep + lead0(date.getMonth() + 1) + sep + lead0(date.getDate());
}

// takes a string, prepends a "0" if it is of length 1, does nothing otherwise
export function lead0(str) {
  str = "" + str;
  return (str.length == 1) ? "0" + str : str;
}

// takes a YYYY-MM-DD date and returns a Date object for it
export function parseSimpleDate(str) {
  return new Date(str.substr(0, 4), (str.substr(5, 2) - 1), str.substr(8, 2));
}

// takes what document.lastModified returns and produces a Date object for it
export function parseLastModified(str) {
  if (!str) return new Date();
  return new Date(Date.parse(str));
  // return new Date(str.substr(6, 4), (str.substr(0, 2) - 1), str.substr(3, 2));
}

// list of human names for months (in English)
export const humanMonths = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

// given either a Date object or a date in YYYY-MM-DD format, return a human-formatted
// date suitable for use in a W3C specification
export function humanDate(date) {
  if (!(date instanceof Date)) date = parseSimpleDate(date);
  return lead0(date.getDate()) + " " + humanMonths[date.getMonth()] + " " + date.getFullYear();
}
// given either a Date object or a date in YYYY-MM-DD format, return an ISO formatted
// date suitable for use in a xsd:datetime item
export function isoDate(date) {
  if (!(date instanceof Date)) date = parseSimpleDate(date);
  return date.toISOString();
}

// Given an object, it converts it to a key value pair separated by
// ("=", configurable) and a delimiter (" ," configurable).
// for example, {"foo": "bar", "baz": 1} becomes "foo=bar, baz=1"
export function toKeyValuePairs(obj, delimiter, separator) {
  if (!separator) {
    separator = "=";
  }
  if (!delimiter) {
    delimiter = ", ";
  }
  return Object.getOwnPropertyNames(obj)
    .map(function(key) {
      return key + separator + JSON.stringify(obj[key]);
    })
    .join(delimiter);
}

// STYLE HELPERS
// take a document and either a link or an array of links to CSS and appends a <link/> element
// to the head pointing to each
export function linkCSS(doc, styles) {
  var stylesArray = Array.isArray(styles) ? [].concat(styles) : [styles];
  var frag = stylesArray
    .map(function(url) {
      var link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      return link;
    })
    .reduce(function(elem, nextLink) {
      elem.appendChild(nextLink);
      return elem;
    }, doc.createDocumentFragment());
  doc.head.appendChild(frag);
}

// TRANSFORMATIONS
// Run list of transforms over content and return result.
// Please note that this is a legacy method that is only kept in order to maintain compatibility
// with RSv1. It is therefore not tested and not actively supported.
export function runTransforms(content, flist) {
  var args = [this, content];
  var funcArgs = Array.from(arguments);
  funcArgs.shift();
  funcArgs.shift();
  args = args.concat(funcArgs);
  if (flist) {
    var methods = flist.split(/\s+/);
    for (var j = 0; j < methods.length; j++) {
      var meth = methods[j];
      if (window[meth]) {
        // the initial call passed |this| directly, so we keep it that way
        try {
          content = window[meth].apply(this, args);
        } catch (e) {
          pubsubhub.pub("warn", "call to " + meth + "() failed with " + e);
        }
      }
    }
  }
  return content;
}
