import "deps/hyperhtml";
import showLogos from "./show-logos";
import showPeople from "./show-people";

export default conf => {
  const html = (...args) => hyperHTML.wire()(...args);
  return html`<div class='head'>
  <p>
    <a class='logo' href='https://www.w3.org/'><img width='72' height='48' src='https://www.w3.org/StyleSheets/TR/2016/logos/W3C' alt='W3C'></a>
  </p>
  ${[showLogos(conf.logos)]}
  <h1 class='title p-name' id='title' property=${conf.doRDFa ? "dc:title" : null}>${conf.title}</h1>
  ${conf.subtitle ? html`
    <h2 property=${conf.doRDFa ? "bibo:subtitle" : null} id='subtitle'>${conf.subtitle}</h2>
  ` : ""}
  <h2>${conf.longStatus} <time property=${conf.doRDFa ? "dc:issued" : null} class='dt-published' datetime='${conf.dashDate}'>${conf.publishHumanDate}</time></h2>
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
      <dd><a rel=${conf.doRDFa ? "dcterms:replaces" : null} href='${conf.prevVersion}'>${conf.prevVersion}</a></dd>
    ` : ""}
    ${!conf.isCGFinal ? html`
      ${conf.prevED ? html`
        <dt>Previous editor's draft:</dt>
        <dd><a href='${conf.prevED}'>${conf.prevED}</a></dd>
      ` : ""}
    ` : ""}
    <dt>${conf.multipleEditors ? html`${conf.l10n.editors}` : html`${conf.l10n.editor}`}</dt>
    ${[showPeople(conf, "Editor", conf.editors)]}
    ${conf.authors ? html`
      <dt>${conf.multipleAuthors ? html`${conf.l10n.authors}` : html`${conf.l10n.author}`}</dt>
      ${[showPeople(conf, "Author", conf.authors)]}
    ` : ""}
    ${conf.otherLinks ? html`
      ${conf.otherLinks.map(link => html`
        ${link.key ? html`
          <dt class="${link.class ? [link.class] : null}">${link.key}:</dt>
          ${link.data ? html`
             ${link.data.map(item => html`
                ${item.value ? html`
                  <dd class="${item.class ? [item.class] : null}">
                    ${item.href ? html`<a href="${item.href}">${item.value}</a>` : ""}
                  </dd>
                ` : html`
                  ${item.href ? html`
                    <dd><a href="${item.href}">${item.href}</a></dd>
                  ` : ""}
                `}
             `)}
          ` : html`
            ${link.value ? html`
              <dd class="${link.class ? [link.class] : null}">
                ${link.href ? html`<a href="${link.href}">${link.value}</a>` : ""}
              </dd>
            ` : html`
              ${link.href ? html`
                <dd class="${link.class ? [link.class] : null}">
                  <a href="${link.href}">${link.href}</a>
                </dd>
              ` : ""}
            `}
          `}
        ` : ""}
      `)}
    ` : ""}
  </dl>
  ${conf.alternateFormats ? html`
    <p>
      ${conf.multipleAlternates ?
        "This document is also available in these non-normative formats:" :
        "This document is also available in this non-normative format:"}
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
}
