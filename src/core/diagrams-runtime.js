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
    document.querySelectorAll(".diagram-flip-btn").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
        var container = btn.closest(".diagram-container");
        if (!container) return;
        var isFlipped = container.classList.toggle("diagram-container--flipped");
        btn.setAttribute("aria-expanded", String(isFlipped));
        var viewSource = btn.dataset.labelSource;
        var viewDiagram = btn.dataset.labelDiagram;
        if (viewSource && viewDiagram) {
          btn.setAttribute("aria-label", isFlipped ? viewDiagram : viewSource);
        }
        var flip = container.querySelector(".diagram-flip");
        var back = container.querySelector(".diagram-face--back");
        if (flip && back) {
          flip.style.minHeight = isFlipped ? back.scrollHeight + "px" : "";
        }
      });
    });
  })();
`;
