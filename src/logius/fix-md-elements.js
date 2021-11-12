// @ts-check
// Module logius/fix-table
// add table class simple to all tables

export const name = "logius/fix-md-elements";

export function run(conf) {
  addClassTables(conf);
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
