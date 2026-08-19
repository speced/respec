const css = String.raw;

// prettier-ignore
export default css`
  .sortable th {
    vertical-align: middle;
    white-space: nowrap;
  }

  .sortable th button {
    background: transparent;
    color: inherit;
    border: none;
    font-size: 0.7em;
    padding: 0 0.3em;
    cursor: pointer;
    opacity: 0.5;
    vertical-align: middle;
  }

  .sortable th button:hover,
  .sortable th button:focus {
    opacity: 1;
    outline: 1px solid;
  }

  .sortable th[aria-sort="ascending"] button,
  .sortable th[aria-sort="descending"] button {
    opacity: 1;
  }
`;
