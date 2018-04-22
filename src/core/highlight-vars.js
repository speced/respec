/**
 * Module core/highlight-vars
 * Highlights occurrences of a <var> within a section on click.
 * Set `conf.highlightVars = true` to enable.
 * Removes highlights from <var> if clicked anywhere else.
 * All is done while keeping in mind that exported html stays clean
 * on export.
 */
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

  [...document.querySelectorAll("var")].forEach(varElem =>
    varElem.addEventListener("click", hightlightListener)
  );

  // remove highlights, cleanup empty class/style attributes
  sub("beforesave", outputDoc => {
    [...outputDoc.querySelectorAll("var.respec-hl")].forEach(
      removeHighlight
    );
  });
}

function hightlightListener(ev) {
  ev.stopPropagation();
  const { target: varElem } = ev;
  const hightligtedElems = highlightVars(varElem);
  const resetListener = () => {
    const hlColor = getHighlightColor(varElem);
    hightligtedElems.forEach(el => removeHighlight(el, hlColor));
    [...HL_COLORS.keys()].forEach(key => HL_COLORS.set(key, true));
  };
  if (hightligtedElems.length) {
    document.body.addEventListener("click", resetListener, { once: true });
  }
}

// availability of highlight colors. colors from var.css
const HL_COLORS = new Map([
  ["respec-hl-yellow", true],
  ["respec-hl-blue", true],
  ["respec-hl-pink", true],
  ["respec-hl-green", true],
  ["respec-hl-orange", true],
]);

function getHighlightColor(target) {
  // return current colors if applicable
  const { value } = target.classList;
  const re = /respec-hl-\w+/;
  const activeClass = re.test(value) && value.match(re);
  if (activeClass) return activeClass[0];

  // first color preference
  if (HL_COLORS.get("respec-hl-yellow") === true) return "respec-hl-yellow";

  // otherwise get some other available color
  return [...HL_COLORS.keys()].find(c => HL_COLORS.get(c) === true) || "respec-hl-yellow";
}

function highlightVars(varElem) {
  const textContent = varElem.textContent.trim();
  const parent = varElem.closest("section");
  const highlightColor = getHighlightColor(varElem);

  const varsToHighlight = [...parent.querySelectorAll("var")].filter(
    el => el.textContent.trim() === textContent
  );

  // update availability of highlight color
  const colorStatus = varsToHighlight[0].classList.contains("respec-hl");
  HL_COLORS.set(highlightColor, colorStatus);

  // highlight vars
  if (colorStatus) {
    varsToHighlight.forEach(el => removeHighlight(el, highlightColor));
    return [];
  } else {
    varsToHighlight.forEach(el => addHighlight(el, highlightColor));
  }
  return varsToHighlight;
}

function removeHighlight(el, highlightColor) {
  el.classList.remove("respec-hl");
  el.classList.remove(highlightColor);
  // clean up empty class attributes so they don't come in export
  if (el.classList.length == 0) el.removeAttribute("class");
}

function addHighlight(elem, highlightColor) {
  elem.classList.add("respec-hl");
  elem.classList.add(highlightColor);
}
