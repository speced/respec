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
    const preprocessed = preprocessArgs(args);
    const result = (hypermorphic.default || hypermorphic)(
      strings,
      ...preprocessed.result
    );
    const fragment = createFragment(result);
    restoreReplacements(fragment, preprocessed.nodes);
    return fragment;
  };

  function createFragment(result) {
    if (result.constructor.name === "Buffer") {
      const { JSDOM } = require("jsdom");
      const fragment = JSDOM.fragment(result.toString());
      const { childNodes } = fragment;
      if (childNodes.length === 1) {
        return childNodes[0];
      }
      if (fragment.children.length) {
        childNodes.forEach(removeIfEmptyText);
        if (childNodes.length === 1) {
          return childNodes[0];
        }
      }
      return fragment;
    } else if (!(result instanceof Node)) {
      const fragment = document.createDocumentFragment();
      fragment.append(...result.childNodes);
      return fragment;
    }
    return result;
  }

  function preprocessArgs(args) {
    function iterative(arg) {
      if (arg == null) {
        return arg;
      } else if (arg.nodeType) {
        nodes.push(arg);
        return [replacement];
      } else if (!Array.isArray(arg) || !(arg.find(_ => _) || {}).nodeType) {
        return arg;
      }
      nodes.push(...arg);
      return [arg.map(_ => replacement).join("")];
    }

    const replacement = "<respec-replacement></respec-replacement>";
    const nodes = [];
    const result = args.map(iterative);
    return { result, nodes };
  }

  function restoreReplacements(target, nodes) {
    if (target.localName === "respec-replacement") {
      target.replaceWith(nodes[0]);
      return;
    } else if (!target.childNodes.length) {
      return;
    }
    const reps = target.querySelectorAll("respec-replacement");
    for (const [i, rep] of reps.entries()) {
      rep.replaceWith(nodes[i]);
    }
  }

  function removeIfEmptyText(node) {
    if (node.nodeType === node.TEXT_NODE && !node.textContent.trim()) {
      node.remove();
    }
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
