/*globals console*/
// Module core/data-include
// Support for the data-include attribute. Causes external content to be included inside an
// element that has data-include='some URI'. There is also a data-oninclude attribute that
// features a white space separated list of global methods that will be called with the
// module object, the content, and the included URI.
//
// IMPORTANT:
//  This module only really works when you are in an HTTP context, and will most likely
//  fail if you are editing your documents on your local drive. That is due to security
//  restrictions in the browser.
"use strict";
define(
  ["core/utils", "core/pubsubhub"],
  function(utils, pubsubhub) {
    function processResponse(response, el) {
      return response
        .text()
        .then(function(rawData) {
          var data = utils.runTransforms(rawData, el.dataset.oninclude, response.url);
          var replace = typeof el.dataset.includeReplace === "string";
          var replacementNode;
          switch (el.dataset.includeFormat) {
            case "text":
              if (replace) {
                replacementNode = document.createTextNode(data);
                el.parentNode.replaceChild(replacementNode, el);
              } else {
                el.textContent = data;
              }
              break;
            default: // html, which is just using "innerHTML"
              el.innerHTML = data;
              if (replace) {
                replacementNode = document.createDocumentFragment();
                while (el.hasChildNodes()) {
                  replacementNode.append(el.removeChild(el.firstChild));
                }
                el.parentNode.replaceChild(replacementNode, el);
              }
          }
          // If still in the dom tree, clean up
          if (el.parentNode) {
            cleanUp(el);
          }
        });
    }
    /**
     * Removes attributes after they are used for inclusion, if present.
     *
     * @param {Element} el The element to clean up.
     */
    function cleanUp(el) {
      [
        "data-include",
        "data-include-format",
        "data-include-replace",
        "oninclude",
      ].forEach(function(attr) {
        el.removeAttribute(attr);
      });
    }

    return {
      run: function(conf, doc, cb) {
        const promisesToInclude = Array
          .from(
            doc.querySelectorAll("[data-include]")
          )
          .map(function(el) {
            var url = el.dataset.include;
            if (!url) {
              return Promise.resolve(); // just skip it
            }
            return fetch(url)
              .then(function(response) {
                return processResponse(response, el);
              })
              .catch(function(err) {
                var msg = "data-include failed: " + url;
                msg += " (" + err.message + ") See dev console for more details.";
                console.error("data-include failed for element: ", el, err);
                pubsubhub.pub("error", msg);
              });
          });
        Promise
          .all(promisesToInclude)
          .then(cb);
      }
    };
  }
);
