/* --- COPY BUTTON --- */
const css = String.raw;

// prettier-ignore
export default css`
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

.respec-copy-ready .respec-button-copy-paste {
  display: grid;
}

/* Dark green: readable on the light button and on the diagram toolbar in dark mode. */
.respec-copy-check {
  visibility: hidden;
}

.respec-copy-check path {
  fill: #1a7f37;
}

/* Decorative: its alternative text is empty, and the announcement below tells
   screen readers about the copy. */
.respec-button-copy-paste::after {
  content: attr(data-copied-label);
  content: attr(data-copied-label) / "";
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
  white-space: nowrap;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.4s, visibility 0.4s;
}

/* The script sets data-copied while a copy is confirmed, and data-failed while
   a refused copy is reported. */
.respec-button-copy-paste[data-copied] .respec-copy-check {
  visibility: visible;
}

/* Shows at once. The transition on the rule above fades it out. */
.respec-button-copy-paste[data-copied]::after,
.respec-button-copy-paste[data-failed]::after {
  visibility: visible;
  opacity: 1;
  transition: none;
}

.respec-button-copy-paste[data-failed]::after {
  content: attr(data-failed-label);
  content: attr(data-failed-label) / "";
}

.respec-button-copy-paste[data-copied] > svg:not(.respec-copy-check) {
  visibility: hidden;
}

.respec-copy-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media print {
  .respec-button-copy-paste {
    visibility: hidden;
  }
}
`;
