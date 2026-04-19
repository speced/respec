// @ts-check
/**
 * Module: core/cddl-index
 * Constructs a summary of CDDL in the document by
 * cloning all the generated CDDL nodes and
 * appending them to a pre element.
 *
 * Usage:
 * Add a <section id="cddl-index"> to the document.
 * It also supports title elements to generate a header.
 * Or if a header element is an immediate child, then
 * that is preferred.
 */
export const name = "core/cddl-index";
import { nonNormativeSelector } from "./utils.js";

export function run() {
  /** @type {HTMLElement | null} */
  const cddlIndexSec = document.querySelector("section#cddl-index");
  if (!cddlIndexSec) {
    return;
  }

  if (
    !cddlIndexSec.querySelector(":scope > :is(h2, h3, h4, h5, h6):first-child")
  ) {
    const header = document.createElement("h2");
    if (cddlIndexSec.title) {
      header.textContent = cddlIndexSec.title;
      cddlIndexSec.removeAttribute("title");
    } else {
      header.textContent = "CDDL Index";
    }
    cddlIndexSec.prepend(header);
  }

  // Filter out CDDL marked with class="exclude" and in non-normative sections
  const cddlBlocks = /** @type {HTMLElement[]} */ (
    Array.from(
      document.querySelectorAll("pre.cddl:not(.exclude) > code")
    ).filter(cddl => !cddl.closest(nonNormativeSelector))
  );

  if (cddlBlocks.length === 0) {
    const text = "This specification doesn't normatively declare any CDDL.";
    cddlIndexSec.append(text);
    return;
  }

  // Group by module if data-cddl-module is used
  /** @type {Map<string, HTMLElement[]>} */
  const modules = new Map();
  for (const cddlCode of cddlBlocks) {
    const pre = cddlCode.closest("pre");
    const moduleName =
      /** @type {HTMLElement} */ (pre)?.dataset.cddlModule || "";
    if (!modules.has(moduleName)) {
      modules.set(moduleName, []);
    }
    const moduleBlocks = modules.get(moduleName);
    if (moduleBlocks) {
      moduleBlocks.push(/** @type {HTMLElement} */ (cddlCode));
    }
  }

  // Check if we have multiple modules
  const hasModules =
    modules.size > 1 || (modules.size === 1 && !modules.has(""));

  if (hasModules) {
    modules.forEach((blocks, moduleName) => {
      const section = document.createElement("section");
      const heading = document.createElement("h3");
      const displayName = moduleName || "Default";
      heading.textContent = `Module: ${displayName}`;
      if (moduleName) {
        heading.id = `cddl-index-module-${moduleName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      }
      section.append(heading);
      section.append(createConsolidatedPre(blocks));
      cddlIndexSec.append(section);
    });
  } else {
    // Single consolidated pre
    cddlIndexSec.append(createConsolidatedPre(cddlBlocks, "actual-cddl-index"));
  }
}

/**
 * Create a consolidated <pre class="cddl"> from multiple code blocks.
 * @param {HTMLElement[]} cddlCodes - array of <code> elements inside <pre class="cddl">
 * @param {string} [id] - optional id (used for the single consolidated index pre)
 * @returns {HTMLPreElement}
 */
function createConsolidatedPre(cddlCodes, id) {
  const pre = document.createElement("pre");
  pre.classList.add("cddl", "def", "highlight");
  if (id) {
    pre.id = id;
  }

  const code = document.createElement("code");
  cddlCodes
    .map(elem => {
      const fragment = document.createDocumentFragment();
      elem.childNodes.forEach(child =>
        fragment.appendChild(child.cloneNode(true))
      );
      return fragment;
    })
    .forEach(fragment => {
      if (code.lastChild) {
        code.append("\n\n");
      }
      code.appendChild(fragment);
    });

  // Remove duplicate IDs
  code.querySelectorAll("*[id]").forEach(elem => elem.removeAttribute("id"));

  pre.append(code);
  return pre;
}
