// @ts-check
import { getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";

export default conf => {
  const l10n_sotdText = getIntlData(conf.sotdText);
  return html`
    <h2>${l10n_sotdText.sotd}</h2>
    ${renderSotD(conf)}
  `;
};

function renderSotD(conf) {
  const specStatus = conf.specStatus.toLowerCase();
  const sotdText = getIntlData(conf.sotdText)[specStatus];
  return html`<p>${sotdText}</p>`;
}
