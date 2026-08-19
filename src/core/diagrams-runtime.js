// @ts-check
/**
 * Module core/diagrams-runtime
 *
 * Runtime script injected into published specs.
 * Handles flip buttons: toggles the flipped class for 3D rotation,
 * updates ARIA state, and manages back-face height.
 */

export const runtimeScript = `
  "use strict";
  (function() {
    document.querySelectorAll(".diagram-flip-btn").forEach(function(button) {
      button.addEventListener("click", function(event) {
        event.stopPropagation();
        const container = button.closest(".diagram-container");
        if (!container) return;
        const isFlipped = container.classList.toggle("diagram-container--flipped");
        button.setAttribute("aria-expanded", String(isFlipped));
        const viewSource = button.dataset.labelSource;
        const viewDiagram = button.dataset.labelDiagram;
        if (viewSource && viewDiagram) {
          button.setAttribute("aria-label", isFlipped ? viewDiagram : viewSource);
        }
        const flip = container.querySelector(".diagram-flip");
        const back = container.querySelector(".diagram-face--back");
        if (flip && back) {
          flip.style.minHeight = isFlipped ? back.scrollHeight + "px" : "";
        }
      });
    });
  })();
`;
