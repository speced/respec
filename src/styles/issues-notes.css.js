/* --- ISSUES/NOTES --- */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
.issue-label {
  text-transform: initial;
}

.warning > p:first-child {
  margin-top: 0;
}
.warning {
  padding: 0.5em;
  border-left-width: 0.5em;
  border-left-style: solid;
}
span.warning {
  padding: 0.1em 0.5em 0.15em;
}

.issue.closed span.issue-number {
  text-decoration: line-through;
}

.warning {
  border-color: #f11;
  border-width: 0.2em;
  border-style: solid;
  background: #fbe9e9;
}

.warning-title:before {
  content: "⚠"; /*U+26A0 WARNING SIGN*/
  font-size: 1.3em;
  float: left;
  padding-right: 0.3em;
  margin-top: -0.3em;
}

li.task-list-item {
  list-style: none;
}

input.task-list-item-checkbox {
  margin: 0 0.35em 0.25em -1.6em;
  vertical-align: middle;
}

.issue a.respec-gh-label {
  padding: 5px;
  margin: 0 2px 0 2px;
  font-size: 10px;
  text-transform: none;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  position: relative;
  bottom: 2px;
  border: none;
  display: inline-block;
}
`;
