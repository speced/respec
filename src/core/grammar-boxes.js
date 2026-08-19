// @ts-check
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
  addHashId(pre, `${lang}-block`);

  const code = document.createElement("code");
  code.className = lang;
  code.textContent = pre.textContent;
  pre.textContent = "";
  pre.append(code);
  pre.classList.add("def", "highlight");

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
