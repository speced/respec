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
  color: var(--text, black);
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
  background: var(--def-border, #8ccbf2);
  color: #fff;
  /* TODO: need a better color here */
  color: var(--defrow-border, #fff);
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
  color: inherit;
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
`;
