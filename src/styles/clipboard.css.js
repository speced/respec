/* --- COPY BUTTON --- */
const css = String.raw;

// prettier-ignore
export default css`
/* Hidden until the script shows the buttons, so a saved page whose script is
   blocked has no dead button. */
.respec-button-copy-paste {
  position: absolute;
  height: 28px;
  width: 40px;
  cursor: pointer;
  background-image: linear-gradient(#fcfcfc, #eee);
  border: 1px solid rgb(144, 184, 222);
  border-left: 0;
  border-radius: 0px 0px 3px 0;
  -webkit-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  top: 0;
  left: 127px;
  display: none;
  place-items: center;
}

.respec-button-copy-paste > svg {
  grid-area: 1 / 1;
}

.respec-button-copy-paste:focus {
  text-decoration: none;
  border-color: #51a7e8;
  outline: none;
  box-shadow: 0 0 5px rgba(81, 167, 232, 0.5);
}

.respec-button-copy-paste:is(:focus:hover,.selected:focus) {
  border-color: #51a7e8;
}

.respec-button-copy-paste:is(:hover,:active,.zeroclipboard-is-hover,.zeroclipboard-is-active) {
  text-decoration: none;
  background-color: #ddd;
  background-image: linear-gradient(#eee, #ddd);
  border-color: #ccc;
}

.respec-button-copy-paste:is(:active,.selected,.zeroclipboard-is-active) {
  background-color: #dcdcdc;
  background-image: none;
  border-color: #b5b5b5;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}

.respec-button-copy-paste.selected:hover {
  background-color: #cfcfcf;
}

.respec-button-copy-paste:is(:disabled,:disabled:hover,.disabled,.disabled:hover) {
  color: rgba(102, 102, 102, 0.5);
  cursor: default;
  background-color: rgba(229, 229, 229, 0.5);
  background-image: none;
  border-color: rgba(197, 197, 197, 0.5);
  box-shadow: none;
}

.respec-button-copy-paste:focus-visible {
  outline: 2px solid #51a7e8;
  outline-offset: 2px;
}

/* Dark green: readable on the light button and on the diagram toolbar in dark mode. */
.respec-copy-check {
  visibility: hidden;
  fill: #1a7f37;
}

.respec-copy-sprite {
  position: absolute;
  width: 0;
  height: 0;
}

/* Decorative: its alternative text is empty, and the announcement below tells
   screen readers about the copy. */
.respec-button-copy-paste::after {
  content: attr(data-label);
  content: attr(data-label) / "";
  position: absolute;
  inset-inline-start: 100%;
  top: 50%;
  translate: 0 -50%;
  margin-inline-start: 0.5em;
  padding: 0.4em 0.6em;
  border: 1px solid transparent;
  border-radius: 6px;
  background: #24292f;
  background: light-dark(#24292f, #e6e6e6);
  color: #fff;
  color: light-dark(#fff, #1c1c1c);
  font: normal 0.75rem/1 system-ui, sans-serif;
  inline-size: max-content;
  max-inline-size: 14em;
  unicode-bidi: plaintext;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.4s, visibility 0.4s;
}

/* On a narrow page the bubble drops under the button, so a long message cannot
   run past the edge of the viewport. */
@media (max-width: 30em) {
  .respec-button-copy-paste::after {
    inset-inline-start: 0;
    top: 100%;
    translate: none;
    margin: 0.4em 0 0;
  }
}

/* Where the browser can anchor the bubble to the button, it sits beside the
   button and moves to the other side, or under the button, when the viewport
   has no room. Each button scopes the shared anchor name to itself: without
   anchor-scope, every bubble anchors to the last button. A narrow page keeps
   the rule above. */
@media (min-width: 30em) {
  @supports (position-area: inline-end) and (anchor-scope: all) {
    .respec-button-copy-paste {
      anchor-name: --respec-copy;
      anchor-scope: --respec-copy;
    }

    .respec-button-copy-paste::after {
      position: fixed;
      position-anchor: --respec-copy;
      position-area: inline-end;
      position-try-fallbacks:
        inline-start,
        block-end span-inline-end,
        block-end span-inline-start;
      align-self: anchor-center;
      inset: auto;
      translate: none;
      margin: 0 0.5em;
    }
  }
}

/* The script sets data-copy-state to copied while a copy is confirmed, and to
   failed while a refused copy is reported. */
.respec-button-copy-paste[data-copy-state="copied"] .respec-copy-check {
  visibility: visible;
}

/* Shows at once. The transition on the rule above fades it out. */
.respec-button-copy-paste[data-copy-state]::after {
  visibility: visible;
  opacity: 1;
  transition: none;
}

.respec-button-copy-paste[data-copy-state="copied"] > svg:not(.respec-copy-check) {
  visibility: hidden;
}
`;
