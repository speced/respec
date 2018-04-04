// Module core/highlight-vars
// Highlights occurrences of a <var> within a section on click
// Set `conf.highlightVars = true` to enable
// removes highlights from <var> if clicked anywhere else
// all is done while keeping in mind that exported html stays clean (removeHighlight)

import { sub } from "core/pubsubhub";
import hlVars from "deps/text!core/css/var.css";

export const name = "core/highlight-vars";

export function run(conf) {
  if (!conf.highlightVars) {
    return;
  }
  const styleElement = document.createElement("style");
  styleElement.textContent = hlVars;
  styleElement.classList.add("removeOnSave");
  document.head.appendChild(styleElement);

  document.addEventListener("click", initHighlight);

  // remove highlights, cleanup empty class/style attributes
  sub("beforesave", outputDoc => {
    [...outputDoc.querySelectorAll("var.respec-active")].forEach(
      removeHighlight
    );
  });
}

// availability of highlight colors.
const HL_COLORS = new Map([
  // [ background:String, available:Boolean ]
  // or [ background,color:String, available:Boolean ]
  ["yellow", true],
  ["#726012,#fff", true],
  ["#c78e00", true],
  ["#3949ab,#fff", true],
  ["#F720E5", true],
]);

function getHighlightColor(target) {
  // return current colors if applicable
  const bg = target.style.getPropertyValue("--respec-background-color");
  const col = target.style.getPropertyValue("--respec-color");
  if (bg) return `${bg}${col ? `,${col}` : ""}`;

  // first color preference
  if (HL_COLORS.get("yellow") === true) return "yellow";

  // otherwise get some other available color
  return [...HL_COLORS.keys()].find(c => HL_COLORS.get(c) === true) || "yellow";
}

function highlightVars(target) {
  const textContent = target.textContent.trim();
  const parent = target.closest("section");
  const highlightColor = getHighlightColor(target);

  const varsToHighlight = [...parent.querySelectorAll("var")]
    .filter(el => el.textContent.trim() === textContent);

  // update availability of highlight color
  const colorStatus = varsToHighlight[0].classList.contains("respec-active");
  HL_COLORS.set(highlightColor, colorStatus);

  // highlight vars
  const [background, color] = highlightColor.split(",");
  if (colorStatus) {
    varsToHighlight.forEach(removeHighlight);
  } else {
    varsToHighlight.forEach(el => addHighlight(el, background, color));
  }
}

function removeHighlight(el) {
  // done so that only the respec classes are removed
  el.classList.remove("respec-active");
  el.style.removeProperty("--respec-background-color");
  el.style.removeProperty("--respec-color");
  // clean up empty class/style attributes so they don't come in export
  if (!el.getAttribute("style")) el.removeAttribute("style");
  if (!el.getAttribute("class")) el.removeAttribute("class");
}

function addHighlight(elem, background, color) {
  elem.classList.add("respec-active");
  elem.style.setProperty("--respec-background-color", background);
  if (color) elem.style.setProperty("--respec-color", color);
}

function initHighlight({ target }) {
  if (target.localName === "var") return highlightVars(target);
  // else, remove highlight
  [...document.querySelectorAll("var.respec-active")].forEach(removeHighlight);
  // make all colors available
  HL_COLORS.forEach((_, color) => HL_COLORS.set(color, true));
}
