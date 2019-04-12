// Module geonovum/conformance
// Handle the conformance section properly.
// based on W3C conformance, but because Geonovum has different requirements, have a separate module
import html from "hyperhtml";
import { pub } from "../core/pubsubhub";
export const name = "geonovum/conformance";

/**
 * @param {Element} conformance
 */
function processConformance(conformance) {
  const content = html`
    <h2>Conformiteit</h2>
    <p>
      Naast onderdelen die als niet normatief gemarkeerd zijn, zijn ook alle
      diagrammen, voorbeelden, en noten in dit document niet normatief. Verder
      is alles in dit document normatief.
    </p>
    <p>
      Informatief en normatief.
    </p>
  `;
  conformance.prepend(...content.childNodes);
}

export function run() {
  const conformance = document.querySelector("section#conformance");
  if (conformance) {
    processConformance(conformance);
  }
  pub("end", name);
}
