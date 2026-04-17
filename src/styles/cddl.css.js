/* --- CDDL --- */
const css = String.raw;

// prettier-ignore
export default css`
:root {
  --cddl-comment: #6a737d;
  --cddl-kw: #005a9c;
  --cddl-str: #032f62;
  --cddl-num: #005cc5;
  --cddl-op: #6f42c1;
  --cddl-ctrl: #d73a49;
  --cddl-occ: #e36209;
  --cddl-bytes: #22863a;
  --cddl-param: #e36209;
  --cddl-type-dfn: #c43a31;
  --cddl-key-dfn: #005a9c;
  --cddl-header-bg: var(--def-border, #8ccbf2);
  --cddl-header-color: #005a9c;
  --cddl-focus: #51a7e8;
}

@media (prefers-color-scheme: dark) {
  :root {
    --cddl-comment: #8b949e;
    --cddl-kw: #79c0ff;
    --cddl-str: #a5d6ff;
    --cddl-num: #79c0ff;
    --cddl-op: #d2a8ff;
    --cddl-ctrl: #ff7b72;
    --cddl-occ: #ffa657;
    --cddl-bytes: #7ee787;
    --cddl-param: #ffa657;
    --cddl-type-dfn: #ffa198;
    --cddl-key-dfn: #79c0ff;
    --cddl-header-bg: #3a6da0;
    --cddl-header-color: #005a9c;
    --cddl-focus: #51a7e8;
  }
}

pre.cddl {
  padding: 1em;
  position: relative;
}

pre.cddl > code {
  color: var(--text, black);
}

@media print {
  pre.cddl {
    white-space: pre-wrap;
  }
}

.cddlHeader {
  display: block;
  width: 150px;
  background: var(--cddl-header-bg);
  color: var(--cddl-header-color);
  font-family: sans-serif;
  font-weight: bold;
  margin: -1em 0 1em -1em;
  height: 1.75em;
  line-height: 1.75em;
}

.cddlHeader a.self-link {
  margin-left: 0.5em;
  text-decoration: none;
  border-bottom: none;
  color: inherit;
}

pre.cddl .cddl-comment {
  color: var(--cddl-comment);
  font-style: italic;
}

pre.cddl .cddl-kw {
  color: var(--cddl-kw);
}

pre.cddl .cddl-str,
pre.cddl dfn[data-dfn-type="cddl-value"] {
  color: var(--cddl-str);
}

pre.cddl .cddl-num {
  color: var(--cddl-num);
}

pre.cddl .cddl-op {
  color: var(--cddl-op);
}

pre.cddl .cddl-ctrl {
  color: var(--cddl-ctrl);
}

pre.cddl .cddl-occ {
  color: var(--cddl-occ);
}

pre.cddl .cddl-name {
  font-weight: bold;
}

pre.cddl .cddl-name a {
  color: inherit;
  border-bottom: 1px dotted currentColor;
  text-decoration: none;
}

pre.cddl .cddl-bytes {
  color: var(--cddl-bytes);
}

pre.cddl .cddl-param {
  font-style: italic;
  color: var(--cddl-param);
}

pre.cddl a[data-link-type] {
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
}

pre.cddl dfn {
  font-style: normal;
  font-weight: bold;
}

pre.cddl dfn:focus-visible,
pre.cddl a:focus-visible,
.cddlHeader a.self-link:focus-visible {
  outline: 2px solid var(--cddl-focus);
  outline-offset: 2px;
}

.respec-button-copy-paste:focus-visible {
  outline: 2px solid var(--cddl-focus);
  outline-offset: 2px;
}

pre.cddl dfn[data-dfn-type="cddl-type"] {
  color: var(--cddl-type-dfn);
}

pre.cddl dfn[data-dfn-type="cddl-key"] {
  color: var(--cddl-key-dfn);
}
`;
