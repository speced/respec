/* --- Diagrams --- */
const css = String.raw;

// prettier-ignore
export default css`
:root {
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
  --diagram-pulse-from: #f0f0f0;
  --diagram-pulse-to: #f0b8bb;
}

@media (prefers-color-scheme: dark) {
  :root {
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
    --diagram-pulse-from: #2d2d2d;
    --diagram-pulse-to: #5a2d31;
  }
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

.diagram-face--front {
  position: relative;
}

.diagram-face--front svg {
  display: block;
  max-width: 100%;
  height: auto;
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

.diagram-face--back code {
  white-space: pre;
}

.diagramHeader {
  display: flex;
  align-items: stretch;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
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
  visibility: visible;
}

@media (hover: none) {
  .diagramHeader {
    opacity: 1;
    visibility: visible;
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
  visibility: visible;
}

figure:has(.diagram-container--error),
.diagram-container--error,
.diagram-container--error * {
  text-decoration: none !important;
}

.diagram-label--error {
  background: var(--diagram-error-border) !important;
  color: #fff !important;
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
  color: #999;
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

@media (prefers-reduced-motion: reduce) {
  .diagram-container {
    transition: none;
  }
  .diagramHeader {
    transition: none;
  }
  .diagram-flip {
    transform-style: flat;
    transition: none;
  }
  .diagram-container--flipped .diagram-flip {
    transform: none;
  }
  .diagram-face {
    backface-visibility: visible;
  }
  .diagram-face--back {
    transform: none;
    opacity: 0;
    visibility: hidden;
  }
  .diagram-container--flipped .diagram-face--front {
    opacity: 0;
    visibility: hidden;
  }
  .diagram-container--flipped .diagram-face--back {
    position: relative;
    opacity: 1;
    visibility: visible;
  }
  .diagram-flip-btn--error {
    animation: none;
  }
}

@media print {
  .diagramHeader {
    display: none;
  }
  .diagram-container {
    border-color: transparent;
    perspective: none;
  }
  .diagram-flip {
    transform-style: flat;
  }
  .diagram-face {
    backface-visibility: visible;
  }
  .diagram-face--back {
    display: none;
  }
}
`;
