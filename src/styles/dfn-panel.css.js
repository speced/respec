/* dfn popup panel that list all local references to a dfn */
/**
 * TODO: Revert changes due to https://github.com/w3c/respec/pull/2888 when
 * https://github.com/w3c/css-validator/pull/111 is fixed.
 */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
dfn {
  cursor: pointer;
}

.dfn-panel {
  position: absolute;
  z-index: 35;
  min-width: 300px;
  max-width: 500px;
  padding: 0.5em 0.75em;
  margin-top: 0.6em;
  font: small Helvetica Neue, sans-serif, Droid Sans Fallback;
  background: #fff;
  color: black;
  box-shadow: 0 1em 3em -0.4em rgba(0, 0, 0, 0.3),
    0 0 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}
/* Triangle/caret */
.dfn-panel:not(.docked) > .caret {
  position: absolute;
  top: -9px;
}
.dfn-panel:not(.docked) > .caret::before,
.dfn-panel:not(.docked) > .caret::after {
  content: "";
  position: absolute;
  border: 10px solid transparent;
  border-top: 0;
  border-bottom: 10px solid #fff;
  top: 0;
}
.dfn-panel:not(.docked) > .caret::before {
  border-bottom: 9px solid #a2a9b1;
}

.dfn-panel * {
  margin: 0;
}

.dfn-panel b {
  display: block;
  color: #000;
  margin-top: 0.25em;
}

.dfn-panel ul a[href] {
  color: #333;
}

.dfn-panel > div {
  display: flex;
}

.dfn-panel a.self-link {
  font-weight: bold;
  margin-right: auto;
}

.dfn-panel .marker {
  padding: 0.1em;
  margin-left: 0.5em;
  border-radius: 0.2em;
  text-align: center;
  white-space: nowrap;
  font-size: 90%;
  color: #040b1c;
}

.dfn-panel .marker.dfn-exported {
  background: #d1edfd;
  box-shadow: 0 0 0 0.125em #1ca5f940;
}
.dfn-panel .marker.idl-block {
  background: #8ccbf2;
  box-shadow: 0 0 0 0.125em #0670b161;
}

.dfn-panel a:not(:hover) {
  text-decoration: none !important;
  border-bottom: none !important;
}

.dfn-panel a[href]:hover {
  border-bottom-width: 1px;
}

.dfn-panel ul {
  padding: 0;
}

.dfn-panel li {
  margin-left: 1em;
}

.dfn-panel.docked {
  position: fixed;
  left: 0.5em;
  top: unset;
  bottom: 2em;
  margin: 0 auto;
  /* 0.75em from padding (x2), 0.5em from left position, 0.2em border (x2) */
  max-width: calc(100vw - 0.75em * 2 - 0.5em - 0.2em * 2);
  max-height: 30vh;
  overflow: auto;
}
`;
