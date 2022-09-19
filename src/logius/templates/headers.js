// @ts-check
import { getIntlData, showWarning } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";
import showLink from "../../core/templates/show-link.js";
import showLogo from "./show-logo.js";
import showPeople from "../../core/templates/show-people.js";

const name = "logius/templates/headers";

const legalDisclaimer =
  "https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer";
const w3cTrademark =
  "https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks";

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
  const l10n = getIntlData(conf.headerLocalizationStrings);

  return html`<div class="head">
    ${conf.logos.map(showLogo)} ${document.querySelector("h1#title")}
    ${getSpecSubTitleElem(conf)}
    <h2>
      ${conf.nl_organisationName
        ? `${conf.nl_organisationName} `
        : "Geonovum "}${conf.isRegular ? html` ${conf.typeStatus}<br /> ` : ""}
      ${conf.textStatus}
      <time class="dt-published" datetime="${conf.dashDate}"
        >${conf.publishHumanDate}</time
      >${conf.modificationDate
        ? html`, ${l10n.edited_in_place}${" "}
          ${inPlaceModificationDate(conf.modificationDate)}`
        : ""}
    </h2>
    <dl>
      ${!conf.isNoTrack
        ? html`
            <dt>${l10n.this_version}</dt>
            <dd class="status">
              <a class="u-url status" href="${conf.thisVersion}"
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
      ? // html`<p>
        //     Please check the
        //     <a href="${conf.errata}"><strong>errata</strong></a> for any errors or
        //     issues reported since publication.
        //   </p>`
        // : ""}
        html`
          <p lang="nl">
            Er zijn errata aanwezig. Zie de
            <a href="${conf.errata}"><strong>errata</strong></a> voor fouten en
            problemen die gerapporteerd zijn na publicatie.
          </p>
        `
      : ""}
    ${conf.isRec
      ? html`<p>
          See also
          <a
            href="${`https://www.w3.org/2003/03/Translations/byTechnology?technology=${conf.shortName}`}"
          >
            <strong>translations</strong></a
          >.
        </p>`
      : ""}
    ${conf.alternateFormats
      ? html`<p lang="en">
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
  }
  return conf.isUnofficial
    ? conf.additionalCopyrightHolders
      ? html`<p class="copyright">${[conf.additionalCopyrightHolders]}</p>`
      : conf.overrideCopyright
      ? [conf.overrideCopyright]
      : html`<p class="copyright" lang="en">
          This document is licensed under a
          ${linkLicense(
            conf.licenses[conf.license.toLowerCase()].name,
            conf.licenses[conf.license.toLowerCase()].url,
            "subfoot"
          )}.
        </p>`
    : conf.overrideCopyright
    ? [conf.overrideCopyright]
    : renderOfficialCopyright(conf);
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
    <a href="https://ev.buaa.edu.cn/">Beihang</a>). W3C W3C
    <a href="${legalDisclaimer}">liability</a>,
    <a href="${w3cTrademark}">trademark</a> and ${linkDocumentUse(conf)} rules
    apply.
  </p>`;
}

function linkDocumentUse(conf) {
  if (conf.isCCBY) {
    return linkLicense(
      "document use",
      "https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html"
    );
  }
}
