const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
var:hover {
  text-decoration: underline;
  cursor: pointer;
}

var.respec-hl {
  color: var(--color, #000);
  background-color: var(--bg-color);
  box-shadow: 0 0 0px 2px var(--bg-color);
}

/* highlight colors
  https://github.com/w3c/tr-design/issues/152
*/
var.respec-hl-c1 {
  --bg-color: #f4d200;
}

var.respec-hl-c2 {
  --bg-color: #ff87a2;
}

var.respec-hl-c3 {
  --bg-color: #96e885;
}

var.respec-hl-c4 {
  --bg-color: #3eeed2;
}

var.respec-hl-c5 {
  --bg-color: #eacfb6;
}

var.respec-hl-c6 {
  --bg-color: #82ddff;
}

var.respec-hl-c7 {
  --bg-color: #ffbcf2;
}

@media print {
  var.respec-hl {
    background: none;
    color: #000;
    box-shadow: unset;
  }
}
`;
