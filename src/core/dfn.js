// Module core/dfn
// Finds all <dfn> elements and populates conf.definitionMap to identify them.

export const name = "core/dfn";

function canonicalize(query, attributeName) {
  Array.from(document.querySelectorAll(query)).forEach(function(el) {
    el.dataset.dfnFor = el.getAttribute(attributeName).toLowerCase();
    el.removeAttribute(attributeName);
  });
}

export function run(conf, doc, cb) {
  if (!conf.hasOwnProperty("definitionMap")) {
    conf.definitionMap = Object.create(null);
  }
  // Canonicalize "dfn-for" and "for" attributes to data-dfn-for
  canonicalize("[dfn-for]", "dfn-for");
  canonicalize("dfn[for]", "for");
  Array.from(document.querySelectorAll("dfn")).forEach(function(dfn) {
    // TODO: Microsoft Edge doesn't support Element.closest() yet.
    const value = $(dfn).closest("[data-dfn-for]").attr("data-dfn-for");
    dfn.dataset.dfnFor = value ? value.toLowerCase() : "";
    // TODO: dfn's are tragically jquery'ed and stored. Should fix this.
    // Also, we should probably use weakmaps and weaksets here
    // to avoid leaks.
    const $dfn = $(dfn);
    $dfn
      .getDfnTitles({ isDefinition: true })
      .map(function(dfnTitle) {
        if (!conf.definitionMap[dfnTitle]) {
          conf.definitionMap[dfnTitle] = [];
        }
        return conf.definitionMap[dfnTitle];
      })
      .reduce(function($dfn, dfnTitleContainer) {
        dfnTitleContainer.push($dfn);
        return $dfn;
      }, $dfn);
  });
  cb();
}
