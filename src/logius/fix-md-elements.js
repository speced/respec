// @ts-check
// Module logius/fix-table
// add table class simple to all tables

import { showWarning } from "../core/utils.js";
export const name = "logius/fix-md-elements";

export function run(conf) {
  addClassTables(conf);
  checkImgAlt(conf);
  addClassCode(conf);
}
// todo check if algorithm is correct!
function addClassTables(conf) {
  // todo do nothing if this config is not set?
  if (!conf.nl_markdownTableClass) {
    conf.nl_markdownTableClass = "simple";
  }
  [...document.querySelectorAll("[data-format=markdown]:not(body)")].forEach(
    section =>
      section.querySelectorAll("table").forEach(table => {
        // table.classList.add("complex");
        table.classList.add(conf.nl_markdownTableClass);
      })
  );
}

function checkImgAlt(conf) {
  if (
    !conf.nl_markdownEmbedImageInFigure
  ) {
    return;
  }  
  /** @type {NodeListOf<HTMLImageElement>} */
  const elems = document.querySelectorAll("section[data-format=markdown] img");
  const offendingElements = [...elems].filter(
    elem => !elem.alt
  );
  if (!offendingElements.length) {
    return;
  }
  const msg = "Image missing alternative text.";
      const hint = "";
  showWarning(msg, name, { elements: offendingElements, hint });
}

// todo check if algorithm is correct!
function addClassCode(conf) {
  // todo do nothing if this config is not set?
  if (!conf.nl_markdownCodeClass) {
    return;
  }
  [...document.querySelectorAll("[data-format=markdown]:not(body)")].forEach(
    section =>
      section.querySelectorAll("code").forEach(code => {
        // table.classList.add("complex");
        code.classList.add(conf.nl_markdownCodeClass);
      })
  );
}