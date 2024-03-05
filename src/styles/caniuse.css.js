/* container for stats */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`

.caniuse-stats {
  display: flex;
  column-gap: 2em;
}

.caniuse-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  flex-basis: auto;
}

.caniuse-browsers {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: .2em;
  column-gap: .4em;
  border-bottom: 1px solid #ccc;
  row-gap: .4em;
  padding-bottom: .4cm;
}

.caniuse-type {
  align-self: center;
  border-top: none;
  text-transform: capitalize;
  font-size: .8em;
  margin-top: -.8em;
  font-weight: bold;
}

.caniuse-type span {
  background-color: var(--bg, white);
  padding: 0 0.4em;
}

/* a browser version */
.caniuse-cell {
  align-items: center;
  border-radius: 1cm;
  color: #fff;
  display: flex;
  font-size: 90%;
  min-width: 1.5cm;
  padding: .3rem;
  justify-content: space-evenly;
  --supported: #2a8436dd;
  --no-support: #c44230dd;
  --no-support-alt: #b43b2bdd;
  --partial: #807301dd;
  --partial-alt: #746c00dd;
  --unknown: #757575;

  background: repeating-linear-gradient(
    var(--caniuse-angle, 45deg),
    var(--caniuse-bg) 0,
    var(--caniuse-bg-alt) 1px,
    var(--caniuse-bg-alt) 0.4em,
    var(--caniuse-bg) calc(0.25em + 1px),
    var(--caniuse-bg) 0.75em
  );
}

img.caniuse-browser {
  filter: drop-shadow(0px 0px .1cm #666666);
  background: transparent;
}

.caniuse-cell span.browser-version {
  margin-left: 0.4em;
  text-shadow: 0 0 0.1em #fff;
  font-weight: 100;
  font-size: .9em;
}

.caniuse-stats a[href] {
  white-space: nowrap;
  align-self: flex-end;
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

.caniuse-cell.u {
  background: var(--unknown);
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

  .caniuse-cell:is(.a,.d,.p,.x,.u)::before {
    content: "⚠️";
    padding: 0.5em;
  }
}
`;
