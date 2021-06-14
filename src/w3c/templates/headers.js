// @ts-check
import { getIntlData, humanDate, showWarning } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";
import showLink from "../../core/templates/show-link.js";
import showLogo from "../../core/templates/show-logo.js";
import showPeople from "../../core/templates/show-people.js";

const name = "w3c/templates/headers";

const ccLicense = "https://creativecommons.org/licenses/by/4.0/legalcode";
const w3cLicense = "https://www.w3.org/Consortium/Legal/copyright-documents";
const legalDisclaimer =
  "https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer";
const w3cTrademark =
  "https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks";

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
    edited_in_place: "edited in place",
    this_version: "This version:",
    test_suite: "Test suite:",
    implementation_report: "Implementation report:",
    prev_editor_draft: "Previous editor's draft:",
    prev_version: "Previous version:",
    prev_recommendation: "Previous Recommendation:",
    latest_recommendation: "Latest Recommendation:",
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
    author: "作者：",
    authors: "作者：",
    editor: "编辑：",
    editors: "编辑：",
    former_editor: "原编辑：",
    former_editors: "原编辑：",
    latest_editors_draft: "最新编辑草稿：",
    latest_published_version: "最新发布版本：",
    this_version: "本版本：",
    test_suite: "测试套件：",
    implementation_report: "实现报告：",
    prev_editor_draft: "上一版编辑草稿：",
    prev_version: "上一版：",
    prev_recommendation: "上一版正式推荐标准：",
    latest_recommendation: "最新发布的正式推荐标准：",
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
    test_suite: "テストスイート：",
    implementation_report: "実装レポート：",
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
  de: {
    author: "Autor/in:",
    authors: "Autor/innen:",
    editor: "Redaktion:",
    editors: "Redaktion:",
    former_editor: "Frühere Mitwirkende:",
    former_editors: "Frühere Mitwirkende:",
    latest_editors_draft: "Letzter Entwurf:",
    latest_published_version: "Letzte publizierte Fassung:",
    this_version: "Diese Fassung:",
  },
};

export const l10n = getIntlData(localizationStrings);

function getSpecSubTitleElem(conf) {
  let specSubTitleElem = document.querySelector("h2#subtitle");

  if (specSubTitleElem && specSubTitleElem.parentElement) {
    specSubTitleElem.remove();
    conf.subtitle = specSubTitleElem.textContent.trim();
  } else if (conf.subtitle) {
    specSubTitleElem = document.createElement("h2");
    specSubTitleElem.textContent = conf.subtitle;
    specSubTitleElem.id = "subtitle";
  }
  if (specSubTitleElem) {
    specSubTitleElem.classList.add("subtitle");
  }
  return specSubTitleElem;
}

export default (conf, options) => {
  return html`<div class="head">
    ${conf.logos.map(showLogo)} ${document.querySelector("h1#title")}
    ${getSpecSubTitleElem(conf)}
    <h2>
      ${conf.prependW3C ? "W3C " : ""}${conf.isCR
        ? `${conf.longStatus}`
        : `${conf.textStatus}`}
      <time class="dt-published" datetime="${conf.dashDate}"
        >${conf.publishHumanDate}</time
      >${conf.modificationDate
        ? html`, ${l10n.edited_in_place}${" "}
          ${inPlaceModificationDate(conf.modificationDate)}`
        : ""}
    </h2>
    <dl>
      ${conf.isTagFinding || !conf.isNoTrack
        ? html`
            <dt>${l10n.this_version}</dt>
            <dd>
              <a class="u-url" href="${conf.thisVersion}"
                >${conf.thisVersion}</a
              >
            </dd>
            <dt>${l10n.latest_published_version}</dt>
            <dd>
              ${conf.latestVersion
                ? html`<a href="${conf.latestVersion}"
                    >${conf.latestVersion}</a
                  >`
                : "none"}
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
            <dt>${l10n.test_suite}</dt>
            <dd><a href="${conf.testSuiteURI}">${conf.testSuiteURI}</a></dd>
          `
        : ""}
      ${conf.implementationReportURI
        ? html`
            <dt>${l10n.implementation_report}</dt>
            <dd>
              <a href="${conf.implementationReportURI}"
                >${conf.implementationReportURI}</a
              >
            </dd>
          `
        : ""}
      ${conf.isED && conf.prevED
        ? html`
            <dt>${l10n.prev_editor_draft}</dt>
            <dd><a href="${conf.prevED}">${conf.prevED}</a></dd>
          `
        : ""}
      ${conf.showPreviousVersion
        ? html`
            <dt>${l10n.prev_version}</dt>
            <dd><a href="${conf.prevVersion}">${conf.prevVersion}</a></dd>
          `
        : ""}
      ${!conf.prevRecURI
        ? ""
        : conf.isRec
        ? html`
            <dt>${l10n.prev_recommendation}</dt>
            <dd><a href="${conf.prevRecURI}">${conf.prevRecURI}</a></dd>
          `
        : html`
            <dt>${l10n.latest_recommendation}</dt>
            <dd><a href="${conf.prevRecURI}">${conf.prevRecURI}</a></dd>
          `}
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
    ${conf.errata
      ? html`<p>
          Please check the
          <a href="${conf.errata}"><strong>errata</strong></a> for any errors or
          issues reported since publication.
        </p>`
      : ""}
    ${conf.isRec
      ? html`<p>
          See also
          <a
            href="${`https://www.w3.org/Translations/?technology=${conf.shortName}`}"
          >
            <strong>translations</strong></a
          >.
        </p>`
      : ""}
    ${conf.alternateFormats
      ? html`<p>
          ${options.multipleAlternates
            ? "This document is also available in these non-normative formats:"
            : "This document is also available in this non-normative format:"}
          ${options.alternatesHTML}
        </p>`
      : ""}
    ${renderCopyright(conf)}
    <hr title="Separator for header" />
  </div>`;
};

