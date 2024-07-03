import { getIntlData } from "../core/utils.js";
import { html } from "../core/import-maps.js";
export const name = "logius/override";

export function run(conf) {
    const conformance = document.querySelector("section#conformance");
    if (conformance && !conformance.classList.contains("override")) {
        try {
            const l10n = getIntlData(conf.localizationStrings);
            const content = html`<p>${l10n.conformance}</p>`;
            conformance.querySelector("p").remove();
            conformance.querySelector("p").replaceWith(content);
        } catch {
            // no custom conformance text
        };
    }
}

