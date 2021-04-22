const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
var {
  position: relative;
  cursor: pointer;
}

var[data-type]::before,
var[data-type]::after {
  position: absolute;
  left: 50%;
  top: -6px;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

/* the triangle or arrow or caret or whatever */
var[data-type]::before {
  content: "";
  transform: translateX(-50%);
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: transparent;
  border-top-color: #000;
}

/* actual text */
var[data-type]::after {
  content: attr(data-type);
  transform: translateX(-50%) translateY(-100%);
  background: #000;
  text-align: center;
  /* additional styling */
  font-family: "Dank Mono", "Fira Code", monospace;
  font-style: normal;
  padding: 6px;
  border-radius: 3px;
  color: #daca88;
  text-indent: 0;
  font-weight: normal;
}

var[data-type]:hover::after,
var[data-type]:hover::before {
  opacity: 1;
}
`;
