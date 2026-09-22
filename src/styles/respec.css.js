/* ReSpec specific CSS */
const css = String.raw;
const darkRefTargetBg = String.raw`color-mix(in srgb, #eaf3ff 15%, transparent)`;

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

@media (prefers-color-scheme: dark) {
  #references :target {
    background: ${darkRefTargetBg};
  }
}

body:has(input[name='color-scheme'][value='dark']:checked) #references :target {
  background: ${darkRefTargetBg};
}

cite .bibref {
  font-style: italic;
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

/* :where() again, for the same reason as the rule below: these four IDs would
   otherwise make this (1, 1, 3) and put it out of reach of ordinary author CSS. */
:is(h2, h3, h4, h5, h6):not(:where(#toc > h2, #abstract > h2, #sotd > h2, .head > h2)):has(+ a.self-link) {
  position: relative;
  left: -.5em;
}

/* The #toc exclusion is wrapped in :where() so it contributes no specificity.
   As a bare :not(#toc h2) its ID outweighed .self-link:hover and killed that
   rule's opacity: 1. */
:is(h2, h3, h4, h5, h6):not(:where(#toc h2)) + a.self-link {
  color: inherit;
  order: -1;
  position: relative;
  left: -1.1em;
  font-size: 1rem;
  opacity: 0.8;
  /* Has to be here, not on the ::before: a decoration is painted across the
     pseudo-element regardless of what the pseudo-element itself declares. */
  text-decoration: none;
}

:is(h2, h3, h4, h5, h6) + a.self-link::before {
  content: "§";
}

:is(h2, h3) + a.self-link {
  top: -0.2em;
}

/* base.css colors only h1-h3, with --heading-text. h4-h6 inherit the surrounding
   text, so their icon does too — by not declaring a color here at all. */
:is(h2, h3) + a.self-link::before {
  color: var(--heading-text);
}

@media (max-width: 767px) {
  dd {
    margin-left: 0;
  }
}

#back-to-top {
  text-align: end;
}

#back-to-top a {
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
}

@media print {
  .removeOnSave {
    display: none;
  }

  #back-to-top {
    display: none;
  }
}

/**
 * Control prefers-color-scheme behavior in linked SVGs:
 * - use light when no dark scheme present, or light scheme is checked.
 * - use dark when dark scheme is checked.
 */
head:not(:has(meta[name='color-scheme'][content~='dark'])) + body,
body:has(input[name='color-scheme'][value='light']:checked) {
  color-scheme: light;
}
body:has(input[name='color-scheme'][value='dark']:checked) {
  color-scheme: dark;
}
`;
