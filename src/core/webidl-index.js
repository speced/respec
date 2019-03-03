/**
 * Module: core/webidl-index
 * constructs a summary of WebIDL in the document by
 * cloning all the generated WebIDL nodes and
 * appending them to pre element.
 *
 * Usage
 * Add a <section id="idl-index"> to the document.
 * It also supports title elements to generate a header.
 * Or if a header element is an immediate child, then
 * that is preferred.
 */
export const name = "core/webidl-index";
import { nonNormativeSelector } from "./utils";

export function run() {
  const idlIndexSec = document.querySelector("section#idl-index");
  if (!idlIndexSec) {
    return;
  }
  // Query for decedents headings, e.g., "h2:first-child, etc.."
  const query = [2, 3, 4, 5, 6].map(level => `h${level}:first-child`).join(",");
  if (!idlIndexSec.querySelector(query)) {
    const header = document.createElement("h2");
    if (idlIndexSec.title) {
      header.innerHTML = idlIndexSec.title;
      idlIndexSec.removeAttribute("title");
    } else {
      header.innerHTML = "IDL Index";
    }
    idlIndexSec.prepend(header);
  }

  // filter out the IDL marked with class="exclude" and the IDL in non-normative sections
  const idlIndex = Array.from(
    document.querySelectorAll("pre.def.idl:not(.exclude)")
  ).filter(idl => !idl.closest(nonNormativeSelector));

  if (idlIndex.length === 0) {
    const text = "This specification doesn't declare any Web IDL.";
    const noIDLFound = document.createTextNode(text);
    idlIndexSec.appendChild(noIDLFound);
    return;
  }

  const pre = document.createElement("pre");
  pre.classList.add("idl", "def");
  pre.id = "actual-idl-index";
  idlIndex
    .map(elem => {
      const fragment = document.createDocumentFragment();
      for (const child of elem.children) {
        fragment.appendChild(child.cloneNode(true));
      }
      return fragment;
    })
    .reduce((collector, elem) => {
      if (collector.lastChild) {
        collector.appendChild(document.createTextNode("\n\n"));
      }
      collector.appendChild(elem);
      return collector;
    }, pre);
  // Remove duplicate IDs
  pre.querySelectorAll("*[id]").forEach(elem => elem.removeAttribute("id"));
  idlIndexSec.appendChild(pre);
}
