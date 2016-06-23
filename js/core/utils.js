/*jshint laxcomma: true*/
// Module core/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit
// anywhere else.
"use strict";
define(
  ["core/pubsubhub"],
  function(pubsubhub) {
    var utils = {
      /**
       * Allows a node to be swapped into a different document at
       * some insertion point(Element). This function is useful for
       * opportunistic insertion of DOM nodes into a document, without
       * first knowing if that is the final document where the node will
       * reside.
       *
       * @param  {Node} node The node to be swapped.
       * @return {Function} A function that takes a document and a new
       *                    insertion point (element). When called,
       *                    node gets inserted into doc at before a given
       *                    insertion point (node) - or just appended, if
       *                    the element has no children.
       */
      makeOwnerSwapper: function(node) {
        if (!(node instanceof Node)) {
          throw TypeError();
        }
        return function(doc, insertionPoint) {
          node.remove();
          doc.adoptNode(node);
          var firstElementChild = this.findFirstElementChild(insertionPoint);
          if (firstElementChild) {
            insertionPoint.insertBefore(node, firstElementChild);
            return;
          }
          insertionPoint.appendChild(node);
        }.bind(this);
      },
      /**
       * Finds the first Element child, given a node. Provides support for
       * Microsoft Edge's missing support of .firstElementChild.
       *
       * @param  {Node} node The node to be traversed.
       * @return {Element}   The first Element in the child list.
       */
      findFirstElementChild: function(node) {
        if (!node.hasChildNodes()) {
          return null;
        }
        // We have native support
        if (node.firstElementChild) {
          return node.firstElementChild;
        }
        return Array
          .from(node.childNodes)
          .find(function(node) {
            return node.nodeType === Node.ELEMENT_NODE;
          });
      },
      calculateLeftPad: function(text) {
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
      },

      /**
       * Makes a ES conforming iterator allowing objects to be used with
       * methods that can interface with Iterators (Array.from(), etc.).
       *
       * @param  {Function} nextLikeFunction A function that returns a next value;
       * @return {Object} An object that implements the Iterator prop.
       */
      toESIterable: function(nextLikeFunction) {
        if (!(nextLikeFunction instanceof Function)) {
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
      },
      normalizePadding: function(text) {
        if (!text) {
          return "";
        }

        if (typeof text !== "string") {
          throw TypeError("Invalid input");
        }

        if (text === "\n") {
          return "\n";
        }

        function isEmpty(node) {
          return node.textContent === "";
        }

        function isWhiteSpace(node) {
          return !/\S/gm.test(node.textContent);
        }

        function filterLastChildIsPadding(node) {
          if (node.parentElement.lastChild === node && (isWhiteSpace(node) || isEmpty(node))) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }

        function isTextNode(node) {
          return node.nodeType === Node.TEXT_NODE;
        }

        function parentIs(type) {
          return function checkParent(node) {
            if (!node) {
              return false;
            }
            var match = node.parentNode && node.parentNode.localName === type;
            return (!match) ? checkParent(node.parentNode) : true;
          };
        }
        var filterParentIsPre = parentIs("pre");
        // Force into body
        var parserInput = "<body>" + text;
        var doc = new DOMParser().parseFromString(parserInput, "text/html");

        var firstPaddedLine = Array
          .from(doc.body.childNodes)
          .filter(isTextNode)
          .map(function(textNode) {
            return textNode.textContent;
          })
          .find(function(textContent) {
            var result = /^[\#|\s|\w]+/gm.test(textContent);
            return result;
          });
        // There is no padding, so just return what we started with.
        if (!firstPaddedLine) {
          return text;
        }

        var baseColumn = this.calculateLeftPad(firstPaddedLine);

        // Only if we have a baseColumn to work with ...
        // With only the text nodes that are not children of pre elements,
        // we left align all those text nodes.
        if (baseColumn) {
          Array
            .from(doc.body.childNodes)
            .filter(isTextNode)
            .filter(function(textNode) {
              // 🎵 Hey, processor! Leave those pre's alone! 🎵
              return !filterParentIsPre(textNode);
            })
            .filter(function(textNode) {
              // we don't care about last nodes that are just white space
              var isLastChild = textNode.parentElement.lastChild === textNode;
              var isJustWS = isWhiteSpace(textNode);
              return !(isLastChild && isJustWS);
            })
            .map(function toTrimmedTextNode(textNode) {
              var rawText = textNode.textContent;
              // We remove tailing space on the right, which is just there
              // to pad out tags like:
              // <div>
              //   <div>
              //    Next line has 2 spaces hidden!
              // __</div>
              // </div>
              //
              var trimmedRight = rawText.trimRight();
              var trimBy = this.calculateLeftPad(trimmedRight) || baseColumn;
              if (!trimBy) {
                return null; //nothing to do
              }
              var exp = "^ {" + trimBy + "}";
              var startTrim = new RegExp(exp, "gm");
              var trimmedText = (trimBy) ? rawText.replace(startTrim, "") : rawText;
              var newNode = textNode.ownerDocument.createTextNode(trimmedText);
              // We can then swap the old with the new
              return {
                oldNode: textNode,
                newNode: newNode,
              };
            }.bind(this))
            .filter(function(nodes) {
              return nodes;
            })
            .forEach(function(nodes) {
              var oldNode = nodes.oldNode;
              var newNode = nodes.newNode;
              oldNode.parentElement.replaceChild(newNode, oldNode);
            });
        }
        var nodeIterator = doc.createNodeIterator(doc.body, NodeFilter.SHOW_TEXT, filterLastChildIsPadding);
        var iterable = this.toESIterable(nodeIterator.nextNode.bind(nodeIterator));
        // Remove trailing whitespace nodes
        Array
          .from(iterable)
          .forEach(function(node) {
            node.remove();
          });
        var result = doc.body.innerHTML;
        return result;
      },

      // RESPEC STUFF
      removeReSpec: function(doc) {
        $(".remove, script[data-requiremodule]", doc).remove();
      },

      // STRING HELPERS
      // Takes an array and returns a string that separates each of its items with the proper commas and
      // "and". The second argument is a mapping function that can convert the items before they are
      // joined
      joinAnd: function(arr, mapper) {
        if (!arr || !arr.length) return "";
        mapper = mapper || function(ret) {
          return ret;
        };
        var ret = "";
        if (arr.length === 1) return mapper(arr[0], 0);
        for (var i = 0, n = arr.length; i < n; i++) {
          if (i > 0) {
            if (n === 2) ret += ' ';
            else ret += ', ';
            if (i == n - 1) ret += 'and ';
          }
          ret += mapper(arr[i], i);
        }
        return ret;
      },
      // Takes a string, applies some XML escapes, and returns the escaped string.
      // Note that overall using either Handlebars' escaped output or jQuery is much
      // preferred to operating on strings directly.
      xmlEscape: function(s) {
        return s.replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/</g, "&lt;");
      },

      // Trims string at both ends and replaces all other white space with a single space
      norm: function(str) {
        return str.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/).join(" ");
      },

      // --- DATE HELPERS -------------------------------------------------------------------------------
      // Takes a Date object and an optional separator and returns the year,month,day representation with
      // the custom separator (defaulting to none) and proper 0-padding
      concatDate: function(date, sep) {
        if (!sep) sep = "";
        return "" + date.getFullYear() + sep + this.lead0(date.getMonth() + 1) + sep + this.lead0(date.getDate());
      },

      // takes a string, prepends a "0" if it is of length 1, does nothing otherwise
      lead0: function(str) {
        str = "" + str;
        return (str.length == 1) ? "0" + str : str;
      },

      // takes a YYYY-MM-DD date and returns a Date object for it
      parseSimpleDate: function(str) {
        return new Date(str.substr(0, 4), (str.substr(5, 2) - 1), str.substr(8, 2));
      },

      // takes what document.lastModified returns and produces a Date object for it
      parseLastModified: function(str) {
        if (!str) return new Date();
        return new Date(Date.parse(str));
        // return new Date(str.substr(6, 4), (str.substr(0, 2) - 1), str.substr(3, 2));
      },

      // list of human names for months (in English)
      humanMonths: ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
      ],

      // given either a Date object or a date in YYYY-MM-DD format, return a human-formatted
      // date suitable for use in a W3C specification
      humanDate: function(date) {
        if (!(date instanceof Date)) date = this.parseSimpleDate(date);
        return this.lead0(date.getDate()) + " " + this.humanMonths[date.getMonth()] + " " + date.getFullYear();
      },
      // given either a Date object or a date in YYYY-MM-DD format, return an ISO formatted
      // date suitable for use in a xsd:datetime item
      isoDate: function(date) {
        if (!(date instanceof Date)) date = this.parseSimpleDate(date);
        // return "" + date.getUTCFullYear() +'-'+ this.lead0(date.getUTCMonth() + 1)+'-' + this.lead0(date.getUTCDate()) +'T'+this.lead0(date.getUTCHours())+':'+this.lead0(date.getUTCMinutes()) +":"+this.lead0(date.getUTCSeconds())+'+0000';
        return date.toISOString();
      },

      // Given an object, it converts it to a key value pair separated by
      // ("=", configurable) and a delimiter (" ," configurable).
      // for example, {"foo": "bar", "baz": 1} becomes "foo=bar, baz=1"
      toKeyValuePairs: function(obj, delimiter, separator) {
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
      },

      // STYLE HELPERS
      // take a document and either a link or an array of links to CSS and appends a <link/> element
      // to the head pointing to each
      linkCSS: function(doc, styles) {
        if (!Array.isArray(styles)) {
          styles = [styles];
        }
        styles
          .map(function(url) {
            var link = doc.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            return link;
          })
          .reduce(function(elem, nextLink) {
            elem.appendChild(nextLink);
            return elem;
          }, doc.head);
      },

      // TRANSFORMATIONS
      // Run list of transforms over content and return result.
      // Please note that this is a legacy method that is only kept in order to maintain compatibility
      // with RSv1. It is therefore not tested and not actively supported.
      runTransforms: function(content, flist) {
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
    };
    return utils;
  }
);
