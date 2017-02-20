// Module core/default-root-attr
// In cases where it is recommended that a document specify its language and writing direction,
// this module will supply defaults of "en" and "ltr" respectively (but won't override
// specified values).
// Be careful in using this that these defaults make sense for the type of document you are
// publishing.
export const name = "core/default-root-attr";

const html = document.querySelector("html");
if (!html.hasAttribute("lang")) {
  html.lang = "en";
  if (!html.hasAttribute("dir")) {
    html.dir = "ltr";
  }
}
