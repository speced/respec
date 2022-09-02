import css from "../styles/side-label.css.js";

export async function run(conf) {
  await createSideLabel(conf);
}

async function createSideLabel(conf) {
  const sideLabel = document.createElement("div");
  sideLabel.innerHTML = `${conf.nl_organisationName} - ${conf.specType}`;
  sideLabel.setAttribute("class", "sidelabel");
  document.body.appendChild(sideLabel);

  if (document.querySelector(".sidelabel")) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }
}
