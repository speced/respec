// Module w3c/informative
// Mark specific sections as informative, based on CSS
export const name = "w3c/informative";

export function run(conf, doc, cb) {
  $("section.informative")
    .find("> h2:first, > h3:first, > h4:first, > h5:first, > h6:first")
    .after("<p><em>This section is non-normative.</em></p>");
  cb();
}
