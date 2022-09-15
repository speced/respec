/* eslint-disable no-unused-vars */
const organisationConfig = {
  // nl_organisationName: "Logius",
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
    nl: {
      aa: `De programmaraad van Geonovum heeft deze standaard goedgekeurd.`,
      bb: `De programmaraad van Geonovum beoordeelt dit definitief concept. Keurt zij het goed, dan is er een nieuwe standaard.`,
      cc: `Dit is de definitieve versie van de praktijkrichtlijn. Een praktijkrichtlijn is een product dat informatie geeft, vaak met een technisch karakter, dat nodig is voor het toepassen van een standaard. Een praktijkrichtlijn hoort altijd bij een standaard/norm.`,
      dd: `Het OBDO heeft op advies van het Forum Standaardisatie deze versie vastgesteld.`,
    },
    en: {
      aa: `The Geonovum program council has approved this standard.`,
      bb: `The Geonovum program council assesses this final concept. If they approve, then there is a new standard.`,
      cc: `This is the final version of the practice guideline. A practice guideline is a product that provides information, often of a technical nature, that is necessary for the application of a standard. A practical guideline always belongs to a standard/norm.`,
      dd: `The OBDO has adopted this version on the advice of the Standardization Forum.`,
    },
  },
  sotdText: {
    nl: {
      sotd: "Status van dit document",
      def: `Dit is de definitieve versie van. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.`,
      wv: `Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten. Het is geen door goedgekeurde consultatieversie.`,
      cv: `Dit is een door goedgekeurde consultatieversie. Commentaar over dit document kan gestuurd worden naar `,
      vv: `Dit is een definitief concept van de nieuwe versie van. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.`,
      basis: "Dit is een document zonder officiële status.",
    },
    en: {
      sotd: "Status of This Document",
      def: `This is the definitive version of the. Edits resulting from consultations have been applied.`,
      wv: `This is a draft that could be altered, removed or replaced by other documents. It is not a recommendation approved by.`,
      cv: `This is a proposed recommendation approved by. Comments regarding this document may be sent to `,
      vv: `This is the definitive concept of the. Edits resulting from consultations have been applied.`,
      basis: "This document has no official standing.",
    },
  },
  labelText: {
    nl: {
      def: `Definitieve versie`,
      wv: `Werkversie`,
      cv: `Goedgekeurde consultatieversie`,
      vv: `Definitief concept`,
      basis: "Geen officiële status",
    },
    en: {
      def: `Definitive version`,
      wv: `Working version`,
      cv: `Approved consultation version`,
      vv: `Final draft`,
      basis: `No official status`,
    },
  },
  labelColorTable: {
    def: "#154273",
    wv: "#32a852",
    cv: "#2fdaed",
    vv: "#f00a0a",
    basis: "#8c8c8c",
  },
};
/* eslint-enable no-unused-vars */
