/* --- Diagrams --- */
const css = String.raw;

// The reader's explicit choice beats the system preference, so both sets of
// values are applied by selector as well as by media query, the same way
// core/styles/highlight and respec do it.
// Untagged: a css`` fragment with no selector is dropped by the minifier.
const lightVars = `
  --diagram-error-border: #d73a49;
  --diagram-error-bg: #ffeef0;
  --diagram-error-color: #86181d;
  --diagram-header-bg: #005a9c;
  --diagram-header-color: #fff;
  --diagram-back-bg: #f6f8fa;
  --diagram-btn-bg: #f0f0f0;
  --diagram-btn-border: #ccc;
  --diagram-btn-color: #555;
  --diagram-btn-hover-bg: #e0e0e0;
  --diagram-btn-hover-color: #333;
  --diagram-gutter-color: #57606a;
  --diagram-pulse-from: #f0f0f0;
  --diagram-pulse-to: #f0b8bb;
  --pele-bg: #fff;
  --pele-fg: #1f1f1f;
  --pele-muted: #6e6e6e;
  --pele-line: #1f1f1f;
  --pele-surface: #f3f3f3;
  --pele-surface-alt: #e6e6e6;
  --pele-border: #8a8a8a;
  --pele-accent: #5b7bd5;
`;

const darkVars = `
  --diagram-error-border: #f85149;
  --diagram-error-bg: #3d1f28;
  --diagram-error-color: #ff7b72;
  --diagram-header-bg: #3a6da0;
  --diagram-header-color: #fff;
  --diagram-back-bg: #1e1e1e;
  --diagram-btn-bg: #2d2d2d;
  --diagram-btn-border: #555;
  --diagram-btn-color: #aaa;
  --diagram-btn-hover-bg: #3d3d3d;
  --diagram-btn-hover-color: #ddd;
  --diagram-gutter-color: #999;
  --diagram-pulse-from: #2d2d2d;
  --diagram-pulse-to: #5a2d31;
  --pele-bg: #131516;
  --pele-fg: #e0e0e0;
  --pele-muted: #9a9a9a;
  --pele-line: #c8c8c8;
  --pele-surface: #1f2223;
  --pele-surface-alt: #2a2e30;
  --pele-border: #5c6164;
  --pele-accent: #7f9be0;
`;

// Untagged, like the variables above: the minifier does not know @container
// and drops the whole rule from anything inside the css`` tag.
const phoneRules = `
@container (max-width: 40em) {
  .diagram-face--front:has(.diagram-svg--mobile) .diagram-svg--desktop {
    display: none;
  }
  .diagram-face--front .diagram-svg--mobile {
    display: block;
  }
}
`;

