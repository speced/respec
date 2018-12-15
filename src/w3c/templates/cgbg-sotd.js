import hyperHTML from "../../deps/hyperhtml";

export default conf => {
  const html = hyperHTML;
  return html`
    <h2>${conf.l10n.sotd}</h2>
    ${
      conf.isPreview
        ? html`
            <details class="annoying-warning" open="">
              <summary
                >This is a
                preview${
                  conf.prUrl && conf.prNumber
                    ? html`
                        of pull request
                        <a href="${conf.prUrl}">#${conf.prNumber}</a>
                      `
                    : ""
                }</summary
              >
              <p>
                Do not attempt to implement this version of the specification.
                Do not reference this version as authoritative in any way.
                ${
                  conf.edDraftURI
                    ? html`
                        Instead, see
                        <a href="${conf.edDraftURI}">${conf.edDraftURI}</a> for
                        the Editor's draft.
                      `
                    : ""
                }
              </p>
            </details>
          `
        : ""
    }
    <p>
      This specification was published by the
      <a href="${conf.wgURI}">${conf.wg}</a>. It is not a W3C Standard nor is it
      on the W3C Standards Track.
      ${
        conf.isCGFinal
          ? html`
              Please note that under the
              <a href="https://www.w3.org/community/about/agreements/final/"
                >W3C Community Final Specification Agreement (FSA)</a
              >
              other conditions apply.
            `
          : html`
              Please note that under the
              <a href="https://www.w3.org/community/about/agreements/cla/"
                >W3C Community Contributor License Agreement (CLA)</a
              >
              there is a limited opt-out and other conditions apply.
            `
      }
      Learn more about
      <a href="https://www.w3.org/community/"
        >W3C Community and Business Groups</a
      >.
    </p>
    ${!conf.sotdAfterWGinfo ? [conf.additionalContent] : ""}
    ${
      conf.wgPublicList
        ? html`
            <p>
              If you wish to make comments regarding this document, please send
              them to
              <a
                href="${
                  `mailto:${conf.wgPublicList}@w3.org${
                    conf.subjectPrefix
                      ? `?subject=${conf.subjectPrefixEnc}`
                      : ""
                  }`
                }"
                >${conf.wgPublicList}@w3.org</a
              >
              (<a
                href="${
                  `mailto:${conf.wgPublicList}-request@w3.org?subject=subscribe`
                }"
                >subscribe</a
              >,
              <a
                href="${
                  `https://lists.w3.org/Archives/Public/${conf.wgPublicList}/`
                }"
                >archives</a
              >)${
                conf.subjectPrefix
                  ? html`
                      with <code>${conf.subjectPrefix}</code> at the start of
                      your email's subject
                    `
                  : ""
              }.
            </p>
          `
        : ""
    }
    ${conf.sotdAfterWGinfo ? [conf.additionalContent] : ""}
    ${[conf.additionalSections]}
  `;
};
