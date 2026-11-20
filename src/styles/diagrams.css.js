/* --- Diagrams --- */
const css = String.raw;

// prettier-ignore
export default css`
/* The colors follow the page. The W3C stylesheets set --text and --bg for
   whichever scheme is showing, and the fallbacks are the light values. */
:root {
  --pele-bg: var(--bg, #fff);
  --pele-fg: var(--text, #1f1f1f);
  --pele-line: var(--pele-fg);
  --pele-muted: color-mix(in srgb, var(--pele-fg) 62%, var(--pele-bg));
  --pele-surface: color-mix(in srgb, var(--pele-fg) 7%, var(--pele-bg));
  --pele-surface-alt: color-mix(in srgb, var(--pele-fg) 14%, var(--pele-bg));
  --pele-border: color-mix(in srgb, var(--pele-fg) 45%, var(--pele-bg));
  --pele-accent: color-mix(in srgb, #5b7bd5 75%, var(--pele-fg));
  --diagram-error-border: var(--issue-border, #d73a49);
  --diagram-error-bg: var(--issue-bg, #ffeef0);
  --diagram-error-color: var(--issueheading-text, #86181d);
  --diagram-header-bg: var(--logo-bg, #005a9c);
  --diagram-header-color: var(--logo-text, #fff);
  --diagram-back-bg: var(--pele-surface);
  --diagram-btn-bg: color-mix(in srgb, var(--pele-fg) 8%, var(--pele-bg));
  --diagram-btn-border: color-mix(in srgb, var(--pele-fg) 25%, var(--pele-bg));
  --diagram-btn-color: color-mix(in srgb, var(--pele-fg) 70%, var(--pele-bg));
  --diagram-btn-hover-bg: color-mix(in srgb, var(--pele-fg) 14%, var(--pele-bg));
  --diagram-btn-hover-color: var(--pele-fg);
  --diagram-gutter-color: var(--pele-muted);
  --diagram-pulse-from: var(--diagram-btn-bg);
  --diagram-pulse-to: color-mix(in srgb, var(--diagram-error-border) 35%, var(--pele-bg));
}

.diagram-container {
  border: 2px solid transparent;
  transition: border-color 0.3s;
  min-width: min(20em, 100%);
  perspective: 1000px;
}

.diagram-container:hover,
.diagram-container:focus-within,
.diagram-container--active,
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

/* A wide drawing also has a phone layout. diagrams.js writes one @container
   rule per diagram that swaps them when the card gets too narrow for the wide one. */
.diagram-face--front .diagram-svg--mobile {
  display: none;
}

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

/* Hidden with opacity, not visibility: a visibility:hidden toolbar cannot take
   focus, so keyboard users could never reach it. pointer-events:none keeps a
   hidden toolbar from catching a tap meant to reveal it. A tap adds
   diagram-container--active, which diagrams-runtime.js manages. */
.diagramHeader {
  display: flex;
  align-items: stretch;
  opacity: 0;
  pointer-events: none;
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
.diagram-container--active .diagramHeader,
.diagram-container--flipped .diagramHeader {
  opacity: 1;
  pointer-events: auto;
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
  width: auto;
  height: auto;
  min-width: 2.5em;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diagramHeader .respec-button-copy-paste svg {
  fill: currentColor;
}

/* An outline outside the button is clipped by the toolbar's overflow:hidden,
   and Safari then shows no focus ring at all. */
.diagram-flip-btn:focus-visible,
.diagramHeader .respec-button-copy-paste:focus-visible {
  outline: 2px solid var(--pele-fg);
  outline-offset: -3px;
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

/* An error card opens flipped, so its source gives the card its height. */
.diagram-container--error.diagram-container--flipped .diagram-face--back {
  position: relative;
}

.diagram-container--error.diagram-container--flipped .diagram-face--front {
  position: absolute;
}

.diagram-container--error .diagramHeader {
  opacity: 1;
  pointer-events: auto;
}

.diagram-container--error,
.diagram-container--error * {
  text-decoration: none !important;
}

/* Same specificity as the plain .diagramHeader .diagram-label rule but declared
   later, so it wins on source order without needing !important. */
.diagramHeader .diagram-label--error {
  background: color-mix(in srgb, var(--diagram-error-border) 75%, #000);
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
  white-space: normal;
  overflow-wrap: anywhere;
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
    transition: none;
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
  .diagram-container--error .diagram-face--front {
    display: none;
  }
  .diagram-container--error .diagram-face--back {
    display: block;
    position: relative;
    transform: none;
  }
}
`;
