// @ts-check
// Module w3c/conformance
// Handle the conformance section properly.
import { hyperHTML as html } from "../core/import-maps.js";
import { htmlJoinAnd } from "../core/utils.js";
import { pub } from "../core/pubsubhub.js";
import { renderInlineCitation } from "../core/render-biblio.js";
import { rfc2119Usage } from "../core/inlines.js";
export const name = "w3c/conformance";

/**
 * @param {Element} conformance
 * @param {*} conf
 */
function processConformance(conformance, conf) {
  const terms = [...Object.keys(rfc2119Usage)];
  // Add RFC2119 to blibliography
  if (terms.length) {
    conf.normativeReferences.add("RFC2119");
    conf.normativeReferences.add("RFC8174");
  }
  // Put in the 2119 clause and reference
  const keywords = htmlJoinAnd(
    terms.sort(),
    item =>
      html`
        <em class="rfc2119">${item}</em>
      `
  );
  const plural = terms.length > 1;
  const content = html`
    <h2>Conformance</h2>
    <p>
      As well as sections marked as non-normative, all authoring guidelines,
      diagrams, examples, and notes in this specification are non-normative.
      Everything else in this specification is normative.
    </p>
    ${terms.length
      ? html`
          <p>
            The key word${plural ? "s" : ""} ${keywords} in this document
            ${plural ? "are" : "is"} to be interpreted as described in
            <a href="https://tools.ietf.org/html/bcp14">BCP 14</a>
            ${renderInlineCitation("RFC2119")}
            ${renderInlineCitation("RFC8174")} when, and only when, they appear
            in all capitals, as shown here.
          </p>
        `
      : null}
  `;
  conformance.prepend(...content.childNodes);
}

export function run(conf) {
  const conformance = document.querySelector("section#conformance");
  if (conformance) {
    processConformance(conformance, conf);
  }
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", name);
}
