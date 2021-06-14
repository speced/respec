/* --- WEB IDL --- */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
pre.idl {
  padding: 1em;
  position: relative;
}

pre.idl > code {
  color: black;
}

@media print {
  pre.idl {
    white-space: pre-wrap;
  }
}

.idlHeader {
  display: block;
  width: 150px;
  background: #8ccbf2;
  color: #fff;
  font-family: sans-serif;
  font-weight: bold;
  margin: -1em 0 1em -1em;
  height: 28px;
  line-height: 28px;
}

.idlHeader a.self-link {
  margin-left: 0.3cm;
  text-decoration: none;
  border-bottom: none;
}

.idlID {
  font-weight: bold;
  color: #005a9c;
}

.idlType {
  color: #005a9c;
}

.idlName {
  color: #ff4500;
}

.idlName a {
  color: #ff4500;
  border-bottom: 1px dotted #ff4500;
  text-decoration: none;
}

a.idlEnumItem {
  color: #000;
  border-bottom: 1px dotted #ccc;
  text-decoration: none;
}

.idlSuperclass {
  font-style: italic;
  color: #005a9c;
}

/*.idlParam*/

.idlParamName,
.idlDefaultValue {
  font-style: italic;
}

.extAttr {
  color: #666;
}

/*.idlSectionComment*/

.idlSectionComment {
  color: gray;
}

.idlIncludes a {
  font-weight: bold;
}

.respec-button-copy-paste:focus {
  text-decoration: none;
  border-color: #51a7e8;
  outline: none;
  box-shadow: 0 0 5px rgba(81, 167, 232, 0.5);
}

.respec-button-copy-paste:is(:focus:hover,.selected:focus) {
  border-color: #51a7e8;
}

.respec-button-copy-paste:is(:hover,:active,.zeroclipboard-is-hover,.zeroclipboard-is-active) {
  text-decoration: none;
  background-color: #ddd;
  background-image: linear-gradient(#eee, #ddd);
  border-color: #ccc;
}

.respec-button-copy-paste:is(:active,.selected,.zeroclipboard-is-active) {
  background-color: #dcdcdc;
  background-image: none;
  border-color: #b5b5b5;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}

.respec-button-copy-paste.selected:hover {
  background-color: #cfcfcf;
}

.respec-button-copy-paste:is(:disabled,:disabled:hover,.disabled,.disabled:hover) {
  color: rgba(102, 102, 102, 0.5);
  cursor: default;
  background-color: rgba(229, 229, 229, 0.5);
  background-image: none;
  border-color: rgba(197, 197, 197, 0.5);
  box-shadow: none;
}

@media print {
  .respec-button-copy-paste {
    visibility: hidden;
  }
}
`;
