import "deps/hyperhtml";
import showLogo from "./show-logo";
import showPeople from "./show-people";
import showLink from "./show-link";

export default conf => {
  const html = hyperHTML;
  return html`<div class='head'>
  ${conf.logos.map(showLogo)}
  <h1 class='title p-name' id='title' property='${conf.doRDFa ? "dcterms:title" : null}'>${conf.title}</h1>
  ${conf.subtitle ? html`
    <h2 property='${conf.doRDFa ? "bibo:subtitle" : null}' id='subtitle'>${conf.subtitle}</h2>
  ` : ""}
  <h2>${conf.prependW3C ? `W3C ` : ""}${conf.textStatus} <time property='${conf.doRDFa ? "dcterms:issued" : null}' class='dt-published' datetime='${conf.dashDate}'>${conf.publishHumanDate}</time></h2>
  <dl>
    ${!conf.isNoTrack ? html`
      <dt>${conf.l10n.this_version}</dt>
      <dd><a class='u-url' href='${conf.thisVersion}'>${conf.thisVersion}</a></dd>
      <dt>${conf.l10n.latest_published_version}</dt>
      <dd>${conf.latestVersion ? html`<a href='${conf.latestVersion}'>${conf.latestVersion}</a>` : "none"}</dd>
    ` : ""}
    ${conf.edDraftURI ? html`
      <dt>${conf.l10n.latest_editors_draft}</dt>
      <dd><a href='${conf.edDraftURI}'>${conf.edDraftURI}</a></dd>
    ` : ""}
    ${conf.testSuiteURI ? html`
      <dt>Test suite:</dt>
      <dd><a href='${conf.testSuiteURI}'>${conf.testSuiteURI}</a></dd>
    ` : ""}
    ${conf.implementationReportURI ? html`
      <dt>Implementation report:</dt>
      <dd><a href='${conf.implementationReportURI}'>${conf.implementationReportURI}</a></dd>
    ` : ""}
    ${conf.bugTrackerHTML ? html`
      <dt>${conf.l10n.bug_tracker}</dt>
      <dd>${[conf.bugTrackerHTML]}</dd>
    ` : ""}
    ${conf.isED ? html`
      ${conf.prevED ? html`
        <dt>Previous editor's draft:</dt>
        <dd><a href='${conf.prevED}'>${conf.prevED}</a></dd>
      ` : ""}
    ` : ""}
    ${conf.showPreviousVersion ? html`
      <dt>Previous version:</dt>
      <dd><a rel='${conf.doRDFa ? "dcterms:replaces" : null}' href='${conf.prevVersion}'>${conf.prevVersion}</a></dd>
    ` : ""}
    ${conf.prevRecURI ? html`
      ${conf.isRec ? html`
          <dt>Previous Recommendation:</dt>
          <dd><a rel='${conf.doRDFa ? "dcterms:replaces" : null}' href='${conf.prevRecURI}'>${conf.prevRecURI}</a></dd>
      ` : html`
          <dt>Latest Recommendation:</dt>
          <dd><a href='${conf.prevRecURI}'>${conf.prevRecURI}</a></dd>
      `}
    ` : ""}
    <dt>${conf.multipleEditors ? html`${conf.l10n.editors}` : html`${conf.l10n.editor}`}</dt>
    ${showPeople(conf, "Editor", conf.editors)}
    ${conf.authors ? html`
      <dt>${conf.multipleAuthors ? [conf.l10n.authors] : [conf.l10n.author]}</dt>
      ${showPeople(conf, "Author", conf.authors)}
    ` : ""}
    ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
  </dl>
  ${conf.errata ? html`
    <p>
      Please check the <a href="${conf.errata}"><strong>errata</strong></a> for any errors or issues
      reported since publication.
    </p>
  ` : ""}
  ${conf.isRec ? html`
    <p>
      See also <a href="${`http://www.w3.org/2003/03/Translations/byTechnology?technology=${conf.shortName}`}">
      <strong>translations</strong></a>.
    </p>
  ` : ""}
  ${conf.alternateFormats ? html`
    <p>
      ${conf.multipleAlternates ? 
        "This document is also available in these non-normative formats:" :
        "This document is also available in this non-normative format:"}
      ${[conf.alternatesHTML]}
    </p>
  ` : ""}
  ${conf.isUnofficial ? html`
    ${conf.additionalCopyrightHolders ? html`
      <p class='copyright'>${[conf.additionalCopyrightHolders]}</p>
    ` : html`
      ${conf.overrideCopyright ? [conf.overrideCopyright] : html`
        <p class='copyright'>
          This document is licensed under a
          <a class='subfoot' href='https://creativecommons.org/licenses/by/3.0/' rel='license'>Creative Commons
          Attribution 3.0 License</a>.
        </p>
      `}
    `}
  ` : html`
    ${conf.overrideCopyright ? [conf.overrideCopyright] : html`
      <p class='copyright'>
        <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> &copy;
        ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
        ${conf.additionalCopyrightHolders ? html` ${[conf.additionalCopyrightHolders]} &amp;` : ""}
        <a href='https://www.w3.org/'><abbr title='World Wide Web Consortium'>W3C</abbr></a><sup>&reg;</sup>
        (<a href='https://www.csail.mit.edu/'><abbr title='Massachusetts Institute of Technology'>MIT</abbr></a>,
        <a href='https://www.ercim.eu/'><abbr title='European Research Consortium for Informatics and Mathematics'>ERCIM</abbr></a>,
        <a href='https://www.keio.ac.jp/'>Keio</a>, <a href="http://ev.buaa.edu.cn/">Beihang</a>).
        ${conf.isCCBY ? html`
          Some Rights Reserved: this document is dual-licensed,
          <a rel="license" href="https://creativecommons.org/licenses/by/3.0/">CC-BY</a> and
          <a rel="license" href="https://www.w3.org/Consortium/Legal/copyright-documents">W3C Document License</a>.
        ` : ""}
        W3C <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer'>liability</a>,
        <a href='https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks'>trademark</a> and
        ${conf.isCCBY ? html`
          <a rel="license" href='https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html'>document use</a>
        ` : html`
          ${conf.isW3CSoftAndDocLicense ? html`
            <a rel="license" href='https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document'>permissive document license</a>
          ` : html`
            <a rel="license" href='https://www.w3.org/Consortium/Legal/copyright-documents'>document use</a>
          `}
        `}
        rules apply.
      </p>
    `}
  `}
  <hr title="Separator for header">
</div>`;
}
