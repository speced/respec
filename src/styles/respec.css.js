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
:is(h1, h2, h3, h4, h5, h6, a) abbr {
  border: none;
}

dfn {
  font-weight: bold;
}

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

code {
  color: #c63501;
}

th code {
  color: inherit;
}

a[href].orcid {
  padding-left: 4px;
  padding-right: 4px;
}

a[href].orcid > svg {
  margin-bottom: -2px;
}

/* --- TOC --- */

.toc a,
.tof a {
  text-decoration: none;
}

a .secno,
a .figno {
  color: #000;
}

ul.tof,
ol.tof {
  list-style: none outside none;
}

.caption {
  margin-top: 0.5em;
  font-style: italic;
}

/* --- TABLE --- */

table.simple {
  border-spacing: 0;
  border-collapse: collapse;
  border-bottom: 3px solid #005a9c;
}

.simple th {
  background: #005a9c;
  color: #fff;
  padding: 3px 5px;
  text-align: left;
}

.simple th a {
  color: #fff;
  padding: 3px 5px;
  text-align: left;
}

.simple th[scope="row"] {
  background: inherit;
  color: inherit;
  border-top: 1px solid #ddd;
}

.simple td {
  padding: 3px 10px;
  border-top: 1px solid #ddd;
}

.simple tr:nth-child(even) {
  background: #f0f6ff;
}

/* --- DL --- */

.section dd > p:first-child {
  margin-top: 0;
}

.section dd > p:last-child {
  margin-bottom: 0;
}

.section dd {
  margin-bottom: 1em;
}

.section dl.attrs dd,
.section dl.eldef dd {
  margin-bottom: 0;
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

a[href].self-link:hover {
  opacity: 1;
  text-decoration: none;
  background-color: transparent;
}

h2,
h3,
h4,
h5,
h6 {
  position: relative;
}

aside.example .marker > a.self-link {
  color: inherit;
}

:is(h2, h3, h4, h5, h6) > a.self-link {
  border: none;
  color: inherit;
  font-size: 83%;
  height: 2em;
  left: -1.6em;
  opacity: 0.5;
  position: absolute;
  text-align: center;
  text-decoration: none;
  top: 0;
  transition: opacity 0.2s;
  width: 2em;
}

:is(h2, h3, h4, h5, h6) > a.self-link::before{
  content: "§";
  display: block;
}

@media (max-width: 767px) {
  dd {
    margin-left: 0;
  }

  /* Don't position self-link in headings off-screen */
  :is(h2, h3, h4, h5, h6) > a.self-link {
    left: auto;
    top: auto;
  }
}

@media print {
  .removeOnSave {
    display: none;
  }
}
`;
