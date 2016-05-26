/**
 * Module core/markdown
 * Handles the optional markdown processing.
 *
 * Markdown support is optional. It is enabled by setting the `format`
 * property of the configuration object to "markdown."
 *
 * We use marked for parsing Markdown:
 * https://github.com/chjj/marked
 *
 * Note that the content of SECTION elements, and elements with a
 * class name of "note", "issue" or "req" are also parsed.
 *
 * The HTML created by the Markdown parser is turned into a nested
 * structure of SECTION elements, following the structure given by
 * the headings. For example, the following markup:
 *
 *     Title
 *     -----
 *
 *     ### Subtitle ###
 *
 *     Here's some text.
 *
 *     ### Another subtitle ###
 *
 *     More text.
 *
 * will be transformed into:
 *
 *     <section>
 *       <h2>Title</h2>
 *       <section>
 *         <h3>Subtitle</h3>
 *         <p>Here's some text.</p>
 *       </section>
 *       <section>
 *         <h3>Another subtitle</h3>
 *         <p>More text.</p>
 *       </section>
 *     </section>
 *
 * The whitespace of pre elements are left alone.
 **/
"use strict";
define([
  "marked",
  "core/utils",
  "highlight",
  "beautify-html",
  "core/beautify-options",
], function(marked, utils, hljs, beautify, beautifyOps) {
  var defaultLanguages = Object.freeze([
    "css",
    "html",
    "js",
    "json",
    "xml",
  ]);

  hljs.configure({
    tabReplace: "  ", // 2 spaces
  });

  marked.setOptions({
    sanitize: false,
    gfm: true,
    highlight: makeHighlightHelper(),
  });

  function makeHighlightHelper() {
    var div = document.createElement("div");
    return function(code, language) {
      var leftPadding = utils.calculateLeftPad(code);
      var normalizedCode;
      if (leftPadding) {
        var leftPaddingMatcher = new RegExp("^ {" + leftPadding + "}", "gm");
        normalizedCode = code.replace(leftPaddingMatcher, "");
      } else {
        normalizedCode = code;
      }
      div.innerHTML = normalizedCode;
      var cleanCode = div.textContent;
      var possibleLanguages = [].concat(language || defaultLanguages);
      var highlightedCode = hljs.highlightAuto(cleanCode, possibleLanguages);
      return highlightedCode.value;
    };
  }

  function toHTML(text) {
    var normalizedLeftPad = utils.normalizePadding(text);
    // As markdown is pulled from HTML, > is already escaped and
    // so blockquotes aren't picked up by the parser. This fixes it.
    var potentialMarkdown = normalizedLeftPad.replace(/&gt;/g, ">");
    var html = marked(potentialMarkdown);
    return html;
  }

  function processElements(selector) {
    return function (element) {
      Array
        .from(element.querySelectorAll(selector))
        .map(function (elem) {
          return {
            element: elem,
            html: toHTML(elem.innerHTML)
          };
        })
        .reduce(function (div, item) {
          var element = item.element;
          var node = div;
          div.innerHTML = item.html;
          // Same element, don't nest
          if (div.firstChild && element.localName === div.firstChild.localName) {
            node = div.firstChild;
          }
          element.innerHTML = "";
          while (node.firstChild) {
            item.element.appendChild(node.firstChild);
          }
          return div;
        }, element.ownerDocument.createElement("div"));
    };
  }

  function makeBuilder(doc) {
    var root = doc.createDocumentFragment();
    var stack = [root];
    var current = root;
    var headers = /H[1-6]/;

    function findPosition(header) {
      return parseInt(header.tagName.charAt(1), 10);
    }

    function findParent(position) {
      var parent;
      while (position > 0) {
        position--;
        parent = stack[position];
        if (parent) return parent;
      }
    }

    function findHeader(node) {
      node = node.firstChild;
      while (node) {
        if (headers.test(node.tagName)) {
          return node;
        }
        node = node.nextSibling;
      }
      return null;
    }

    function addHeader(header) {
      var section = doc.createElement("section");
      var position = findPosition(header);

      section.appendChild(header);
      findParent(position).appendChild(section);
      stack[position] = section;
      stack.length = position + 1;
      current = section;
    }

    function addSection(node, process) {
      var header = findHeader(node);
      var position = header ? findPosition(header) : 1;
      var parent = findParent(position);

      if (header) {
        node.removeChild(header);
      }

      node.appendChild(process(node));

      if (header) {
        node.insertBefore(header, node.firstChild);
      }

      parent.appendChild(node);
      current = parent;
    }

    function addElement(node) {
      current.appendChild(node);
    }

    function getRoot() {
      return root;
    }

    return {
      addHeader: addHeader,
      addSection: addSection,
      addElement: addElement,
      getRoot: getRoot
    };
  }

  function structure(fragment, doc) {
    function process(root) {
      var node;
      var tagName;
      var stack = makeBuilder(doc);

      while (root.firstChild) {
        node = root.firstChild;
        if (node.nodeType !== Node.ELEMENT_NODE) {
          root.removeChild(node);
          continue;
        }
        tagName = node.localName;
        switch (tagName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          stack.addHeader(node);
          break;
        case "section":
          stack.addSection(node, process);
          break;
        default:
          stack.addElement(node);
        }
      }

      return stack.getRoot();
    }

    return process(fragment);
  }

  function substituteWithTextNodes(elements) {
    Array
      .from(elements)
      .forEach(function(element) {
        var textNode = element.ownerDocument.createTextNode(element.textContent);
        element.parentElement.replaceChild(textNode, element);
      });
  }

  var processBlockLevelElements = processElements("section, .issue, .note, .req");

  return {
    run: function(conf, doc, cb) {
      if (conf.format === "markdown") {
        // We transplant the UI to do the markdown processing
        var rsUI = doc.getElementById("respec-ui");
        rsUI.remove();
        // The new body will replace the old body
        var newBody = doc.createElement("body");
        newBody.innerHTML = doc.body.innerHTML;
        // Marked expects markdown be flush against the left margin
        // so we need to normalize the inner text of some block
        // elements.
        processBlockLevelElements(newBody);
        var dirtyHTML = toHTML(newBody.innerHTML);
        // Markdown parsing sometimes inserts empty p tags
        var cleanHTML = dirtyHTML
          .replace(/<p>\s*<\/p>/gm, "")
          // beautifer has a bad time with "\n&quot;<element"
          // https://github.com/beautify-web/js-beautify/issues/943
          .replace(/\n\s*&quot;</mg, " &quot;<");
        var beautifulHTML = beautify.html_beautify(cleanHTML, beautifyOps);
        newBody.innerHTML = beautifulHTML;
        // Remove links where class pre.nolinks
        substituteWithTextNodes(newBody.querySelectorAll("pre.nolinks a[href]"));
        // Restructure the document properly
        var fragment = structure(newBody, doc);
        // Frankenstein the whole thing back together
        newBody.appendChild(fragment);
        newBody.appendChild(rsUI);
        doc.body.parentNode.replaceChild(newBody, doc.body);
      }
      cb();
    }
  };
});
