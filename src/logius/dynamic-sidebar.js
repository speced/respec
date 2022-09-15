import { RespecError, getIntlData } from "../core/utils.js";
import css from "../styles/side-label.css.js";
import { pub } from "../core/pubsubhub.js";

export async function run(conf) {
  await createSideLabel(conf);
}

async function createSideLabel(conf) {
  const l10n_labelText = getIntlData(conf.labelText);
  const sideLabel = document.createElement("div");

  if (!conf.nl_organisationName) {
    pub(
      "warn",
      new RespecError("Missing nl_organisationName", "createSideLabel", "")
    );
  }
  if (!conf.labelText) {
    pub("warn", new RespecError("Missing labelText", "createSideLabel", ""));
  }
  if (!l10n_labelText) {
    pub(
      "warn",
      new RespecError("Missing labelText translation", "createSideLabel", "")
    );
  }
  if (!conf.specStatus) {
    pub("warn", new RespecError("Missing specStatus", "createSideLabel", ""));
  }
  if (!conf.labelColorTable) {
    pub("warn", new RespecError("Missing labelColor", "createSideLabel", ""));
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
