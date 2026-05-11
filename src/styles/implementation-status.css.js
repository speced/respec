const css = String.raw;

// prettier-ignore
export default css`

.baseline-title {
  display: flex;
  align-items: center;
  gap: 0.4em;
}

.baseline-icon {
  width: auto;
  height: 0.9em;
  vertical-align: baseline;
}

.baseline-status {
  display: flex;
  align-items: center;
  gap: 1em;
}

.baseline-browsers {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.baseline-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  padding: 0.25em 0.5em;
  border-radius: 2em;
}

.baseline-pill.supported {
  background: rgba(30, 142, 62, 0.12);
}

.baseline-pill.unsupported {
  background: rgba(234, 134, 0, 0.12);
}

.baseline-browser {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.baseline-browser-logo {
  width: 24px;
  height: 24px;
}

.baseline-support-icon {
  width: 17px;
  height: 21px;
  margin-left: -4px;
}

.support-available .baseline-support-icon {
  color: #1e8e3e;
}

.support-unavailable .baseline-support-icon {
  color: #ea8600;
}

.baseline-more-info {
  font-size: 0.85em;
  white-space: nowrap;
}

/* Loading state */
.baseline-status--loading {
  min-height: 32px;
  opacity: 0.6;
  will-change: opacity;
}

@media (prefers-reduced-motion: no-preference) {
  .baseline-status--loading {
    animation: baseline-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    animation-delay: 300ms;
    animation-fill-mode: backwards;
  }
}

@keyframes baseline-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.35; }
}

@media (prefers-reduced-motion: no-preference) {
  .baseline-status--loaded {
    animation: baseline-appear 200ms cubic-bezier(0, 0, 0.2, 1) both;
  }
}

@keyframes baseline-appear {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

/* Visually hidden live region for screen readers */
.baseline-a11y-summary {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .baseline-pill.supported {
    background: rgba(36, 164, 70, 0.2);
  }

  .baseline-pill.unsupported {
    background: rgba(240, 148, 24, 0.2);
  }

  .support-available .baseline-support-icon {
    color: #24a446;
  }

  .support-unavailable .baseline-support-icon {
    color: #f09418;
  }
}

@media print {
  .baseline-status--loading {
    animation: none;
    opacity: 1;
  }

  .baseline-pill {
    background: none !important;
    border: 1px solid #ccc;
  }

  .baseline-support-icon {
    color: #333 !important;
  }
}
`;
