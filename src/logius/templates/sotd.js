// @ts-check
import { getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";

export default (conf, opts) => {
  const l10n = getIntlData(conf.sotdText);
  return html`
    <h2>${l10n.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""}
    ${conf.isDEF
      ? l10n.def
      : conf.isVV
      ? l10n.vv
      : conf.isCV
      ? html`${l10n.cv}<a href="${opts.emailCommentsMailto}"
            >${opts.emailComments}</a
          >.`
      : conf.isWV
      ? l10n.wv
      : conf.isBASIS
      ? l10n.basis
      : ""}
    ${renderGovernance(conf)}
  `;
};

export function renderPreview(conf) {
  const { prUrl, prNumber, edDraftURI } = conf;
  return html`<details class="annoying-warning" open="">
    <summary>
      This is a
      preview${prUrl && prNumber
        ? html`
            of pull request
            <a href="${prUrl}">#${prNumber}</a>
          `
        : ""}
    </summary>
    <p>
      Do not attempt to implement this version of the specification. Do not
      reference this version as authoritative in any way.
      ${edDraftURI
        ? html`
            Instead, see
            <a href="${edDraftURI}">${edDraftURI}</a> for the Editor's draft.
          `
        : ""}
    </p>
  </details>`;
}

function renderGovernance(conf) {
  let govText = "";
  const govTextCode = conf.govTextCode.toLowerCase();
  govText = conf.governanceTypeText[govTextCode];
  return html`<p>${govText}</p>`;
}
