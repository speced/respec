import { getIntlData, showWarning } from "../core/utils.js";
import css from "../styles/side-label.css.js";

export async function run(conf) {
  await createSideLabel(conf);
}

async function createSideLabel(conf) {
  const l10n_labelText = getIntlData(conf.labelText);
  const sideLabel = document.createElement("div");

  if (!conf.nl_organisationName) {
    showWarning("Missing nl_organisationName", "createSideLabel");
  }
  if (!conf.labelText) {
    showWarning("Missing labelText", "createSideLabel");
  }
  if (!l10n_labelText) {
    showWarning("Missing translated labelText", "createSideLabel");
  }
  if (!conf.specStatus) {
    showWarning("Missing specStatus", "createSideLabel");
  }
  if (!conf.labelColorTable) {
    showWarning("Missing labelColor", "createSideLabel");
  }

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
