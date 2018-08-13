import "deps/hyperhtml";

// Thijs Brentjens: changed statusses and texts for the Goenovum specTypes
export default conf => {
  const html = hyperHTML;
  // handle the emailComments configuration
  if (!conf.emailComments) {
    conf.emailComments = "geo-standaarden@geonovum.nl"    ;
  }
  conf.emailCommentsMailto = "mailto:"+conf.emailComments;
  conf.specType=="IM" ? conf.article = 'het ' : conf.article = 'de ';
  // Thijs Brentjens, https://github.com/Geonovum/respec/issues/138
  // change the text in more detail according to the specType and specStatus
  return html`<h2>${conf.l10n.sotd}</h2><p>
    <em>${[conf.l10n.status_at_publication]}</em>
  </p>
  <p>
${conf.isGNDEF ? html`
    Dit is de definitieve versie van ${conf.article} ${conf.typeStatus.toLowerCase()}. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.
` : ""}
${conf.isGNWV ? html`
  Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten. Het is geen door de werkgroep goedgekeurde consultatieversie.
` : ""}
${conf.isGNCV ? html`
    Dit is een door de werkgroep goedgekeurde consultatieversie. Commentaar over dit document kan gestuurd worden naar
    <a href='${conf.emailCommentsMailto}'>
        ${conf.emailComments}</a>.
` : ""}
${conf.isGNVV ? html`
  Dit is een definitief concept van de nieuwe versie van ${conf.article} ${conf.typeStatus.toLowerCase()}. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.
` : ""}
${conf.isGNBASIS ? html`
    Dit is een document zonder officiële status.
` : ""}
${conf.specType=="ST" && conf.isGNDEF ? html ` De programmaraad van Geonovum heeft deze standaard goedgekeurd.` : ""}
${conf.specType=="ST" && conf.isGNVV ? html ` De programmaraad van Geonovum beoordeelt dit definitief concept. Keurt zij het goed, dan is er een nieuwe standaard.` : ""}
${conf.specType=="PR" ? html` Dit is de definitieve versie van de praktijkrichtlijn. Een praktijkrichtlijn is een product dat informatie geeft, vaak met een technisch karakter, dat nodig is voor het toepassen van een standaard. Een praktijkrichtlijn hoort altijd bij een standaard/norm.` : ""}
</p>
${[conf.additionalContent]}
${[conf.additionalSections]}`;
}
