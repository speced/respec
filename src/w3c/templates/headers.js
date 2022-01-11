// @ts-check
import { getIntlData, humanDate } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";
import showLink from "../../core/templates/show-link.js";
import showLogo from "../../core/templates/show-logo.js";
import showPeople from "../../core/templates/show-people.js";
import { sub } from "../../core/pubsubhub.js";

const localizationStrings = {
  en: {
    archives: "archives",
    author: "Author:",
    authors: "Authors:",
    commit_history: "Commit history",
    edited_in_place: "edited in place",
    editor: "Editor:",
    editors: "Editors:",
    feedback: "Feedback:",
    former_editor: "Former editor:",
    former_editors: "Former editors:",
    history: "History:",
    implementation_report: "Implementation report:",
    latest_editors_draft: "Latest editor's draft:",
    latest_published_version: "Latest published version:",
    latest_recommendation: "Latest Recommendation:",
    message_topic: "… message topic …",
    more_details_about_this_doc: "More details about this document",
    multiple_alternates(plural) {
      return `This document is also available in ${
        plural ? "these non-normative formats" : "this non-normative format"
      }:`;
    },
    prev_editor_draft: "Previous editor's draft:",
    prev_recommendation: "Previous Recommendation:",
    prev_version: "Previous version:",
    publication_history: "Publication history",
    test_suite: "Test suite:",
    this_version: "This version:",
    with_subject_line: "with subject line",
    your_topic_here: "YOUR TOPIC HERE",
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
    commit_history: "Git提交历史",
    editor: "编辑：",
    editors: "编辑：",
    feedback: "反馈：",
    former_editor: "原编辑：",
    former_editors: "原编辑：",
    history: "历史：",
    implementation_report: "实现报告：",
    latest_editors_draft: "最新编辑草稿：",
    latest_published_version: "最新发布版本：",
    latest_recommendation: "最新发布的正式推荐标准：",
    message_topic: "… 邮件主题 …",
    prev_editor_draft: "上一版编辑草稿：",
    prev_recommendation: "上一版正式推荐标准：",
    prev_version: "上一版：",
    test_suite: "测试套件：",
    this_version: "本版本：",
  },
  ja: {
    archives: "アーカイブ",
    author: "著者：",
    authors: "著者：",
    commit_history: "更新履歴",
    edited_in_place: "改版なく更新",
    editor: "編者：",
    editors: "編者：",
    feedback: "フィードバック:",
    former_editor: "以前の版の編者：",
    former_editors: "以前の版の編者：",
    history: "履歴:",
    implementation_report: "実装レポート：",
    latest_editors_draft: "最新の編集用草案：",
    latest_published_version: "最新バージョン：",
    latest_recommendation: "最新の勧告版:",
    message_topic: "… メール件名 …",
    more_details_about_this_doc: "この文書についてのより詳細",
    prev_editor_draft: "前回の編集用草案:",
    prev_recommendation: "前回の勧告版:",
    prev_version: "前回のバージョン:",
    publication_history: "公表履歴",
    test_suite: "テストスイート：",
    this_version: "このバージョン：",
    with_subject_line: "次の件名で",
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
    archives: "archivos",
    author: "Autor:",
    authors: "Autores:",
    commit_history: "Historial de cambios",
    edited_in_place: "editado en lugar",
    editor: "Editor:",
    editors: "Editores:",
    feedback: "Comentarios:",
    former_editor: "Antiguo editor:",
    former_editors: "Antiguos editores:",
    history: "Historia:",
    implementation_report: "Informe de implementación:",
    latest_editors_draft: "Última versión del editor:",
    latest_published_version: "Última versión publicada:",
    latest_recommendation: "Recomendación más reciente:",
    message_topic: "… detalles de mensaje …",
    more_details_about_this_doc: "Más detalles sobre este documento:",
    publication_history: "Historial de publicación",
    prev_editor_draft: "Última versión del editor:",
    prev_recommendation: "Última Recomendación:",
    prev_version: "Última versión:",
    test_suite: "Suite de pruebas:",
    this_version: "Esta versión:",
    with_subject_line: "con línea de asunto",
    your_topic_here: "TU SUJETO AQUÍ",
  },
  de: {
    archives: "Archiv",
    author: "Autor/in:",
    authors: "Autor/innen:",
    commit_history: "Commit-Historie",
    edited_in_place: "zuletzt geändert am",
    editor: "Redaktion:",
    editors: "Redaktion:",
    feedback: "Feedback:",
    former_editor: "Frühere Mitwirkende:",
    former_editors: "Frühere Mitwirkende:",
    history: "Verlauf:",
    implementation_report: "Umsetzungsbericht:",
    latest_editors_draft: "Letzter Entwurf:",
    latest_published_version: "Letzte publizierte Fassung:",
    latest_recommendation: "Aktuellste Empfehlung:",
    more_details_about_this_doc: "Mehr Informationen über dieses Dokument",
    prev_editor_draft: "Vorheriger Entwurf:",
    prev_recommendation: "Vorherige Empfehlung:",
    prev_version: "Vorherige Version:",
    publication_history: "Veröffentlichungsverlauf",
    test_suite: "Testumgebung:",
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
  /**
   * After export, we let fixup.js handle the <details>.
   */
  sub("beforesave", doc => {
    const details = doc.querySelector(".head details");
    details.open = true;
  });

  return html`<div class="head">
    ${conf.logos.map(showLogo)} ${document.querySelector("h1#title")}
    ${getSpecSubTitleElem(conf)}
    <p id="w3c-state">${renderSpecTitle(conf)}</p>
    <details open="${localStorage.getItem("tr-metadata") || "true"}">
      <summary>${l10n.more_details_about_this_doc}</summary>
      <dl>
        ${(conf.isTagFinding && !conf.isTagEditorFinding) || !conf.isNoTrack
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
        ${renderHistory(conf)}
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
        ${renderFeedback(conf)}
        ${conf.errata
          ? html`<dt>Errata:</dt>
              <dd><a href="${conf.errata}">Errata exists</a>.</dd>`
          : ""}
        ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
      </dl>
    </details>
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
          ${l10n.multiple_alternates(options.multipleAlternates)}
          ${options.alternatesHTML}
        </p>`
      : ""}
    ${renderCopyright(conf)}
    <hr title="Separator for header" />
  </div>`;
};

function renderFeedback(conf) {
  if (!conf.github && !conf.wgPublicList) return;
  const definitions = [];

  // Github feedback...
  if (conf.github) {
    const { repoURL, issuesURL, newIssuesURL, pullsURL, fullName } =
      conf.github;
    definitions.push(
      html`<dd>
        <a href="${repoURL}">GitHub ${fullName}</a>
        (<a href="${pullsURL}">pull requests</a>,
        <a href="${newIssuesURL}">new issue</a>,
        <a href="${issuesURL}">open issues</a>)
      </dd>`
    );
  }

  // The <a href="mailto:list?subject"> link for the public list
  if (conf.wgPublicList) {
    const mailToURL = new URL(`mailto:${conf.wgPublicList}@w3.org`);
    const subject =
      conf.subjectPrefix ?? `[${conf.shortName}] ${l10n.your_topic_here}`;
    const mailingListLink = html`<a
      href="${mailToURL.href}?subject=${encodeURIComponent(subject)}"
      >${mailToURL.pathname}</a
    >`;

    // The subject line...
    const subjectLine =
      conf.subjectPrefix ||
      html`[${conf.shortName}] <em>${l10n.message_topic}</em>`;
    const emailSubject = html`${l10n.with_subject_line}${" "}
      <kbd>${subjectLine}</kbd>`;

    // Archives link
    const archiveURL = new URL(
      conf.wgPublicList,
      "https://lists.w3.org/Archives/Public/"
    );
    const archiveLink = html`(<a href="${archiveURL}" rel="discussion"
        >${l10n.archives}</a
      >)`;

    definitions.push(
      html`<dd>${mailingListLink} ${emailSubject} ${archiveLink}</dd>`
    );
  }
  return html`<dt>${l10n.feedback}</dt>
    ${definitions}`;
}

function renderHistory(conf) {
  if (!conf.historyURI && !conf.github) return;
  const ddElements = [];
  if (conf.historyURI) {
    const dd = html`<dd>
      <a href="${conf.historyURI}">${conf.historyURI}</a>
    </dd>`;
    ddElements.push(dd);
  }
  if (conf.github) {
    const dd = html`
      <dd>
        <a href="${conf.github.commitHistoryURL}">${l10n.commit_history}</a>
      </dd>
    `;
    ddElements.push(dd);
  }

  return html`<dt>${l10n.history}</dt>
    ${ddElements}`;
}

function renderSpecTitle(conf) {
  const specType = conf.isCR || conf.isCRY ? conf.longStatus : conf.textStatus;
  const preamble = conf.prependW3C
    ? html`<a href="https://www.w3.org/standards/types#${conf.specStatus}"
        >W3C ${specType}</a
      >`
    : html`${specType}`;

  return html`${preamble}${" "}
    <time class="dt-published" datetime="${conf.dashDate}"
      >${conf.publishHumanDate}</time
    >${conf.modificationDate
      ? html`, ${l10n.edited_in_place}${" "}
        ${inPlaceModificationDate(conf.modificationDate)}`
      : ""}`;
}

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
 * @param { LicenseInfo } licenseInfo license information
 */
function linkLicense(licenseInfo) {
  const { url, short, name } = licenseInfo;
  if (name === "unlicensed") {
    return html`. <span class="issue">THIS DOCUMENT IS UNLICENSED</span>.`;
  }
  return html` and
    <a rel="license" href="${url}" title="${name}">${short}</a> rules apply.`;
}

function renderCopyright(conf) {
  // If there is already a copyright, let's relocate it.
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) {
    existingCopyright.remove();
    return existingCopyright;
  }
  if (conf.isUnofficial && conf.licenseInfo) {
    return html`<p class="copyright">
      Copyright &copy;
      ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
      the document editors/authors.
      ${conf.licenseInfo.name !== "unlicensed"
        ? html`Text is available under the
            <a rel="license" href="${conf.licenseInfo.url}"
              >${conf.licenseInfo.name}</a
            >; additional terms may apply.`
        : ""}
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
    <a href="https://ev.buaa.edu.cn/">Beihang</a>). W3C
    <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer"
      >liability</a
    >,
    <a href="https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks"
      >trademark</a
    >${linkLicense(conf.licenseInfo)}
  </p>`;
}
