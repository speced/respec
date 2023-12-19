// @ts-check
/**
 * This Module adds a metatag description to the document, based on the
 * first paragraph of the abstract.
 */
import { html } from "../core/import-maps.js";

export const name = "core/seo";

export function run(conf) {
  if (conf.gitRevision) {
    // This allows to set a git revision of the source used to produce the
    // generated content. Typically, this would be set when generating the
    // static HTML via a build process.
    // 'revision' is the name recommended in https://wiki.whatwg.org/wiki/MetaExtensions
    const metaElem = html`<meta
      name="revision"
      content="${conf.gitRevision}"
    />`;
    document.head.appendChild(metaElem);
  }

  const firstParagraph = document.querySelector("#abstract p:first-of-type");
  if (!firstParagraph) {
    return; // no abstract, so nothing to do
  }
  // Normalize whitespace: trim, remove new lines, tabs, etc.
  const content = firstParagraph.textContent.replace(/\s+/, " ").trim();
  const metaElem = document.createElement("meta");
  metaElem.name = "description";
  metaElem.content = content;
  document.head.appendChild(metaElem);
}
