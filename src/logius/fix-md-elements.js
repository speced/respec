// @ts-check
// Module logius/fix-table
// add table class simple to all tables

export const name = "logius/fix-md-elements";

export function run(conf) {
  addClassTables(conf);
  addClassCode(conf);
  addFigureImg(conf);
}

function addClassTables(conf) {
  if (!conf.nl_markdownTableClass) {
    conf.nl_markdownTableClass = "simple";
  }
  [...document.querySelectorAll("table")].forEach(table => {
    table.classList.add(conf.nl_markdownTableClass);
  });
}

function addClassCode(conf) {
  if (conf.nl_markdownCodeClass !== undefined) {
    [...document.querySelectorAll("code")].forEach(code => {
      code.classList.add(conf.nl_markdownCodeClass);
    });
  }
}

function addFigureImg(conf) {
  if (!conf.nl_markdownEmbedImageInFigure) {
    return;
  }

  [...document.querySelectorAll("img")]
    .filter(img => !img.closest("figure"))
    .forEach(img => {
      const figure = document.createElement("figure");
      const figcaption = document.createElement("figcaption");
      figcaption.innerText = img.getAttribute("title");
      const cloneImg = img.cloneNode(false);
      figure.appendChild(cloneImg);
      figure.appendChild(figcaption);
      img.parentNode.insertBefore(figure, img);
      img.remove();
    });
}
