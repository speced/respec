import { getIntlData } from "../core/utils.js";
import { html } from "../core/import-maps.js";
export const name = "logius/override";

export function run(conf) {
  if (!conf.override) {
    return;
  }
  const conformance = document.querySelector("section#conformance");
  if (conformance && !conformance.classList.contains("override")) {
    overrideConformance(conf.override, conformance);
  }
}

function overrideConformance(override, conformance) {
  try {
    const l10n = getIntlData(override);
    const content = html`<p>${l10n.conformance}</p>`;
    const heading = conformance.querySelector("h2");
    conformance.replaceChildren(heading, content);
  } catch {
    // no custom conformance text
  }
}
