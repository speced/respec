import { showWarning } from "../core/utils.js";

export const name = "logius/label";

export async function run(conf) {
  await createLabel(conf);
}

async function createLabel(conf) {
  if (!conf.useLabel) {
    return;
  }
  const sideLabel = document.createElement("div");

  let labelColor = conf.labelColor[conf.specStatus.toLowerCase()];
  if (typeof labelColor == "undefined") {
    showWarning(`Missing labelColor for specStatus ${conf.specStatus}`);
    labelColor = "Black";
  }

  sideLabel.innerHTML = `${conf.nl_organisationName} ${conf.typeText} - ${conf.statusText}`;

  sideLabel.setAttribute("class", "sidelabel");
  document.body.appendChild(sideLabel);

  if (document.querySelector(".sidelabel")) {
    const style = document.createElement("style");
    style.textContent = `
  .sidelabel {
    position: fixed;
    -webkit-transform-origin: top right;
    right: 100%;
    top: 0;
    -webkit-transform: rotate(-90deg);
    padding: 4px 50px 4px 10px;
    color: white;
    white-space: nowrap;
    z-index: 1;
    background-color: ${labelColor};
  }`;
    document.head.appendChild(style);
  }
}
