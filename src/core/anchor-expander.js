// @ts-check
// expands empty anchors based on their context
import { makeSafeCopy, norm, renameElement, showError } from "./utils.js";

export const name = "core/anchor-expander";

export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const anchorElements = document.querySelectorAll(
    "a[href^='#']:not(.self-link):not([href$='the-empty-string'])"
  );
  const anchors = [...anchorElements].filter(a => a.textContent.trim() === "");
  for (const a of anchors) {
    const id = a.getAttribute("href").slice(1);
    const matchingElement = document.getElementById(id);
    if (!matchingElement) {
      a.textContent = a.getAttribute("href");
      const msg = `Couldn't expand inline reference. The id "${id}" is not in the document.`;
      const title = `No matching id in document: ${id}.`;
      showError(msg, name, { title, elements: [a] });
      continue;
    }
    switch (matchingElement.localName) {
      case "h6":
      case "h5":
      case "h4":
      case "h3":
      case "h2": {
        processHeading(matchingElement, a);
        break;
      }
      case "section": {
        // find first heading in the section
        processSection(matchingElement, id, a);
        break;
      }
      case "figure": {
        processFigure(matchingElement, id, a);
        break;
      }
      case "aside":
      case "div": {
        processBox(matchingElement, id, a);
        break;
      }
      default: {
        a.textContent = a.getAttribute("href");
        const msg = "ReSpec doesn't support expanding this kind of reference.";
        const title = `Can't expand "#${id}".`;
        showError(msg, name, { title, elements: [a] });
      }
    }
    localize(matchingElement, a);
    a.normalize();
  }
}

function processBox(matchingElement, id, a) {
  const selfLink = matchingElement.querySelector(".marker .self-link");
  if (!selfLink) {
    a.textContent = a.getAttribute("href");
    const msg = `Found matching element "${id}", but it has no title or marker.`;
    const title = "Missing title.";
    showError(msg, name, { title, elements: [a] });
    return;
  }
  const copy = makeSafeCopy(selfLink);
  a.append(...copy.childNodes);
  a.classList.add("box-ref");
}

function processFigure(matchingElement, id, a) {
  const figcaption = matchingElement.querySelector("figcaption");
  if (!figcaption) {
    a.textContent = a.getAttribute("href");
    const msg = `Found matching figure "${id}", but figure is lacking a \`<figcaption>\`.`;
    const title = "Missing figcaption in referenced figure.";
    showError(msg, name, { title, elements: [a] });
    return;
  }
  // remove the figure's title
  const children = [...makeSafeCopy(figcaption).childNodes].filter(
    // @ts-ignore
    node => !node.classList || !node.classList.contains("fig-title")
  );
  // drop an empty space at the end.
  children.pop();
  a.append(...children);
  a.classList.add("fig-ref");
  const figTitle = figcaption.querySelector(".fig-title");
  if (!a.hasAttribute("title") && figTitle) {
    a.title = norm(figTitle.textContent);
  }
}

function processSection(matchingElement, id, a) {
  const heading = matchingElement.querySelector("h6, h5, h4, h3, h2");
  if (!heading) {
    a.textContent = a.getAttribute("href");
    const msg =
      "Found matching section, but the section was lacking a heading element.";
    const title = `No matching id in document: "${id}".`;
    showError(msg, name, { title, elements: [a] });
    return;
  }
  processHeading(heading, a);
  localize(heading, a);
}

function processHeading(heading, a) {
  const hadSelfLink = heading.querySelector(".self-link");
  const children = [...makeSafeCopy(heading).childNodes].filter(
    // @ts-ignore
    node => !node.classList || !node.classList.contains("self-link")
  );
  a.append(...children);
  if (hadSelfLink) a.prepend("§\u00A0");
  a.classList.add("sec-ref");
  // Trim stray whitespace of the last text node (see bug #3265).
  if (a.lastChild.nodeType === Node.TEXT_NODE) {
    a.lastChild.textContent = a.lastChild.textContent.trimEnd();
  }
  // Replace all inner anchors for span elements (see bug #3136)
  a.querySelectorAll("a").forEach(a => {
    const span = renameElement(a, "span");
    // Remove the old attributes
    for (const attr of [...span.attributes]) {
      span.removeAttributeNode(attr);
    }
  });
}

function localize(matchingElement, newElement) {
  for (const attrName of ["dir", "lang"]) {
    // Already set on element, don't override.
    if (newElement.hasAttribute(attrName)) continue;

    // Closest in tree setting the attribute
    const matchingClosest = matchingElement.closest(`[${attrName}]`);
    if (!matchingClosest) continue;

    // Closest to reference setting the attribute
    const newClosest = newElement.closest(`[${attrName}]`);

    // It's the same, so already inherited from closest (probably HTML element or body).
    if (
      newClosest &&
      newClosest.getAttribute(attrName) ===
        matchingClosest.getAttribute(attrName)
    )
      continue;
    // Otherwise, set it.
    newElement.setAttribute(attrName, matchingClosest.getAttribute(attrName));
  }
}
