/**
 * Module: core/webidl-index
 * constructs a summary of WebIDL in the document by
 * cloning all the generated contiguous WebIDL nodes and
 * appending them to pre element.
 *
 * Usage
 * Add a <section id="idl-index"> to the document.
 * It also supports title elements to generate a header.
 * Or if a header element is an immediate child, then
 * that is preferred.
 */
"use strict";
define(["core/webidl-contiguous"], function(webIDL) {
  var resolveDone;
  const done = new Promise(function(resolve) {
    resolveDone = resolve;
  });
  const idlIndexSec = document.querySelector("section#idl-index");
  if (idlIndexSec) {
    // Query for decedents headings, e.g., ":scope > h2, etc.."
    const query = [2, 3, 4, 5, 6]
      .map(function(level) {
        return ":scope > h" + level;
      })
      .join(",");
    if (!idlIndexSec.querySelector(query)) {
      const header = document.createElement("h2");
      if (idlIndexSec.title) {
        header.innerHTML = idlIndexSec.title;
        idlIndexSec.removeAttribute("title");
      } else {
        header.innerHTML = "IDL Index";
      }
      idlIndexSec.insertAdjacentElement("afterbegin", header);
    }
    if (!document.querySelector("pre.idl")) {
      const text = "This specification doesn't declare any Web IDL.";
      const noIDLFound = document.createTextNode(text);
      idlIndexSec.appendChild(noIDLFound);
      resolveDone();
    } else {
      webIDL.done.then(function() {
        const virtualSummary = document.createDocumentFragment();
        const pre = document.createElement("pre");
        pre.classList.add("idl", "def");
        Array
          .from(document.querySelectorAll("pre.def.idl"))
          .map(function(elem) {
            return elem.cloneNode(true).firstElementChild;
          })
          .map(function(elem) {
            const div = document.createElement("div");
            div.appendChild(elem);
            div.appendChild(document.createTextNode("\n"))
            div.classList.add("respec-idl-separator");
            return div;
          })
          .reduce(function(collector, elem) {
            collector.appendChild(elem);
            return collector;
          }, pre);
        virtualSummary.appendChild(pre);
        idlIndexSec.appendChild(virtualSummary);
        resolveDone();
      });
    }
  } else {
    resolveDone();
  }
  return {
    get done() {
      return done;
    },
  };
});
