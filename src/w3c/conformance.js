// Module w3c/conformance
// Handle the conformance section properly.
import html from "hyperhtml";
import { joinAnd } from "../core/utils";
import { pub } from "../core/pubsubhub";
import { renderInlineCitation } from "../core/render-biblio";
import { rfc2119Usage } from "../core/inlines";
export const name = "w3c/conformance";

export function run(conf) {
  const conformance = document.querySelector("section#conformance");
  if (!conformance) return;
  const terms = [...Object.keys(rfc2119Usage)];
  // Add RFC2119 to blibliography
  if (terms.length) conf.normativeReferences.add("RFC2119");
  // Put in the 2119 clause and reference
  const keywords = joinAnd(
    terms.sort(),
    item => `<em class="rfc2119">${item}</em>`
  );
  const plural = terms.length > 1;
  const content = html`
    <h2>Conformance</h2>
    <p>
      As well as sections marked as non-normative, all authoring guidelines,
      diagrams, examples, and notes in this specification are non-normative.
      Everything else in this specification is normative.
    </p>
    ${
      terms.length
        ? html`
            <p>
              The key word${plural ? "s" : ""} ${[keywords]}
              ${plural ? "are" : "is"} to be interpreted as described in
              ${renderInlineCitation("RFC2119")}.
            </p>
          `
        : null
    }
  `;
  conformance.prepend(...content.childNodes);
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", name);
}
