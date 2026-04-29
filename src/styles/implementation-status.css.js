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
  .baseline-pill {
    background: none !important;
    border: 1px solid #ccc;
  }

  .baseline-support-icon {
    color: #333 !important;
  }
}
`;
