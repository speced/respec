// @ts-check
/**
 * Module core/diagrams-runtime
 *
 * Runtime script injected into published specs.
 * Shows a card's toolbar when a finger or pen touches the card and hides it
 * when any press lands elsewhere, and handles the flip buttons: toggles the flipped class, the ARIA state and the inert
 * face, and sizes the card to the back face.
 */

export const runtimeScript = `
  "use strict";
  (function() {
    document.addEventListener("pointerdown", function(event) {
      if (!(event.target instanceof Element)) return;
      var pressed = event.target.closest(".diagram-container");
      document.querySelectorAll(".diagram-container--active").forEach(function(card) {
        if (card !== pressed) card.classList.remove("diagram-container--active");
      });
      if (pressed && event.pointerType !== "mouse") pressed.classList.add("diagram-container--active");
    });
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
