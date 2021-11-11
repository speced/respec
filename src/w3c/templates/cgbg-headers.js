// @ts-check
import { html } from "../../core/import-maps.js";
import { l10n } from "./headers.js";
import showLink from "../../core/templates/show-link.js";
import showLogo from "../../core/templates/show-logo.js";
import showPeople from "../../core/templates/show-people.js";

export default (conf, options) => {
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) {
    existingCopyright.remove();
  }

  const specTitleElem = document.querySelector("h1#title");
  const specTitleElemClone = specTitleElem.cloneNode(true);

  return html`<div class="head">
    ${conf.logos.map(showLogo)} ${specTitleElem}
    ${conf.subtitle ? html`<h2 id="subtitle">${conf.subtitle}</h2>` : ""}
    <h2>
      ${conf.longStatus}
      <time class="dt-published" datetime="${conf.dashDate}"
        >${conf.publishHumanDate}</time
      >
    </h2>
    <dl>
      ${conf.thisVersion
        ? html`
            <dt>${l10n.this_version}</dt>
            <dd>
              <a class="u-url" href="${conf.thisVersion}"
                >${conf.thisVersion}</a
              >
            </dd>
          `
        : ""}
      ${conf.latestVersion
        ? html`
            <dt>${l10n.latest_published_version}</dt>
            <dd>
              <a href="${conf.latestVersion}">${conf.latestVersion}</a>
            </dd>
          `
        : ""}
      ${conf.edDraftURI
        ? html`
            <dt>${l10n.latest_editors_draft}</dt>
            <dd><a href="${conf.edDraftURI}">${conf.edDraftURI}</a></dd>
          `
        : ""}
      ${conf.testSuiteURI
        ? html`
            <dt>Test suite:</dt>
            <dd><a href="${conf.testSuiteURI}">${conf.testSuiteURI}</a></dd>
          `
        : ""}
      ${conf.implementationReportURI
        ? html`
            <dt>Implementation report:</dt>
            <dd>
              <a href="${conf.implementationReportURI}"
                >${conf.implementationReportURI}</a
              >
            </dd>
          `
        : ""}
      ${conf.prevVersion
        ? html`
            <dt>Previous version:</dt>
            <dd><a href="${conf.prevVersion}">${conf.prevVersion}</a></dd>
          `
        : ""}
      ${!conf.isCGFinal
        ? html`
            ${conf.prevED
              ? html`
                  <dt>Previous editor's draft:</dt>
                  <dd><a href="${conf.prevED}">${conf.prevED}</a></dd>
                `
              : ""}
          `
        : ""}
      <dt>${conf.multipleEditors ? l10n.editors : l10n.editor}</dt>
      ${showPeople(conf, "editors")}
      ${Array.isArray(conf.formerEditors) && conf.formerEditors.length > 0
        ? html`
            <dt>
              ${conf.multipleFormerEditors
                ? l10n.former_editors
                : l10n.former_editor}
            </dt>
            ${showPeople(conf, "formerEditors")}
          `
        : ""}
      ${conf.authors
        ? html`
            <dt>${conf.multipleAuthors ? l10n.authors : l10n.author}</dt>
            ${showPeople(conf, "authors")}
          `
        : ""}
      ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
    </dl>
    ${conf.alternateFormats
      ? html`<p>
          ${options.multipleAlternates
            ? "This document is also available in these non-normative formats:"
            : "This document is also available in this non-normative format:"}
          ${options.alternatesHTML}
        </p>`
      : ""}
    ${existingCopyright
      ? existingCopyright
      : html`<p class="copyright">
          <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Copyright"
            >Copyright</a
          >
          &copy;
          ${conf.copyrightStart
            ? `${conf.copyrightStart}-`
            : ""}${conf.publishYear}
          ${conf.additionalCopyrightHolders
            ? html` ${[conf.additionalCopyrightHolders]} &amp; `
            : ""}
          the Contributors to the ${specTitleElemClone.childNodes}
          Specification, published by the
          <a href="${conf.wgURI}">${conf.wg}</a> under the
          ${conf.isCGFinal
            ? html`
                <a href="https://www.w3.org/community/about/agreements/fsa/"
                  >W3C Community Final Specification Agreement (FSA)</a
                >. A human-readable
                <a
                  href="https://www.w3.org/community/about/agreements/fsa-deed/"
                  >summary</a
                >
                is available.
              `
            : html`
                <a href="https://www.w3.org/community/about/agreements/cla/"
                  >W3C Community Contributor License Agreement (CLA)</a
                >. A human-readable
                <a
                  href="https://www.w3.org/community/about/agreements/cla-deed/"
                  >summary</a
                >
                is available.
              `}
        </p>`}
    <hr title="Separator for header" />
  </div>`;
};
