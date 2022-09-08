/* eslint-disable no-unused-vars */
const organisationConfig = {
  nl_organisationName: "Logius",
  nl_organisationPrefix: "LS-",
  nl_organisationStylesURL:
    "https://publicatie.centrumvoorstandaarden.nl/respec/style/",
  // nl_organisationStylesURL: "http://localhost:8081/respec/style/",
  nl_organisationPublishURL: "https://publicatie.centrumvoorstandaarden.nl/",
  nl_logo: {
    src: "https://publicatie.centrumvoorstandaarden.nl/respec/style/logos/figure-logius.svg",
    // src: "http://localhost:8081/respec/style/logos/figure-logius.svg",
    alt: "Logius",
    id: "Logius",
    height: 77,
    width: 44,
    url: "https://www.logius.nl/standaarden",
  },
  // preProcess: [mdAddFigure],

  governanceTypeText: {
    aa: `De programmaraad van Geonovum heeft deze standaard goedgekeurd.`,
    bb: `De programmaraad van Geonovum beoordeelt dit definitief concept. Keurt zij het goed, dan is er een nieuwe standaard.`,
    cc: `Dit is de definitieve versie van de praktijkrichtlijn. Een praktijkrichtlijn is een product dat informatie geeft, vaak met een technisch karakter, dat nodig is voor het toepassen van een standaard. Een praktijkrichtlijn hoort altijd bij een standaard/norm.`,
    dd: `Het OBDO heeft op advies van het Forum Standaardisatie deze versie vastgesteld.`,
  },
  sotdText: {
    en: {
      sotd: "Status of This Document",
      def: `This is the definitive version of the. Edits resulting from consultations have been applied.`,
      wv: `This is a draft that could be altered, removed or replaced by other documents. It is not a recommendation approved by.`,
      cv: `This is a proposed recommendation approved by. Comments regarding this document may be sent to `,
      vv: `This is the definitive concept of the. Edits resulting from consultations have been applied.`,
      basis: "This document has no official standing.",
    },
    nl: {
      sotd: "Status van dit document",
      def: `Dit is de definitieve versie van. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.`,
      wv: `Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten. Het is geen door goedgekeurde consultatieversie.`,
      cv: `Dit is een door goedgekeurde consultatieversie. Commentaar over dit document kan gestuurd worden naar `,
      vv: `Dit is een definitief concept van de nieuwe versie van. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.`,
      basis: "Dit is een document zonder officiële status.",
    },
  },
  labelText: {
    def: `Definitieve versie`,
    wv: `Werkversie`,
    cv: `Goedgekeurde consultatieversie`,
    vv: `Definitief concept`,
    basis: "Geen officiële status.",
  },
};
/* eslint-enable no-unused-vars */
