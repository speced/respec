/* container for stats */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`

.caniuse-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.caniuse-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(20em, 100%), 1fr));
  gap: 0.5em;
  margin: 0;
  padding: 0;
}

.caniuse-group {
  display: flex;
  flex-direction: column;
}

.caniuse-type {
  text-transform: capitalize;
  font-size: 0.8em;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.2em;
}

.caniuse-browsers {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  column-gap: 0.4em;
  row-gap: 0.4em;
  margin: 0;
  padding: 0.4em 0;
}

/* a browser version */
.caniuse-cell {
  align-items: center;
  border-radius: 1cm;
  color: #fff;
  display: flex;
  font-size: 90%;
  min-width: 1.5cm;
  padding: 0.3rem;
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
  filter: drop-shadow(0px 0px 0.1cm #666666);
  background: transparent;
}

.caniuse-cell span.browser-version {
  margin-inline-start: 0.4em;
  text-shadow: 0 0 0.1em #fff;
  font-weight: 100;
  font-size: 0.9em;
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
.caniuse-cell:is(.n, .d) {
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
.caniuse-cell:is(.a, .x, .p) {
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

  .caniuse-cell:is(.a, .d, .p, .x, .u)::before {
    content: "⚠️";
    padding: 0.5em;
  }
}
`;
