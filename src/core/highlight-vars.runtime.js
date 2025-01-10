// @ts-check

if (document.respec) {
  document.respec.ready.then(setupVarHighlighter);
} else {
  setupVarHighlighter();
}

function setupVarHighlighter() {
  document
    .querySelectorAll("var")
    .forEach(varElem => varElem.addEventListener("click", highlightListener));
}

function highlightListener(ev) {
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
  ["respec-hl-c1", true],
  ["respec-hl-c2", true],
  ["respec-hl-c3", true],
  ["respec-hl-c4", true],
  ["respec-hl-c5", true],
  ["respec-hl-c6", true],
  ["respec-hl-c7", true],
]);

function getHighlightColor(target) {
  // return current colors if applicable
  const { value } = target.classList;
  const re = /respec-hl-\w+/;
  const activeClass = re.test(value) && value.match(re);
  if (activeClass) return activeClass[0];

  // first color preference
  if (HL_COLORS.get("respec-hl-c1") === true) return "respec-hl-c1";

  // otherwise get some other available color
  return [...HL_COLORS.keys()].find(c => HL_COLORS.get(c)) || "respec-hl-c1";
}

function highlightVars(varElem) {
  const textContent = norm(varElem.textContent);
  const parent = varElem.closest(".algorithm, section");
  const highlightColor = getHighlightColor(varElem);

  const varsToHighlight = [...parent.querySelectorAll("var")].filter(
    el =>
      norm(el.textContent) === textContent &&
      el.closest(".algorithm, section") === parent
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
  el.classList.remove("respec-hl", highlightColor);
  // clean up empty class attributes so they don't come in export
  if (!el.classList.length) el.removeAttribute("class");
}

function addHighlight(elem, highlightColor) {
  elem.classList.add("respec-hl", highlightColor);
}

/**
 * Same as `norm` from src/core/utils, but our build process doesn't allow
 * imports in runtime scripts, so duplicated here.
 * @param {string} str
 */
function norm(str) {
  return str.trim().replace(/\s+/g, " ");
}
