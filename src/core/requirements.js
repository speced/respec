// @ts-check
// Module core/requirements
// This module does two things:
//
// 1.  It finds and marks all requirements. These are elements with class "req".
//     When a requirement is found, it is reported using the "req" event. This
//     can be used by a containing shell to extract them.
//     Requirements are automatically numbered.
import { hyperHTML } from "./import-maps.js";

export const name = "core/requirements";

export function run() {
  document.querySelectorAll(".req").forEach((req, i) => {
    const frag = `#${req.getAttribute("id")}`;
    const el = hyperHTML`<a href="${frag}">Req. ${i + 1}</a>`;
    req.prepend(el, ": ");
  });
}
