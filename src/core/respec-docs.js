const linkableThings = new Set([
  "a11y",
  "additionalCopyrightHolders",
  "addPatentNote",
  "addSectionLinks",
  "alternateFormats",
  "authors",
  "caniuse",
  "canonicalURI",
  "charterDisclosureURI",
  "check-punctuation",
  "copyrightStart",
  "crEnd",
  "data-abbr",
  "data-cite",
  "data-dfn-for",
  "data-dfn-type",
  "data-export",
  "data-format",
  "data-include-format",
  "data-include-replace",
  "data-include",
  "data-link-for",
  "data-link-type",
  "data-local-lt",
  "data-lt-no-plural",
  "data-lt-noDefault",
  "data-lt",
  "data-max-toc",
  "data-number",
  "data-oninclude",
  "data-sort",
  "data-tests",
  "dir",
  "doJsonLd",
  "edDraftURI",
  "editors",
  "errata",
  "format",
  "formerEditors",
  "github",
  "group",
  "highlightVars",
  "implementationReportURI",
  "isPreview",
  "lang",
  "lcEnd",
  "level",
  "license",
  "lint",
  "local-refs-exist",
  "localBiblio",
  "logos",
  "maxTocLevel",
  "mdn",
  "modificationDate",
  "monetization",
  "no-headingless-sections",
  "no-http-props",
  "no-unused-vars",
  "noRecTrack",
  "noTOC",
  "otherLinks",
  "pluralize",
  "postProcess",
  "preProcess",
  "prevED",
  "previousDiffURI",
  "previousMaturity",
  "previousPublishDate",
  "prevRecShortname",
  "prevRecURI",
  "privsec-section",
  "publishDate",
  "shortName",
  "specStatus",
  "subjectPrefix",
  "submissionCommentNumber",
  "subtitle",
  "testSuiteURI",
  "tocIntroductory",
  "wgPatentPolicy",
  "wgPublicList",
  "wpt-tests-exist",
  "xref",
]);

/**
 * Tagged Template string, helps with linking to documentation.
 */
export function docLink(strings, ...keys) {
  return strings
    .map((s, i) => {
      const key = keys[i];
      if (!key) {
        return s;
      }
      const [linkingText, href] = key.split("|");
      // Known things...
      if (!href && linkableThings.has(linkingText)) {
        return `${s}[\`${linkingText}\`](https://respec.org/docs/#${linkingText})`;
      }
      // Aliased and other links
      if (href) {
        const url = new URL(href, "https://respec.org/docs/");
        return `${s}[${linkingText}](${url.href})`;
      }
      // Otherwise, pass through...
      return s + linkingText;
    })
    .join("");
}
