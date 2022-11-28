// @ts-check
import { getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";

export default (conf, opts) => {
  const l10n_sotdText = getIntlData(conf.sotdText);
  return html`
    <h2>${l10n_sotdText.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""}
    ${conf.isDEF
      ? l10n_sotdText.def
      : conf.isVV
      ? l10n_sotdText.vv
      : conf.isCV
      ? html`${l10n_sotdText.cv}<a href="${opts.emailCommentsMailto}"
            >${opts.emailComments}</a
          >.`
      : conf.isWV
      ? l10n_sotdText.wv
      : conf.isBASIS
      ? l10n_sotdText.basis
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
  const govTextCode = conf.govTextCode.toLowerCase();
  const govText = getIntlData(conf.governanceTypeText)[govTextCode];
  return html`<p>${govText}</p>`;
}
