/* --- EXAMPLES --- */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
span.example-title {
  text-transform: none;
}

aside.example,
div.example,
div.illegal-example {
  padding: 0.5em;
  margin: 1em 0;
  position: relative;
  clear: both;
}

div.illegal-example {
  color: red;
}

div.illegal-example p {
  color: black;
}

aside.example,
div.example {
  padding: 0.5em;
  border-left-width: 0.5em;
  border-left-style: solid;
  border-color: #e0cb52;
  background: #fcfaee;
}

aside.example div.example {
  border-left-width: 0.1em;
  border-color: #999;
  background: #fff;
}
aside.example div.example span.example-title {
  color: #999;
}

.example pre {
  background-color: rgba(0, 0, 0, 0.03);
}
`;
