// @ts-check
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
import { nonNormativeSelector, wrapInner } from "./utils.js";
import { addIDLHeader } from "./webidl.js";

export function run() {
  /** @type {HTMLElement | null} */
  const idlIndexSec = document.querySelector("section#idl-index");
  if (!idlIndexSec) {
    return;
  }
  // Query for decedents headings, e.g., "h2:first-child, etc.."
  const query = [2, 3, 4, 5, 6].map(level => `h${level}:first-child`).join(",");
  if (!idlIndexSec.querySelector(query)) {
    const header = document.createElement("h2");
    if (idlIndexSec.title) {
      header.textContent = idlIndexSec.title;
      idlIndexSec.removeAttribute("title");
    } else {
      header.textContent = "IDL Index";
    }
    idlIndexSec.prepend(header);
  }

  // filter out the IDL marked with class="exclude" and the IDL in non-normative sections
  const idlIndex = Array.from(
    document.querySelectorAll("pre.idl:not(.exclude) > code")
  ).filter(idl => !idl.closest(nonNormativeSelector));

  if (idlIndex.length === 0) {
    const text = "This specification doesn't normatively declare any Web IDL.";
    idlIndexSec.append(text);
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
    .forEach(elem => {
      if (pre.lastChild) {
        pre.append("\n\n");
      }
      pre.appendChild(elem);
    });
  // Remove duplicate IDs
  pre.querySelectorAll("*[id]").forEach(elem => elem.removeAttribute("id"));

  // Add our own IDL header
  idlIndexSec.appendChild(pre);
  wrapInner(pre, document.createElement("code"));
  addIDLHeader(pre);
}
