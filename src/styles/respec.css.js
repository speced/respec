/* ReSpec specific CSS */
const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
@keyframes pop {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1.25, 1.25);
    opacity: 0.75;
  }
  100% {
    transform: scale(1, 1);
  }
}

/* --- INLINES --- */
a.internalDFN {
  color: inherit;
  border-bottom: 1px solid #99c;
  text-decoration: none;
}

a.externalDFN {
  color: inherit;
  border-bottom: 1px dotted #ccc;
  text-decoration: none;
}

a.bibref {
  text-decoration: none;
}

.respec-offending-element:target {
  animation: pop 0.25s ease-in-out 0s 1;
}

.respec-offending-element,
a[href].respec-offending-element {
  text-decoration: red wavy underline;
}
@supports not (text-decoration: red wavy underline) {
  .respec-offending-element:not(pre) {
    display: inline-block;
  }
  .respec-offending-element {
    /* Red squiggly line */
    background: url(data:image/gif;base64,R0lGODdhBAADAPEAANv///8AAP///wAAACwAAAAABAADAEACBZQjmIAFADs=)
      bottom repeat-x;
  }
}

#references :target {
  background: #eaf3ff;
  animation: pop 0.4s ease-in-out 0s 1;
}

cite .bibref {
  font-style: normal;
}

a[href].orcid {
  padding-left: 4px;
  padding-right: 4px;
}

a[href].orcid > svg {
  margin-bottom: -2px;
}

/* --- TOF --- */
ul.tof,
ol.tof {
  list-style: none outside none;
}

.caption {
  margin-top: 0.5em;
  font-style: italic;
}
#issue-summary > ul {
  column-count: 2;
}

#issue-summary li {
  list-style: none;
  display: inline-block;
}

details.respec-tests-details {
  margin-left: 1em;
  display: inline-block;
  vertical-align: top;
}

details.respec-tests-details > * {
  padding-right: 2em;
}

details.respec-tests-details[open] {
  z-index: 999999;
  position: absolute;
  border: thin solid #cad3e2;
  border-radius: 0.3em;
  background-color: white;
  padding-bottom: 0.5em;
}

details.respec-tests-details[open] > summary {
  border-bottom: thin solid #cad3e2;
  padding-left: 1em;
  margin-bottom: 1em;
  line-height: 2em;
}

details.respec-tests-details > ul {
  width: 100%;
  margin-top: -0.3em;
}

details.respec-tests-details > li {
  padding-left: 1em;
}

.self-link:hover {
  opacity: 1;
  text-decoration: none;
  background-color: transparent;
}

aside.example .marker > a.self-link {
  color: inherit;
}

.header-wrapper {
  display: flex;
  align-items: baseline;
}

:is(h2, h3, h4, h5, h6):not(#toc > h2, #abstract > h2, #sotd > h2, .head > h2) {
  position: relative;
  left: -.5em;
}

:is(h2, h3, h4, h5, h6):not(#toc h2) + a.self-link {
  color: inherit;
  order: -1;
  position: relative;
  left: -1.1em;
  font-size: 1rem;
  opacity: 0.5;
}

:is(h2, h3, h4, h5, h6) + a.self-link::before {
  content: "§";
  text-decoration: none;
  color: var(--heading-text);
}

:is(h2, h3) + a.self-link {
  top: -0.2em;
}

:is(h4, h5, h6) + a.self-link::before {
  color: black;
}

@media (max-width: 767px) {
  dd {
    margin-left: 0;
  }
}

@media print {
  .removeOnSave {
    display: none;
  }
}
`;
