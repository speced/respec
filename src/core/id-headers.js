// @ts-check
// Module core/id-headers
// All headings are expected to have an ID, unless their immediate container has one.
// This is currently in core though it comes from a W3C rule. It may move in the future.

export const name = "core/id-headers";
import { addId, getIntlData, norm } from "./utils.js";
import { html } from "./import-maps.js";

const localizationStrings = {
  en: {
    perma_for_appendix: "Permalink for Appendix",
    perma_for_section: "Permalink for Section",
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  /** @type {NodeListOf<HTMLElement>} */
  const headings = document.querySelectorAll(
    `section:not(.head) h2, h3, h4, h5, h6`
  );
  for (const h of headings) {
    // prefer for ID: heading.id > parentElement.id > newly generated heading.id
    let id = h.id;
    if (!id) {
      addId(h);
      id = h.parentElement.id || h.id;
    }
    if (!conf.addSectionLinks) continue;
    let label = h.closest(".appendix")
      ? l10n.perma_for_appendix
      : l10n.perma_for_section;
    const sectionNumber = h.querySelector(":scope > bdi.secno");
    if (sectionNumber) {
      label += ` ${norm(sectionNumber.textContent)}`;
    }
    h.prepend(html`
      <a href="${`#${id}`}" class="self-link" aria-label="${label}"></a>
    `);
  }
}
