import * as ReSpec from "../src/respec.js";

const modules = [
  // order is significant
  import("../src/core/base-runner.js"),
  import("../src/core/ui.js"),
  import("../src/core/location-hash.js"),
  import("../src/core/l10n.js"),
  import("../src/logius/defaults.js"), // done, for now
  import("../src/core/style.js"),
  import("../src/logius/style.js"), // done for now, still some wip  
  import("../src/core/github.js"),
  import("../src/logius/github.js"), // try to revert some props
  import("../src/core/data-include.js"),
  import("../src/core/markdown.js"),
  import("../src/logius/fix-md-elements.js"), // todo check
  import("../src/core/reindent.js"), // nothing changed but this module is in geonovum profile at line 3
  import("../src/logius/releasetitle.js"), // todo an idea to add release tag to title
  import("../src/core/title.js"),
  import("../src/w3c/level.js"), // todo check if this must be skipped
  import("../src/w3c/group.js"), // todo check if this must be skipped
  import("../src/logius/headers.js"),
  import("../src/w3c/abstract.js"),
  import("../src/core/data-transform.js"),
  import("../src/core/data-abbr.js"),
  import("../src/core/inlines.js"), // moved dutch text from logius/inline.js to core/inline.js
  import("../src/w3c/conformance.js"), // added dutch additions into w3c version
  import("../src/core/dfn.js"),
  import("../src/core/pluralize.js"),
  import("../src/core/examples.js"),
  // import("../src/core/issues-notes.js"),
  import("../src/logius/issues-notes.js"),
  // todo insert requirements ?
  import("../src/core/best-practices.js"),
  import("../src/core/figures.js"),
  import("../src/core/biblio.js"),
  import("../src/core/link-to-dfn.js"),
  import("../src/core/xref.js"),
  import("../src/core/data-cite.js"),
  import("../src/core/render-biblio.js"),
  import("../src/core/dfn-index.js"),
  import("../src/core/contrib.js"),
  import("../src/core/fix-headers.js"),
  import("../src/core/structure.js"),
  import("../src/core/informative.js"), // solved handhaaf core version ipv  geonovum version
  import("../src/core/id-headers.js"),
  import("../src/ui/save-html.js"),
  import("../src/ui/search-specref.js"),
  import("../src/ui/search-xref.js"),
  import("../src/ui/about-respec.js"),
  import("../src/core/seo.js"),
  import("../src/w3c/seo.js"), // changed from logius/seo.js to w3c/seo.js since there was no notable difference
  import("../src/core/highlight.js"),
  import("../src/core/list-sorter.js"),
  import("../src/core/highlight-vars.js"),
  import("../src/core/dfn-panel.js"),
  import("../src/core/data-type.js"),
  import("../src/core/algorithms.js"),
  import("../src/core/anchor-expander.js"),
  import("../src/core/custom-elements/index.js"),
  /* Linters must be the last thing to run */
  import("../src/core/linter-rules/check-charset.js"),
  import("../src/core/linter-rules/check-punctuation.js"),
  import("../src/core/linter-rules/check-internal-slots.js"),
  import("../src/core/linter-rules/local-refs-exist.js"),
  import("../src/core/linter-rules/no-headingless-sections.js"),
  import("../src/core/linter-rules/no-altless-figures.js"),
  import("../src/core/linter-rules/no-unused-vars.js"),
  import("../src/core/linter-rules/privsec-section.js"),
  import("../src/core/linter-rules/no-http-props.js"),
  import("../src/core/linter-rules/a11y.js"),
];

Promise.all(modules)
  .then(plugins => ReSpec.run(plugins))
  .catch(err => console.error(err));
