import css from "../styles/side-label.css.js";
import { getIntlData } from "../core/utils.js";


export async function run(conf) {
  await createSideLabel(conf);
}

async function createSideLabel(conf) {
  if (!conf.useSideBar) {
    return;
  }
  const l10n_labelText = getIntlData(conf.labelText);
  const sideLabel = document.createElement("div");

  const labelColor = conf.labelColorTable[conf.specStatus.toLowerCase()];
  sideLabel.innerHTML = `${conf.nl_organisationName} - ${
    l10n_labelText[conf.specStatus.toLowerCase()]
  }`;

  sideLabel.setAttribute("class", "sidelabel");
  sideLabel.setAttribute("style", `background-color: ${labelColor};`);
  document.body.appendChild(sideLabel);

  if (document.querySelector(".sidelabel")) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }
}
