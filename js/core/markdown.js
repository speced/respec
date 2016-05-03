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
define(['marked', 'core/utils'], function (marked, utils) {

  marked.setOptions({
    sanitize: false,
  });

  function toHTML(text) {
    // As markdown is pulled from HTML > is already escaped, and
    // thus blockquotes aren't picked up by the parser. This fixes
    // it.
    var cleanText = text.replace(/&gt;/g, '>');
    var normalizedLeftPad = utils.normalizePadding(cleanText);
    var html = marked(normalizedLeftPad);
    return html;
  }

  function processElements(selector) {
    return function (doc) {
      Array
        .from(doc.querySelectorAll(selector))
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
          element.innerHTML = '';
          while (node.firstChild) {
            item.element.appendChild(node.firstChild);
          }
          return div;
        }, doc.createElement("div"));
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
      var section = doc.createElement('section');
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
        if (node.nodeType !== 1) {
          root.removeChild(node);
          continue;
        }
        tagName = node.localName;
        switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          stack.addHeader(node);
          break;
        case 'section':
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
  var processSections = processElements("section");
  var processIssuesNotesAndReqs = processElements(".issue, .note, .req");

  return {
    run: function (conf, doc, cb, msg) {
      msg.pub("start", "core/markdown");
      if (conf.format === 'markdown') {
        // We transplant the UI to do the markdown processing
        var rsUI = doc.getElementById("respec-ui");
        rsUI.remove();
        // Marked expects markdown be flush against the left margin
        // so we need to normalize the inner text of all block
        // elements.
        processSections(doc);
        processIssuesNotesAndReqs(doc);
        var html = toHTML(doc.body.innerHTML);
        // Now we create a new body and replace the old body
        var newBody = doc.createElement("body");
        newBody.innerHTML = html;
        // Restructure the document properly
        var fragment = structure(newBody, doc);
        newBody.appendChild(fragment);
        newBody.appendChild(rsUI);

        // Frankenstein the whole thing back together
        doc.body.parentNode.replaceChild(newBody, doc.body);
      }
      msg.pub("end", "core/markdown");
      cb();
    }
  };
});
