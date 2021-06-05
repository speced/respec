// @ts-check
// Module core/requirements
// This module does two things:
//
// 1.  It finds and marks all requirements. These are elements with class "req".
//     When a requirement is found, it is reported using the "req" event. This
//     can be used by a containing shell to extract them.
//     Requirements are automatically numbered.
//
// 2.  It allows referencing requirements by their ID simply using an empty <a>
//     element with its href pointing to the requirement it should be referencing
//     and a class of "reqRef".
import { html } from "./import-maps.js";
import { showError } from "./utils.js";

export const name = "core/requirements";

export function run() {
  document.querySelectorAll(".req").forEach((req, i) => {
    const frag = `#${req.getAttribute("id")}`;
    const el = html`<a href="${frag}">Req. ${i + 1}</a>`;
    req.prepend(el, ": ");
  });

  document.querySelectorAll("a.reqRef[href]").forEach(ref => {
    const href = ref.getAttribute("href");
    const id = href.substring(1); // href looks like `#id`
    const req = document.getElementById(id);
    let txt;
    if (req) {
      txt = req.querySelector("a:first-child").textContent;
    } else {
      txt = `Req. not found '${id}'`;
      const msg = `Requirement not found in element \`a.reqRef\`: ${id}`;
      showError(msg, name);
      console.warn(msg, ref);
    }
    ref.textContent = txt;
  });
}
