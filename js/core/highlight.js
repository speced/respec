// Module core/highlight
// Does syntax highlighting to all pre and code that have a class of "highlight"
// An improvement would be to use web workers to do the highlighting.
"use strict";
define(
  [
    "core/pubsubhub",
    "core/utils",
    "core/worker",
    "deps/text!core/css/github.css",
  ],
  function(pubsubhub, utils, worker, ghCss) {
    // Opportunistically insert the style into the head to reduce FOUC.
    var codeStyle = document.createElement("style");
    codeStyle.textContent = ghCss;
    var swapStyleOwner = utils.makeOwnerSwapper(codeStyle);
    swapStyleOwner(document.head);

    function getLanguageHint(classList) {
      return Array
	.from(classList)
	.filter(function(item) {
	  return item !== "highlight"
	})
	.map(function(item) {
	  return item.toLowerCase(item)
	});
    }

    return {
      run: function(conf, doc, cb) {
        // Nothing to do
        if (conf.noHighlightCSS) {
          return cb();
        }

        if (codeStyle.ownerDocument !== doc) {
          swapStyleOwner(doc.head);
        }

	if (doc.querySelector(".highlight")) {
          pubsubhub.pub("warn", "pre elements don't need a 'highlight' class anymore.");
        }

	const promisesToHighlight = Array
          .from(
            doc.querySelectorAll("pre:not(.idl)")
          )
	  .map(function(element) {
	    return new Promise(function(resolve, reject) {
	      const msg = {
		action: "highlight",
		code: element.innerHTML,
		id: Math.random().toString(),
		languages: getLanguageHint(element.classList),
	      };
	      worker.postMessage(msg);
	      worker.addEventListener("message", function handler(ev) {
		if (ev.data.id !== msg.id) {
		  return; // not for us!
		}
		worker.removeEventListener("message", handler);
		element.innerHTML = ev.data.value;
		resolve();
	      });
	      setTimeout(function() {
		const errMsg = "Timeout error trying to process: " + msg.code;
		const err = new Error(errMsg);
		reject(err)
	      }, 5000);
	    });
	  });
	Promise
	  .all(promisesToHighlight)
	  .then(function() { cb() })
	  .catch(function(err) {
	    console.error(err);
          });
      }
    };
  }
);
