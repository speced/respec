// Module core/highlight-vars
// Highlights occurrences of a <var> within a .algorithm on click
// if a <var> is set only once (unused/undeclared), it's highlighted with class ".bug"

import hlVars from "deps/text!core/css/var.css";
const styleElement = document.createElement("style");
styleElement.textContent = hlVars;
styleElement.classList.add("removeOnSave");
document.head.appendChild(styleElement);

export const name = "core/highlight-vars";

export function run(conf, doc, cb) {
  for (const elem of document.querySelectorAll(".algorithm var")) {
    elem.addEventListener("click", highlightVars);
  }
  cb();
}

function highlightVars({ target }) {
  const value = target.innerText;
  const parent = target.closest(".algorithm");
  [...parent.querySelectorAll("var")]
    .filter(el => el.innerText === value)
    .forEach((el, _, {length}) => {
      const classToAdd = length === 1 ? "bug" : "active";
      el.classList.toggle(classToAdd);
    });
}
