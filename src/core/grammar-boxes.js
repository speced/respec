// @ts-check
// Module core/grammar-boxes
//  Adds styled header badges to ABNF, EBNF, and BNF pre blocks,
//  mirroring the WebIDL and CDDL block pattern.
//  Syntax highlighting is handled by core/highlight via highlight.js,
//  which already has ABNF registered and will use auto-detection for EBNF/BNF.

import { createCopyButton, injectCopyScript } from "./clipboard.js";
import { addHashId } from "./utils.js";
import css from "../styles/grammar.css.js";

export const name = "core/grammar-boxes";

/** @type {ReadonlyMap<string, string>} */
const GRAMMARS = new Map([
  ["abnf", "ABNF"],
  ["ebnf", "EBNF"],
  ["bnf", "BNF"],
]);

/**
 * Add a header badge and copy button to a single grammar pre block.
 * Wraps the block content in a <code> element (matching WebIDL/CDDL pattern)
 * so that core/highlight can pick it up via the `pre > code` selector.
 *
 * @param {HTMLPreElement} pre
 * @param {string} label - display label, e.g. "ABNF"
 * @param {string} lang - grammar class name, e.g. "abnf"
 */
function processGrammarBlock(pre, label, lang) {
  // Wrap existing text content in <code> for consistent structure and so that
  // highlight.js can pick it up via the `pre > code` selector.
  // Note: pre.textContent is cleared before addHashId, but addHashId reads
  // from the subtree — pre.textContent returns code.textContent (the original
  // grammar text), so the hash is computed from the real content.
  const code = document.createElement("code");
  code.className = lang;
  code.textContent = pre.textContent;
  pre.textContent = "";
  pre.append(code);

  // Add an id so the self-link and copy button work.
  addHashId(pre, `${lang}-block`);

  // Build the header badge.
  const header = document.createElement("span");
  header.className = "grammarHeader";
  const selfLink = document.createElement("a");
  selfLink.className = "self-link";
  selfLink.href = `#${pre.id}`;
  selfLink.textContent = label;
  header.append(selfLink);

  const copyButton = createCopyButton(".grammarHeader");
  header.append(copyButton);

  pre.prepend(header);
}

export async function run() {
  /** @type {Array<{pre: HTMLPreElement, label: string, lang: string}>} */
  const blocks = [];
  GRAMMARS.forEach((label, lang) => {
    document
      .querySelectorAll(`pre.${lang}:not([data-no-grammar])`)
      .forEach(pre => {
        blocks.push({ pre: /** @type {HTMLPreElement} */ (pre), label, lang });
      });
  });

  if (!blocks.length) return;

  // Inject CSS once.
  const style = document.createElement("style");
  style.textContent = css;
  const anchor = document.querySelector("head link, head > *:last-child");
  if (anchor) {
    anchor.before(style);
  } else {
    document.head.append(style);
  }

  blocks.forEach(({ pre, label, lang }) =>
    processGrammarBlock(pre, label, lang)
  );

  // Inject the runtime copy-paste script (survives document export).
  injectCopyScript();
}
