/*
@module "core/dfn-index"
Extends and overrides some styles from `base.css`.
*/
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
ul.index {
  columns: 30ch;
  column-gap: 1.5em;
}

ul.index li {
  list-style: inherit;
}

ul.index li span {
  color: inherit;
  cursor: pointer;
  white-space: normal;
}

#index-defined-here ul.index li {
  font-size: 0.9rem;
}

ul.index code {
  color: inherit;
}

#index-defined-here .print-only {
  display: none;
}

@media print {
  #index-defined-here .print-only {
    display: initial;
  }
}
`;
