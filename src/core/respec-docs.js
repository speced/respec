const configOptions = new Set([
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

const configReMapper = new Map([["respecConfig", "configuring-respec"]]);

const otherDocsLinks = new Map([
  [
    "implementation experience",
    "https://www.w3.org/Consortium/Process/#implementation-experience",
  ],
  ["supported group short names", "https://respec.org/w3c/groups/"],
]);

/**
 * Tagged Template string, helps with linking to documentation.
 */
export function docLink(strings, ...keys) {
  return strings
    .map((s, i) => {
      const key = keys[i] ?? "";
      switch (true) {
        case configReMapper.has(key):
          return `${s}[\`${key}\`](https://respec.org/docs/#${configReMapper.get(
            key
          )})`;
        case configOptions.has(key):
          return `${s}[\`${key}\`](https://respec.org/docs/#${key})`;
        case otherDocsLinks.has(key):
          return `${s}[${key}](${otherDocsLinks.get(key)})`;
        default:
          return s + key;
      }
    })
    .join("");
}
