import css from "../styles/side-label.css.js";
import { pub } from "../core/pubsubhub.js";

export async function run(conf) {
  await createSideLabel(conf);
}

async function createSideLabel(conf) {
  const sideLabel = document.createElement("div");

  if (!conf.nl_organisationName) {
    pub("warn", "Missing nl_organisationName");
  }
  if (!conf.labelText) {
    pub("warn", "Missing labelText");
  }
  if (!conf.specStatus) {
    pub("warn", "Missing specStatus");
  }
  if (!conf.labelColor) {
    pub("warn", "Missing labelColor");
  }

  sideLabel.innerHTML = `${conf.nl_organisationName} - ${
    conf.labelText[conf.specStatus.toLowerCase()]
  }`;
  sideLabel.setAttribute("class", "sidelabel");
  sideLabel.setAttribute("style", `background-color: ${conf.labelColor};`);
  document.body.appendChild(sideLabel);

  if (document.querySelector(".sidelabel")) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }
}
