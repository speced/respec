// @ts-check
/**
 * Module core/reindent
 *
 * Removes common indents across the IDL texts,
 * so that indentation inside <pre> won't affect the rendered result.
 */

export const name = "core/reindent";

/**
 * @param {string} text
 */
export function reindent(text) {
  if (!text) {
    return text;
  }
  const lines = text.trimEnd().split("\n");
  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }
  const indents = lines.filter(s => s.trim()).map(s => s.search(/[^\s]/));
  const leastIndent = Math.min(...indents);
  return lines.map(s => s.slice(leastIndent)).join("\n");
}

export function run() {
  for (const pre of document.getElementsByTagName("pre")) {
    pre.innerHTML = reindent(pre.innerHTML);
  }
}
