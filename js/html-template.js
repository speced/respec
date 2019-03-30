// A shim to use hyperhtml on Node.js.
// TODO: migrate to ES module when top-level await arrives
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["require", "exports", "hyperhtml"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    const hypermorphic =
      typeof document !== "undefined"
        ? require("hyperhtml")
        : require("viperhtml");
    const v = factory(require, exports, hypermorphic);
    if (v !== undefined) module.exports = v;
  }
})((require, exports, hypermorphic) => {
  "use strict";
  exports.__esModule = true;
  exports.default = (strings, ...args) => {
    const normalized = args.map(normalizeArg);
    const result = (hypermorphic.default || hypermorphic)(
      strings,
      ...normalized
    );
    if (result.constructor.name === "Buffer") {
      const { JSDOM } = require("jsdom");
      const fragment = JSDOM.fragment(result.toString());
      if (fragment.childNodes.length === 1) {
        return fragment.childNodes[0];
      }
      return fragment;
    } else if (!(result instanceof Node)) {
      const fragment = document.createDocumentFragment();
      fragment.append(...result.childNodes);
      return fragment;
    }
    return result;
  };

  function normalizeArg(arg) {
    if (!Array.isArray(arg)) {
      const html = getOuterHTML(arg);
      if (html) {
        return [html];
      }
      return arg;
    }
    if (!arg.length || typeof arg[0] === "string") {
      return arg;
    }
    return arg.map(getOuterHTML);
  }

  function getOuterHTML(node) {
    if (!node || typeof node !== "object") {
      return "";
    }
    switch (node.nodeType) {
      case node.ELEMENT_NODE:
        return node.outerHTML;
      case node.TEXT_NODE:
        return node.textContent;
      case node.COMMENT_NODE:
        return `<!--${node.textContent}-->`;
      case node.DOCUMENT_FRAGMENT_NODE:
        return fragmentToHTML(node);
    }
    return "";
  }

  function fragmentToHTML(fragment) {
    let result = "";
    for (const node of fragment.childNodes) {
      result += getOuterHTML(node);
    }
    return result;
  }
  exports.fragmentToHTML = fragmentToHTML;
});
