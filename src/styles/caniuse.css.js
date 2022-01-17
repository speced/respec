/* container for stats */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
.caniuse-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: baseline;
}

button.caniuse-cell {
  margin: 1px 1px 0 0;
  border: none;
}

.caniuse-browser {
  position: relative;
}

/* handle case when printing */
@media print {
  .caniuse-cell.y::before {
    content: "✔️";
    padding: 0.5em;
  }

  .caniuse-cell.n::before {
    content: "❌";
    padding: 0.5em;
  }

  .caniuse-cell:is(.a,.d,.p,.x)::before {
    content: "⚠️";
    padding: 0.5em;
  }
}

/* reset styles, hide old versions by default */
.caniuse-browser ul {
  display: none;
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  left: 0;
  z-index: 2;
  background: #fff;
  margin-top: 1px;
}

.caniuse-stats a[href] {
  white-space: nowrap;
  align-self: center;
  margin-left: 0.5em;
}

/* a browser version */
.caniuse-cell {
  display: flex;
  font-size: 90%;
  height: 0.8cm;
  margin-right: 1px;
  margin-top: 0;
  min-width: 3cm;
  overflow: visible;
  justify-content: center;
  align-items: center;

  --supported: #2a8436;
  --no-support: #c44230;
  --no-support-alt: #b43b2b;
  --partial: #807301;
  --partial-alt: #746c00;

  color: #fff;
  background: repeating-linear-gradient(
    var(--caniuse-angle, 45deg),
    var(--caniuse-bg) 0,
    var(--caniuse-bg-alt) 1px,
    var(--caniuse-bg-alt) 0.4em,
    var(--caniuse-bg) calc(0.25em + 1px),
    var(--caniuse-bg) 0.75em
  );
}

li.caniuse-cell {
  margin-bottom: 1px;
}

.caniuse-cell:focus {
  outline: none;
}

/* supports */
.caniuse-cell.y {
  background: var(--supported);
}

/* no support, disabled by default */
.caniuse-cell:is(.n,.d) {
  --caniuse-angle: 45deg;
  --caniuse-bg: var(--no-support);
  --caniuse-bg-alt: var(--no-support-alt);
}

.caniuse-cell.d {
  --caniuse-angle: 180deg;
}

/* not supported by default / partial support etc
see https://github.com/Fyrd/caniuse/blob/master/CONTRIBUTING.md for stats */
.caniuse-cell:is(.a,.x,.p) {
  --caniuse-angle: 90deg;
  --caniuse-bg: var(--partial);
  --caniuse-bg-alt: var(--partial-alt);
}

/* show rest of the browser versions */
.caniuse-stats button:focus + ul,
.caniuse-stats .caniuse-browser:hover > ul {
  display: block;
}
`;
