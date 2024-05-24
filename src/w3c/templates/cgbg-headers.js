// @ts-check
import { getSpecSubTitleElem, l10n, renderFeedback } from "./headers.js";
import { W3CDate } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";
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
    ${conf.logos.length
      ? html`<p class="logos">${conf.logos.map(showLogo)}</p>`
      : ""}
    ${specTitleElem} ${getSpecSubTitleElem(conf)}
    <p id="w3c-state">
      <a href="https://www.w3.org/standards/types#reports"
        >${conf.longStatus}</a
      >
      <time class="dt-published" datetime="${conf.dashDate}"
        >${W3CDate.format(conf.publishDate)}</time
      >
    </p>
    <dl>
      ${conf.thisVersion
        ? html`<dt>${l10n.this_version}</dt>
            <dd>
              <a class="u-url" href="${conf.thisVersion}"
                >${conf.thisVersion}</a
              >
            </dd>`
        : ""}
      ${"latestVersion" in conf // latestVersion can be falsy
        ? html`<dt>${l10n.latest_published_version}</dt>
            <dd>
              ${conf.latestVersion
                ? html`<a href="${conf.latestVersion}"
                    >${conf.latestVersion}</a
                  >`
                : "none"}
            </dd>`
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
      ${conf.editors.length
        ? html`
            <dt>${conf.editors.length > 1 ? l10n.editors : l10n.editor}</dt>
            ${showPeople(conf, "editors")}
          `
        : ""}
      ${conf.formerEditors.length
        ? html`
            <dt>
              ${conf.formerEditors.length > 1
                ? l10n.former_editors
                : l10n.former_editor}
            </dt>
            ${showPeople(conf, "formerEditors")}
          `
        : ""}
      ${conf.authors.length
        ? html`
            <dt>${conf.authors.length > 1 ? l10n.authors : l10n.author}</dt>
            ${showPeople(conf, "authors")}
          `
        : ""}
      ${conf.github || conf.wgPublicList
        ? html`<dt>${l10n.feedback}</dt>
            ${renderFeedback(conf)}`
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
          <a href="https://www.w3.org/policies/#copyright">Copyright</a>
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
