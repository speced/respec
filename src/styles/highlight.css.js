/*
One Light for ReSpec, with better color contrast
Adapted from Atom One Light by Daniel Gamage (https://github.com/highlightjs/highlight.js/blob/c0b6ddbaaf7/src/styles/atom-one-light.css>
Original One Light Syntax theme from https://github.com/atom/one-light-syntax
*/

const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
.hljs {
  --base: #fafafa;
  --mono-1: #383a42;
  --mono-2: #686b77;
  --mono-3: #717277;
  --hue-1: #0b76c5;
  --hue-2: #336ae3;
  --hue-3: #a626a4;
  --hue-4: #42803c;
  --hue-5: #ca4706;
  --hue-5-2: #c91243;
  --hue-6: #986801;
  --hue-6-2: #9a6a01;
}

/* There's no way to adapt this to "manual" theme toggle yet. */
@media (prefers-color-scheme: dark) {
  .hljs {
    --base: #282c34;
    --mono-1: #abb2bf;
    --mono-2: #818896;
    --mono-3: #5c6370;
    --hue-1: #56b6c2;
    --hue-2: #61aeee;
    --hue-3: #c678dd;
    --hue-4: #98c379;
    --hue-5: #e06c75;
    --hue-5-2: #be5046;
    --hue-6: #d19a66;
    --hue-6-2: #e6c07b;
  }
}

.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #383a42;
  color: var(--mono-1, #383a42);
  background: #fafafa;
  background: var(--base, #fafafa);
}

.hljs-comment,
.hljs-quote {
  color: #717277;
  color: var(--mono-3, #717277);
  font-style: italic;
}

.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  color: #a626a4;
  color: var(--hue-3, #a626a4);
}

.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #ca4706;
  color: var(--hue-5, #ca4706);
  font-weight: bold;
}

.hljs-literal {
  color: #0b76c5;
  color: var(--hue-1, #0b76c5);
}

.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta-string {
  color: #42803c;
  color: var(--hue-4, #42803c);
}

.hljs-built_in,
.hljs-class .hljs-title {
  color: #9a6a01;
  color: var(--hue-6-2, #9a6a01);
}

.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #986801;
  color: var(--hue-6, #986801);
}

.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #336ae3;
  color: var(--hue-2, #336ae3);
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

.hljs-link {
  text-decoration: underline;
}
`;
