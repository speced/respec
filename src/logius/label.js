import css from "../styles/label.css.js";
import { getIntlData } from "../core/utils.js";

export const name = "logius/label";

export async function run(conf) {
  await createLabel(conf);
}

async function createLabel(conf) {
  if (!conf.useLabel) {
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
