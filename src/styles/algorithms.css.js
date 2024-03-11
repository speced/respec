/* For assertions in lists containing algorithms */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
:root {
  --assertion-border: #aaa;
  --assertion-bg: #eee;
  --assertion-text: black;
}

.assert {
  border-left: 0.5em solid #aaa;
  padding: 0.3em;
  border-color: #aaa;
  border-color: var(--assertion-border);
  background: #eee;
  background: var(--assertion-bg);
  color: black;
  color: var(--assertion-text);
}

/* There's no way to adapt this to "manual" theme toggle yet. */
@media (prefers-color-scheme: dark) {
  :root {
    --assertion-border: #444;
    --assertion-bg: var(--borderedblock-bg);
    --assertion-text: var(--text);
  }
}
`;
