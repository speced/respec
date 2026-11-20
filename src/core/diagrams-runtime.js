// @ts-check
/**
 * Module core/diagrams-runtime
 *
 * Runtime script injected into published specs.
 * Handles the flip buttons: toggles the flipped class, the ARIA state and the
 * inert face, and sizes the card to the back face.
 */

export const runtimeScript = `
  "use strict";
  (function() {
    document.querySelectorAll(".diagram-flip-btn").forEach(function(button) {
      button.addEventListener("click", function() {
        const container = button.closest(".diagram-container");
        if (!container) return;
        const isFlipped = container.classList.toggle("diagram-container--flipped");
        button.setAttribute("aria-expanded", String(isFlipped));
        const front = container.querySelector(".diagram-face--front");
        const back = container.querySelector(".diagram-face--back");
        if (front) front.inert = isFlipped;
        if (back) back.inert = !isFlipped;
        const flip = container.querySelector(".diagram-flip");
        if (flip && back) {
          flip.style.minHeight = isFlipped ? back.scrollHeight + "px" : "";
        }
      });
    });
  })();
`;
