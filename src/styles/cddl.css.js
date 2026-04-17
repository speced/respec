/* --- CDDL --- */
const css = String.raw;

// prettier-ignore
export default css`
pre.cddl {
  padding: 1em;
  position: relative;
}

pre.cddl > code {
  color: black;
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
  background: #8ccbf2;
  background: var(--def-border, #8ccbf2);
  color: #005a9c;
  font-family: sans-serif;
  font-weight: bold;
  margin: -1em 0 1em -1em;
  height: 28px;
  line-height: 28px;
}

.cddlHeader a.self-link {
  margin-left: 0.3cm;
  text-decoration: none;
  border-bottom: none;
  color: inherit;
}

pre.cddl .cddl-comment {
  color: #6a737d;
  font-style: italic;
}

pre.cddl .cddl-kw {
  color: #005a9c;
}

pre.cddl .cddl-str,
pre.cddl dfn[data-dfn-type="cddl-value"] {
  color: #032f62;
}

pre.cddl .cddl-num {
  color: #005cc5;
}

pre.cddl .cddl-op {
  color: #6f42c1;
}

pre.cddl .cddl-ctrl {
  color: #d73a49;
}

pre.cddl .cddl-occ {
  color: #e36209;
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
  color: #22863a;
}

pre.cddl .cddl-param {
  font-style: italic;
  color: #e36209;
}

pre.cddl a[data-link-type] {
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
}

pre.cddl dfn {
  font-style: normal;
  font-weight: bold;
}

pre.cddl dfn[data-dfn-type="cddl-type"] {
  color: #c43a31;
}

pre.cddl dfn[data-dfn-type="cddl-key"] {
  color: #005a9c;
}

@media (prefers-color-scheme: dark) {
  .cddlHeader {
    background: #3a6da0;
  }

  pre.cddl .cddl-comment {
    color: #8b949e;
  }

  pre.cddl .cddl-kw {
    color: #79c0ff;
  }

  pre.cddl .cddl-str,
  pre.cddl dfn[data-dfn-type="cddl-value"] {
    color: #a5d6ff;
  }

  pre.cddl .cddl-num {
    color: #79c0ff;
  }

  pre.cddl .cddl-op {
    color: #d2a8ff;
  }

  pre.cddl .cddl-ctrl {
    color: #ff7b72;
  }

  pre.cddl .cddl-occ {
    color: #ffa657;
  }

  pre.cddl .cddl-bytes {
    color: #7ee787;
  }

  pre.cddl .cddl-param {
    color: #ffa657;
  }

  pre.cddl dfn[data-dfn-type="cddl-type"] {
    color: #ffa198;
  }

  pre.cddl dfn[data-dfn-type="cddl-key"] {
    color: #79c0ff;
  }
}
`;
