// @ts-check
// Module logius/fix-table
// add table class simple to all tables

export const name = "logius/fix-md-elements";

export function run(conf) {
  addClassTables(conf);
  addFigureImg(conf);
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

// todo check non happy flows
function addFigureImg(conf) {
  if (
    !conf.nl_markdownEmbedImageInFigure
  ) {
    return;
  }

  [...document.querySelectorAll("[data-format=markdown]:not(body)")].forEach(
    section =>
      section.querySelectorAll("img").forEach(img => {
        // filter out images that already are embedded in a figure element
        if (img.parentNode.nodeName != "FIGURE") {
          const figure = document.createElement("figure");
          const figcaption = document.createElement("figcaption");
          // todo
          const filePath = img.getAttribute("src");
          const extractFilename = path => {
            let pathArray = path.split("/");
            const lastIndex = pathArray.length - 1;
            const filename = pathArray[lastIndex];
            pathArray = filename.split(".");
            return pathArray[0];
          };
          const id = extractFilename(filePath);
          figure.setAttribute("id", id);
          const caption = img.getAttribute("alt")
            ? `${img.getAttribute("alt")}`
            : "todo_caption";
          figcaption.innerText = caption;
          const cloneImg = img.cloneNode(false);
          if (!img.getAttribute("title")) {
            cloneImg.setAttribute("title", caption);
          }
          figure.appendChild(cloneImg);
          figure.appendChild(figcaption);
          img.parentNode.insertBefore(figure, img);
          img.remove();
        }
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