// Module core/highlight-vars
// Highlights occurrences of a <var> within a section on click
// if a <var> is set only once (unused/undeclared), it's highlighted with class ".bug"
// removes highlights from <var> if clicked anywhere else
// all is done while keeping in mind that exported html stays clean (removeHighlight)

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

// availability of highlight colors.
const HL_COLORS = {};
[ // background[,color]
  "yellow",
  "#726012,#fff",
  "#c78e00",
  "#3949ab,#fff",
  "#F720E5",
].forEach(color => HL_COLORS[color] = true); // all colors are initially available

function getHighlightColor(target) {
  // return current colors if applicable
  const bg = target.style.getPropertyValue("--respec-background-color");
  const col = target.style.getPropertyValue("--respec-color");
  if (bg) return `${bg}${col ? `,${col}` : ""}`;

  // first color preference
  if (HL_COLORS["yellow"] === true) return "yellow";

  // otherwise get some other available color
  return Object.keys(HL_COLORS).filter(c => HL_COLORS[c] === true).pop()
    || "yellow";
}

function removeHighlight(el) {
  // done so that only the respec classes are removed
  el.classList.remove("respec-active");
  el.classList.remove("respec-bug");
  el.setAttribute("style", "");
  el.removeAttribute("style");
  if (!el.classList.value.trim()) el.removeAttribute("class");
}

function highlightVars(target) {
  const innerText = target.innerText;
  const parent = target.closest("section");
  const highlightColor = getHighlightColor(target);

  const highlightVar = (elem, _, { length }) => {
    if (elem.classList.contains("respec-active")) {
      HL_COLORS[highlightColor] = true;
      removeHighlight(elem);
    } else {
      HL_COLORS[highlightColor] = false;
      elem.classList.add("respec-active");
      if (length === 1) elem.classList.add("respec-bug");
      const [ background, color ] = highlightColor.split(",");
      elem.style.setProperty("--respec-background-color", background);
      if (color) elem.style.setProperty("--respec-color", color);
    }
  };

  [...parent.querySelectorAll("var")]
    .filter(el => el.innerText === innerText)
    .forEach(highlightVar);
}

function initHighlight({ target }) {
  if (target.tagName === "VAR") return highlightVars(target);
  // else, remove highlight
  [...document.querySelectorAll("var.respec-active")].forEach(removeHighlight);
  // make all colors available
  Object.keys(HL_COLORS).forEach(color => HL_COLORS[color] = true);
}
