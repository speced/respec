import "deps/hyperhtml";
import showLogo from "./show-logo";
import showPeople from "./show-people";
import showLink from "./show-link";

export default conf => {
  const html = hyperHTML;
  return html`<div class='head'>
  ${conf.logos.map(showLogo)}
  <h1 class='title p-name' id='title'>${conf.title}</h1>
  ${conf.subtitle ? html`
    <h2 id='subtitle'>${conf.subtitle}</h2>
  ` : ""}
  <h2>Geonovum ${conf.isRegular ? html`
    ${conf.typeStatus}<br/>
    ` : ""}
  ${conf.textStatus} <time class='dt-published' datetime='${conf.dashDate}'>${conf.publishHumanDate}</time></h2>
  <dl>
    ${!conf.isNoTrack ? html`
      <dt>${conf.l10n.this_version}</dt>
      <dd><a class='u-url' href='${conf.thisVersion}'>${conf.thisVersion}</a></dd>
      <dt>${conf.l10n.latest_published_version}</dt>
      <dd>${conf.latestVersion ? html`<a href='${conf.latestVersion}'>${conf.latestVersion}</a>` : "geen"}</dd>
    ` : ""}
    ${conf.bugTrackerHTML ? html`
      <dt>${conf.l10n.bug_tracker}</dt>
      <dd>${[conf.bugTrackerHTML]}</dd>
    ` : ""}
    ${conf.showPreviousVersion ? html`
      <dt>Vorige versie:</dt>
      <dd><a href='${conf.prevVersion}'>${conf.prevVersion}</a></dd>
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
      Er zijn errata aanwezig. Zie de <a href="${conf.errata}"><strong>errata</strong></a> voor fouten en problemen die gerapporteerd zijn na publicatie.
    </p>
  ` : ""}
  ${conf.alternateFormats ? html`
    <p>
      ${conf.multipleAlternates ?
        "Dit document is ook beschikbaar in deze niet-normatieve formaten:" :
        "Dit document is ook beschikbaar in dit niet-normatieve formaat:"}
      ${[conf.alternatesHTML]}
    </p>
  ` : ""}
    ${conf.additionalCopyrightHolders ? html`
      <p class='copyright'>${[conf.additionalCopyrightHolders]}</p>
    ` : html`
      ${conf.overrideCopyright ? [conf.overrideCopyright] : html`
        <dt>Rechtenbeleid:</dt>
        <dd>
        <div class='copyright' style="margin: 0.25em 0;">
          <abbr title='${[conf.licenseInfo.name]}'>
          <a href='${[conf.licenseInfo.url]}'><img src='https://tools.geostandaarden.nl/respec/style/logos/CC-Licentie.svg' alt='${[conf.licenseInfo.name]}' width='115px' height='40px'></a>
        </abbr>
          <div style="display:inline-block; vertical-align:top">
            <p style="font-size: small;">${[conf.licenseInfo.name]}<br>(${[conf.licenseInfo.short]})</p>
          </div>
        </div>
        </dd>
      `}
    `}
  <hr title="Separator for header">
</div>`;
}