// prettier-ignore
export default css`
:root {
  ${lightVars}
}

/* Dark when the system prefers it, or when the reader picks dark. */
@media (prefers-color-scheme: dark) {
  :root {
    ${darkVars}
  }
}
body:has(input[name='color-scheme'][value='dark']:checked) {
  ${darkVars}
}

/* Light when the document has no dark scheme, or the reader picks light. */
head:not(:has(meta[name='color-scheme'][content~='dark'])) + body,
body:has(input[name='color-scheme'][value='light']:checked) {
  ${lightVars}
}

.diagram-container {
  border: 2px solid transparent;
  transition: border-color 0.3s;
  min-width: min(20em, 100%);
  perspective: 1000px;
}

.diagram-container:hover,
.diagram-container:focus-within,
.diagram-container--flipped {
  border-color: var(--diagram-header-bg);
}

.diagram-flip {
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease-in-out;
}

.diagram-container--flipped .diagram-flip {
  transform: rotateY(180deg);
}

.diagram-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

/* The query container for the desktop and mobile drawings below. */
.diagram-face--front {
  position: relative;
  container-type: inline-size;
}

.diagram-face--front svg {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Wide drawings come with a second layout for phones. The narrow one shows
   when the card is narrower than 40em, and hides the wide one. */
.diagram-face--front .diagram-svg--mobile {
  display: none;
}

${phoneRules}

.diagram-face--back {
  transform: rotateY(180deg);
  overflow: auto;
  background: var(--diagram-back-bg);
}

.diagram-face--back pre {
  margin: 0;
  padding: 1em;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.diagram-face--back code {
  white-space: pre;
}

/* Hidden with opacity only: a visibility:hidden toolbar cannot take focus, so
   keyboard users could never reach it. */
.diagramHeader {
  display: flex;
  align-items: stretch;
  opacity: 0;
  transition: opacity 0.3s;
  height: 1.75em;
  overflow: hidden;
  border: 1px solid var(--diagram-btn-border);
  border-top: none;
  border-inline-start: none;
  border-end-end-radius: 4px;
  width: fit-content;
}

.diagram-container:hover .diagramHeader,
.diagram-container:focus-within .diagramHeader,
.diagram-container--flipped .diagramHeader {
  opacity: 1;
}

@media (hover: none) {
  .diagramHeader {
    opacity: 1;
  }
}

.diagramHeader .diagram-label {
  background: var(--diagram-header-bg);
  color: var(--diagram-header-color);
  font-family: sans-serif;
  font-weight: bold;
  font-size: 0.85em;
  padding: 0 0.75em 0 0.5em;
  display: flex;
  align-items: center;
}

.diagram-flip-btn,
.diagramHeader .respec-button-copy-paste {
  background: var(--diagram-btn-bg);
  border: none;
  border-inline-start: 1px solid var(--diagram-btn-border);
  color: var(--diagram-btn-color);
  cursor: pointer;
  padding: 0 0.5em;
  text-decoration: none !important;
}

.diagram-flip-btn {
  font-family: monospace;
  font-size: 0.8em;
}

.diagramHeader .respec-button-copy-paste {
  position: static;
  border-radius: 0;
  display: flex;
  align-items: center;
}

.diagram-flip-btn:hover,
.diagramHeader .respec-button-copy-paste:hover {
  background: var(--diagram-btn-hover-bg);
  color: var(--diagram-btn-hover-color);
}

.diagram-flip-btn--error {
  color: var(--diagram-error-color);
  box-shadow: 0 0 6px color-mix(in srgb, var(--diagram-error-border) 50%, transparent);
  border-inline-start-color: var(--diagram-error-border);
  animation: error-pulse 2.5s ease-in-out infinite;
}

.diagram-container--error {
  border-color: var(--diagram-error-border);
  background: var(--diagram-error-bg);
  width: 100%;
}

.diagram-container--error:hover,
.diagram-container--error:focus-within {
  border-color: var(--diagram-error-border);
}

.diagram-container--error .diagram-flip {
  min-height: 8em;
}

.diagram-container--error .diagramHeader {
  opacity: 1;
}

figure:has(.diagram-container--error),
.diagram-container--error,
.diagram-container--error * {
  text-decoration: none !important;
}

/* Same specificity as the plain .diagramHeader .diagram-label rule but declared
   later, so it wins on source order without needing !important. */
.diagramHeader .diagram-label--error {
  background: var(--diagram-error-border);
  color: #fff;
}

.diagram-container--flipped .diagram-flip-btn--error {
  animation: none;
  background: var(--diagram-error-bg);
}

@keyframes error-pulse {
  0%, 100% { background: var(--diagram-pulse-from); color: var(--diagram-error-color); }
  50% { background: var(--diagram-pulse-to); color: var(--diagram-error-color); }
}

.diagram-error-front {
  color: var(--diagram-error-color);
  padding: 2em;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 1.1em;
  text-align: center;
}

.diagram-source-grid {
  display: grid;
  grid-template-columns: 1.5em 2.5em 1fr;
  padding: 0.5em 0;
  overflow: auto;
  white-space: pre;
}

.dg-indicator {
  text-align: center;
  user-select: none;
  display: grid;
  place-content: center;
  border-inline-start: 3px solid transparent;
  padding-inline-start: 0.25em;
}

.dg-indicator--error {
  border-inline-start-color: var(--diagram-error-border);
  background: var(--diagram-error-bg);
}

.dg-gutter {
  text-align: end;
  padding-inline-end: 0.75em;
  color: var(--diagram-gutter-color);
  user-select: none;
}

.dg-gutter--error {
  color: var(--diagram-error-color);
  font-weight: bold;
  background: var(--diagram-error-bg);
}

.dg-code {
  padding-inline-end: 1em;
}

.dg-code--error {
  background: var(--diagram-error-bg);
}

.dg-code--hint {
  color: var(--diagram-error-color);
  font-weight: bold;
  font-size: 0.9em;
  background: var(--diagram-error-bg);
}

/* No flip animation: the inactive face is simply not shown. */
@media (prefers-reduced-motion: reduce) {
  .diagram-container,
  .diagramHeader,
  .diagram-flip {
    transition: none;
  }
  .diagram-flip {
    transform-style: flat;
  }
  .diagram-container--flipped .diagram-flip {
    transform: none;
  }
  .diagram-face {
    backface-visibility: visible;
  }
  .diagram-face--back {
    transform: none;
    display: none;
  }
  .diagram-container--flipped .diagram-face--front {
    display: none;
  }
  .diagram-container--flipped .diagram-face--back {
    display: block;
    position: relative;
  }
  .diagram-flip-btn--error {
    animation: none;
  }
}

/* A printed card shows the diagram, never the source, the toolbar or a
   mirrored face, and always the wide drawing. */
@media print {
  .diagramHeader {
    display: none;
  }
  .diagram-container {
    border-color: transparent;
    perspective: none;
  }
  .diagram-flip,
  .diagram-container--flipped .diagram-flip {
    transform: none;
    transform-style: flat;
  }
  .diagram-face {
    backface-visibility: visible;
  }
  .diagram-face--back {
    display: none;
  }
  .diagram-container--flipped .diagram-face--front {
    display: block;
  }
  .diagram-face--front .diagram-svg--desktop {
    display: block !important;
  }
  .diagram-face--front .diagram-svg--mobile {
    display: none !important;
  }
}
`;
