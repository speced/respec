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
export const name = "core/webidl-index";

export function run(conf, doc, cb) {
  const idlIndexSec = doc.querySelector("section#idl-index");
  if (!idlIndexSec) {
    return cb();
  }
  // Query for decedents headings, e.g., "h2:first-child, etc.."
  const query = [2, 3, 4, 5, 6]
    .map(level => `h${level}:first-child`)
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
    return cb();
  }
  const virtualSummary = document.createDocumentFragment();
  const pre = document.createElement("pre");
  pre.classList.add("idl", "def");
  Array
    .from(document.querySelectorAll("pre.def.idl"))
    .map(elem => {
      const div = document.createElement("div");
      const clone = elem.cloneNode(true).firstElementChild;
      div.appendChild(clone);
      div.appendChild(document.createTextNode("\n"))
      div.classList.add("respec-idl-separator");
      return div;
    })
    .reduce((collector, elem) => {
      collector.appendChild(elem);
      return collector;
    }, pre);
  virtualSummary.appendChild(pre);
  idlIndexSec.appendChild(virtualSummary);
  cb();
}