/**
 * @param {string} date document in-place edit date as YYYY-MM-DD
 * @returns {HTMLTimeElement}
 */
function inPlaceModificationDate(date) {
  const modificationHumanDate = humanDate(new Date(date));
  return html`<time class="dt-modified" datetime="${date}"
    >${modificationHumanDate}</time
  >`;
}

/**
 * @param {string} text
 * @param {string} url
 * @param {string=} cssClass
 */
function linkLicense(text, url, cssClass) {
  return html`<a rel="license" href="${url}" class="${cssClass}">${text}</a>`;
}

function renderCopyright(conf) {
  // If there is already a copyright, let's relocate it.
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) {
    existingCopyright.remove();
    return existingCopyright;
  }
  if (conf.hasOwnProperty("overrideCopyright")) {
    const msg = "The `overrideCopyright` configuration option is deprecated.";
    const hint =
      'Please add a `<p class="copyright">` element directly to your document instead';
    showWarning(msg, name, { hint });
    return html`${[conf.overrideCopyright]}`;
  }
  if (conf.isUnofficial && conf.licenseInfo) {
    return html`<p class="copyright">
      This document is licensed under a
      ${linkLicense(conf.licenseInfo.name, conf.licenseInfo.url, "subfoot")}
      (${conf.licenseInfo.short}).
    </p>`;
  }
  return renderOfficialCopyright(conf);
}

function renderOfficialCopyright(conf) {
  return html`<p class="copyright">
    <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Copyright"
      >Copyright</a
    >
    &copy;
    ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
    ${conf.additionalCopyrightHolders
      ? html` ${[conf.additionalCopyrightHolders]} &amp; `
      : ""}
    <a href="https://www.w3.org/"
      ><abbr title="World Wide Web Consortium">W3C</abbr></a
    ><sup>&reg;</sup> (<a href="https://www.csail.mit.edu/"
      ><abbr title="Massachusetts Institute of Technology">MIT</abbr></a
    >,
    <a href="https://www.ercim.eu/"
      ><abbr
        title="European Research Consortium for Informatics and Mathematics"
        >ERCIM</abbr
      ></a
    >, <a href="https://www.keio.ac.jp/">Keio</a>,
    <a href="https://ev.buaa.edu.cn/">Beihang</a>). ${noteIfDualLicense(conf)}
    W3C <a href="${legalDisclaimer}">liability</a>,
    <a href="${w3cTrademark}">trademark</a> and ${linkDocumentUse(conf)} rules
    apply.
  </p>`;
}

function noteIfDualLicense(conf) {
  if (!conf.isCCBY) {
    return;
  }
  return html`
    Some Rights Reserved: this document is dual-licensed,
    ${linkLicense("CC-BY", ccLicense)} and
    ${linkLicense("W3C Document License", w3cLicense)}.
  `;
}

function linkDocumentUse(conf) {
  if (conf.isCCBY) {
    return linkLicense(
      "document use",
      "https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html"
    );
  }
  if (conf.isW3CSoftAndDocLicense) {
    return linkLicense(
      "permissive document license",
      "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document"
    );
  }
  return linkLicense("document use", w3cLicense);
}
