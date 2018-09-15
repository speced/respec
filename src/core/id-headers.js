// Module core/id-headers
// All headings are expected to have an ID, unless their immediate container has one.
// This is currently in core though it comes from a W3C rule. It may move in the future.

export const name = "core/id-headers";
import { addId } from "core/utils";

export function run(conf) {
  document
    .querySelectorAll(
      `
      section:not(.introductory) h2,
      section:not(.introductory) h3,
      section:not(.introductory) h4,
      section:not(.introductory) h5,
      section:not(.introductory) h6`
    )
    .forEach(elem => {
      addId(elem);
      if (conf.addSectionLinks) {
        addSectionLink(elem);
      }
    });
}

function addSectionLink(h) {
  const section = h.closest("section[id]");
  const a = document.createElement("a");
  a.classList.add("self-link");
  const id = section ? section.id : h.id;
  a.href = `#${id}`;
  a.setAttribute("aria-label", "§");
  h.insertAdjacentElement("beforeend", a);
}
