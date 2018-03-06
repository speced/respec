define(["exports", "./show-logo", "./show-people", "./show-link", "deps/hyperhtml"], function (exports, _showLogo, _showPeople, _showLink) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _showLogo2 = _interopRequireDefault(_showLogo);

  var _showPeople2 = _interopRequireDefault(_showPeople);

  var _showLink2 = _interopRequireDefault(_showLink);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = conf => {
    const html = hyperHTML;
    return html`<div class='head'>
  ${conf.logos.map(_showLogo2.default)}
  <h1 class='title p-name' id='title'>${conf.title}</h1>
  ${conf.subtitle ? html`
    <h2 id='subtitle'>${conf.subtitle}</h2>
  ` : ""}
  <h2>${conf.longStatus} <time class='dt-published' datetime='${conf.dashDate}'>${conf.publishHumanDate}</time></h2>
  <dl>
    ${conf.thisVersion ? html`
      <dt>${conf.l10n.this_version}</dt>
      <dd><a class='u-url' href='${conf.thisVersion}'>${conf.thisVersion}</a></dd>
    ` : ""}
    ${conf.latestVersion ? html`
      <dt>${conf.l10n.latest_published_version}</dt>
      <dd><a href='${conf.latestVersion}'>${conf.latestVersion}</a></dd>
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
    ${conf.prevVersion ? html`
      <dt>Previous version:</dt>
      <dd><a href='${conf.prevVersion}'>${conf.prevVersion}</a></dd>
    ` : ""}
    ${!conf.isCGFinal ? html`
      ${conf.prevED ? html`
        <dt>Previous editor's draft:</dt>
        <dd><a href='${conf.prevED}'>${conf.prevED}</a></dd>
      ` : ""}
    ` : ""}
    <dt>${conf.multipleEditors ? html`${conf.l10n.editors}` : html`${conf.l10n.editor}`}</dt>
    ${(0, _showPeople2.default)(conf, "Editor", conf.editors)}
    ${conf.authors ? html`
      <dt>${conf.multipleAuthors ? html`${conf.l10n.authors}` : html`${conf.l10n.author}`}</dt>
      ${(0, _showPeople2.default)(conf, "Author", conf.authors)}
    ` : ""}
    ${conf.otherLinks ? conf.otherLinks.map(_showLink2.default) : ""}
  </dl>
  ${conf.alternateFormats ? html`
    <p>
      ${conf.multipleAlternates ? "This document is also available in these non-normative formats:" : "This document is also available in this non-normative format:"}
      ${[conf.alternatesHTML]}
    </p>
  ` : ""}
  <p class='copyright'>
    <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> &copy;
    ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
    the Contributors to the ${conf.title} Specification, published by the
    <a href='${conf.wgURI}'>${conf.wg}</a> under the
    ${conf.isCGFinal ? html`
      <a href="https://www.w3.org/community/about/agreements/fsa/">W3C Community Final Specification Agreement (FSA)</a>. 
      A human-readable <a href="https://www.w3.org/community/about/agreements/fsa-deed/">summary</a> is available.
    ` : html`
      <a href="https://www.w3.org/community/about/agreements/cla/">W3C Community Contributor License Agreement (CLA)</a>.
      A human-readable <a href="https://www.w3.org/community/about/agreements/cla-deed/">summary</a> is available.
    `}
  </p>
  <hr title="Separator for header">
</div>`;
  };
});
//# sourceMappingURL=cgbg-headers.js.map