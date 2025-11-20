const css = String.raw;

export default css`
  .sortable th {
    vertical-align: middle;
    white-space: nowrap;
  }

  .sortable th button {
    background: inherit;
    color: inherit;
    border: none;
    font-size: 0.6em;
    padding: 0.5em;
  }

  .sortable th button:hover {
    cursor: pointer;
  }

  .sortable th button:focus {
    outline: 1px solid;
  }
`;
