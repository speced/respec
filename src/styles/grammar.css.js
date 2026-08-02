const css = String.raw;

// prettier-ignore
export default css`
:root {
  --grammar-header-bg: var(--def-border, #8ccbf2);
  --grammar-header-color: #005a9c;
  --grammar-focus: #51a7e8;
}

@media (prefers-color-scheme: dark) {
  :root {
    --grammar-header-bg: #3a6da0;
    --grammar-header-color: #fff;
  }
}

pre:is(.abnf, .ebnf, .bnf) {
  padding: 1em;
  position: relative;
}

pre:is(.abnf, .ebnf, .bnf) > code {
  color: var(--text, black);
}

@media print {
  pre:is(.abnf, .ebnf, .bnf) {
    white-space: pre-wrap;
  }
}

.grammarHeader {
  display: block;
  width: 150px;
  background: var(--grammar-header-bg);
  color: var(--grammar-header-color);
  font-family: sans-serif;
  font-weight: bold;
  margin: -1em 0 1em -1em;
  height: 1.75em;
  line-height: 1.75em;
}

.grammarHeader a.self-link {
  margin-left: 0.5em;
  text-decoration: none;
  border-bottom: none;
  color: inherit;
}

.grammarHeader a:focus-visible {
  outline: 2px solid var(--grammar-focus);
  outline-offset: 2px;
}
`;
