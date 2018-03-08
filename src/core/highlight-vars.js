// Module core/highlight-vars
// Highlights occurrences of a <var> within a section on click
// if a <var> is set only once (unused/undeclared), it's highlighted with class ".bug"
// removes highlights from <var> if clicked anywhere else

import hlVars from "deps/text!core/css/var.css";
const styleElement = document.createElement("style");
styleElement.textContent = hlVars;
styleElement.classList.add("removeOnSave");
document.head.appendChild(styleElement);

export const name = "core/highlight-vars";

export function run(conf, doc, cb) {
  document.addEventListener("click", initHighlight);
  cb();
}

// availability of highlight colors. color names are from var.css
const HL_COLORS = {"col-a": true, "col-b": true, "col-c": true, "col-d": true};

function getHighlightColor() {
  if (HL_COLORS["col-a"] === true) return "col-a"; // first color preference
  // get some other available color
  return Object.keys(HL_COLORS).filter(c => HL_COLORS[c] === true).pop()
    || "col-a";
}

function highlightVars(target) {
  const innerText = target.innerText;
  const parent = target.closest("section");
  const highlightColor = getHighlightColor();
  HL_COLORS[highlightColor] = false;

  const highlightVar = (elem, _, { length }) => {
    const bugClass = length === 1 ? "bug " : "";
    if (elem.classList.value.includes("active")) {
      elem.classList.value = ""; // remove all classes
      HL_COLORS[highlightColor] = true;
    } else {
      elem.classList.value = `active ${bugClass}${highlightColor}`;
    }
  };

  [...parent.querySelectorAll("var")]
    .filter(el => el.innerText === innerText)
    .forEach(highlightVar);
}

function initHighlight({ target }) {
  if (target.tagName === "VAR") return highlightVars(target);
  // else, remove highlight
  for (const elem of document.querySelectorAll("var.active")) {
    elem.classList.value = "";
  }
  // make all colors available
  Object.keys(HL_COLORS).forEach(color => HL_COLORS[color] = true);
}
