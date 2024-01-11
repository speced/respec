// @ts-check
/**
 * @module core/reindent
 *
 * Normalizes indents across the pre elements in the document,
 * so that indentation inside <pre> won't affect the rendered result.
 */
import { reindent } from "./utils.js";
export const name = "core/reindent";

export function run() {
  for (const pre of document.getElementsByTagName("pre")) {
    pre.innerHTML = reindent(pre.innerHTML);
  }
}
