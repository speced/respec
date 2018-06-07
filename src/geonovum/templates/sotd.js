import "deps/hyperhtml";

// Thijs Brentjens: changec statusses and texts for the Goenovum specTypes
export default conf => {
  const html = hyperHTML;
  return html`<h2>${conf.l10n.sotd}</h2><p>
    <em>${[conf.l10n.status_at_publication]}</em>
  </p>
${conf.isGNDEF ? html`
  <p>
    Dit is de definitieve versie van de standaard. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd. De programmaraad
    van Geonovum heeft deze standaard goedgekeurd.
  </p>
` : ""}
${conf.isGNWV ? html`
  <p>
  Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten. Het is geen
  door de werkgroep goedgekeurde consultatieversie.
  </p>
` : ""}
${conf.isGNCV ? html`
  <p>
    Dit is een door de werkgroep goedgekeurde consultatieversie. Commentaar over dit document kan gestuurd worden naar
    <a href="mailto:geo-standaarden@geonovum.nl">
        geo-standaarden@geonovum.nl</a>.
  </p>
` : ""}
${conf.isGNVV ? html`
  <p>
  Dit is een definitief concept van de nieuwe versie van de standaard. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.
  De programmaraad van Geonovum beoordeelt dit definitief concept. Keurt zij het goed, dan is er een nieuwe standaard.
  </p>
` : ""}
${conf.isGNBASIS ? html`
  <p>
    Dit is een document zonder officiële status.
  </p>
` : ""}
${[conf.additionalContent]}
${[conf.additionalSections]}`;
}
