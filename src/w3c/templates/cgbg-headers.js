// @ts-check
import { getIntlData } from "../../core/l10n.js";
import { hyperHTML as html } from "../../core/import-maps.js";
import showLink from "./show-link.js";
import showLogo from "./show-logo.js";
import showPeople from "./show-people.js";

const localizationStrings = {
  en: {
    author: "Author:",
    authors: "Authors:",
    editor: "Editor:",
    editors: "Editors:",
    former_editor: "Former editor:",
    former_editors: "Former editors:",
    latest_editors_draft: "Latest editor's draft:",
    latest_published_version: "Latest published version:",
    this_version: "This version:",
  },
  ko: {
    author: "저자:",
    authors: "저자:",
    editor: "편집자:",
    editors: "편집자:",
    former_editor: "이전 편집자:",
    former_editors: "이전 편집자:",
    latest_editors_draft: "최신 편집 초안:",
    latest_published_version: "최신 버전:",
    this_version: "현재 버전:",
  },
  zh: {
    editor: "编辑：",
    editors: "编辑：",
    former_editor: "原编辑：",
    former_editors: "原编辑：",
    latest_editors_draft: "最新编辑草稿：",
    latest_published_version: "最新发布版本：",
    this_version: "本版本：",
  },
  ja: {
    author: "著者：",
    authors: "著者：",
    editor: "編者：",
    editors: "編者：",
    former_editor: "以前の版の編者：",
    former_editors: "以前の版の編者：",
    latest_editors_draft: "最新の編集用草案：",
    latest_published_version: "最新バージョン：",
    this_version: "このバージョン：",
  },
  nl: {
    author: "Auteur:",
    authors: "Auteurs:",
    editor: "Redacteur:",
    editors: "Redacteurs:",
    latest_editors_draft: "Laatste werkversie:",
    latest_published_version: "Laatst gepubliceerde versie:",
    this_version: "Deze versie:",
  },
  es: {
    author: "Autor:",
    authors: "Autores:",
    editor: "Editor:",
    editors: "Editores:",
    latest_editors_draft: "Borrador de editor mas reciente:",
    latest_published_version: "Versión publicada mas reciente:",
    this_version: "Ésta versión:",
  },
};

export default conf => {
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) {
    existingCopyright.remove();
  }
  return html`
    <div class="head">
      ${conf.logos.map(showLogo)}
      <h1 class="title p-name" id="title">${conf.title}</h1>
      ${conf.subtitle
        ? html`
            <h2 id="subtitle">${conf.subtitle}</h2>
          `
        : ""}
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
        ${showPeople(conf.editors)}
        ${Array.isArray(conf.formerEditors) && conf.formerEditors.length > 0
          ? html`
              <dt>
                ${conf.multipleFormerEditors
                  ? l10n.former_editors
                  : l10n.former_editor}
              </dt>
              ${showPeople(conf.formerEditors)}
            `
          : ""}
        ${conf.authors
          ? html`
              <dt>
                ${conf.multipleAuthors ? l10n.authors : l10n.author}
              </dt>
              ${showPeople(conf.authors)}
            `
          : ""}
        ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
      </dl>
      ${conf.alternateFormats
        ? html`
            <p>
              ${conf.multipleAlternates
                ? "This document is also available in these non-normative formats:"
                : "This document is also available in this non-normative format:"}
              ${[conf.alternatesHTML]}
            </p>
          `
        : ""}
      ${existingCopyright
        ? existingCopyright
        : html`
            <p class="copyright">
              <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Copyright"
                >Copyright</a
              >
              &copy;
              ${conf.copyrightStart
                ? `${conf.copyrightStart}-`
                : ""}${conf.publishYear}
              ${conf.additionalCopyrightHolders
                ? html`
                    ${[conf.additionalCopyrightHolders]} &amp;
                  `
                : ""}
              the Contributors to the ${conf.title} Specification, published by
              the
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
            </p>
          `}
      <hr title="Separator for header" />
    </div>
  `;
};
