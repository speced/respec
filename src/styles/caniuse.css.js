/* container for stats */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`

.caniuse-stats {
  display: flex;
  column-gap: 2em;
}

/* The dl is a new wrapper around the groups, so it has to be transparent to
   the flex row that used to hold them directly. */
.caniuse-groups {
  display: flex;
  flex: 1;
  column-gap: 2em;
  margin: 0;
}

/* Narrow screens: stack the groups full width so the pills wrap instead of
   forming tall single-file columns, and give "More info" its own row.
   767px matches the only other breakpoint in ReSpec (respec.css.js). */
@media (max-width: 767px) {
  .caniuse-stats {
    display: block;
  }

  .caniuse-groups {
    flex-direction: column;
  }

  /* Space every group equally, including the first. Using padding rather than
     row-gap avoids the second group getting gap plus padding while the first
     gets padding alone. Generous, because each group's label hangs below its
     own rule, and a tight gap reads as the label belonging to the group
     beneath it. */
  .caniuse-group {
    padding-top: 1.5em;
  }

  .caniuse-more-info {
    display: block;
    text-align: right;
    margin-top: 0.5em;
  }
}

/* column-reverse, not column: a dl requires the dt before its dd, but the
   label belongs visually below, straddling the rule under the browsers. */
.caniuse-group {
  display: flex;
  flex: 1;
  flex-direction: column-reverse;
  justify-content: flex-end;
  flex-basis: auto;
  /* Establish a stacking context so the label can be lifted above the dd's
     bottom border. Reversing the visual order does not reverse paint order:
     the dd is a later sibling, so its border would paint over the label and
     strike the text through. */
  position: relative;
}

.caniuse-browsers {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: .2em 0 0;
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
  /* Above the dd's border, so the label's background breaks the rule instead
     of the rule striking through the text. */
  position: relative;
  z-index: 1;
}

/* The label punches a hole in the rule above it, so its background has to match
   the page. This was var(--bg, white), but --bg is defined nowhere in ReSpec,
   so it always resolved to literal white: a white patch on a dark page.
   Canvas/CanvasText are system colours that follow the used color-scheme, so
   this tracks both the OS preference and ReSpec's own dark toggle. */
.caniuse-type span {
  background-color: Canvas;
  color: CanvasText;
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

.caniuse-more-info {
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
  /* Browsers drop backgrounds when printing, so the label can no longer punch
     a hole in the rule and the line would strike through the text. Drop the
     rule instead and let the label sit under its group. */
  .caniuse-browsers {
    border-bottom: none;
  }

  .caniuse-type {
    margin-top: 0;
  }

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
