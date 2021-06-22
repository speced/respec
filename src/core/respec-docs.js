/**
 * Tagged Template string, helps with linking to documentation.
 * Things inside [squareBrackets] are considered direct links to the documentation.
 * To alias something, once can use a "|", like [respecConfig|#respec-configuration].
 *
 */
export function docLink(strings, ...keys) {
  return strings
    .map((s, i) => {
      const key = keys[i];
      if (!key) {
        return s;
      }
      // Linkables are wrapped in square brackets
      if (!key.startsWith("[") && !key.endsWith("]")) return s + key;

      const [linkingText, href] = key.slice(1, -1).split("|");
      if (href) {
        const url = new URL(href, "https://respec.org/docs/");
        return `${s}[${linkingText}](${url})`;
      }
      return `${s}[\`${linkingText}\`](https://respec.org/docs/#${linkingText})`;
    })
    .join("");
}
