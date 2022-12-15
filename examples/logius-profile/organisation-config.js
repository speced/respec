/* eslint-disable no-unused-vars */
const organisationConfig = {
  nl_organisationName: "Logius",
  nl_organisationStylesURL:
    "https://publicatie.centrumvoorstandaarden.nl/respec/style/",
  nl_organisationPublishURL: "https://publicatie.centrumvoorstandaarden.nl/",
  nl_logo: {
    src: "https://publicatie.centrumvoorstandaarden.nl/respec/style/logos/figure-logius.svg",
    alt: "Logius",
    id: "Logius",
    height: 77,
    width: 44,
    url: "https://www.logius.nl/standaarden",
  },
  // preProcess: [mdAddFigure],

  localizationStrings: {
    en: {
      wv: "Draft",
      cv: "Recommendation",
      vv: "Proposed recommendation",
      def: "Definitive version",
      basis: "Document",
      eo: "Outdated version",
      tg: "Rescinded version",
      no: "Norm",
      st: "Standard",
      im: "Information model",
      pr: "Guideline",
      hr: "Guide",
      wa: "Proposed recommendation",
      al: "General",
      bd: "Governance documentation",
      bp: "Best practice",
    },
    nl: {
      wv: "Werkversie",
      cv: "Consultatieversie",
      vv: "Versie ter vaststelling",
      def: "Vastgestelde versie",
      basis: "Document",
      eo: "Verouderde versie",
      tg: "Teruggetrokken versie",
      no: "Norm",
      st: "Standaard",
      im: "Informatiemodel",
      pr: "Praktijkrichtlijn",
      hr: "Handreiking",
      wa: "Werkafspraak",
      al: "Algemeen",
      bd: "Beheerdocumentatie",
      bp: "Best practice",
    },
  },

  specTypeText: {
    en: {
      no: "Norm",
      st: "Standard",
      im: "Information model",
      pr: "Guideline",
      hr: "Guide",
      wa: "Proposed recommendation",
      al: "General",
      bd: "Governance documentation",
      bp: "Best practice",
    },
    nl: {
      no: "Norm",
      st: "Standaard",
      im: "Informatiemodel",
      pr: "Praktijkrichtlijn",
      hr: "Handreiking",
      wa: "Werkafspraak",
      al: "Algemeen",
      bd: "Beheerdocumentatie",
      bp: "Best practice",
    },
  },

  specStatusText: {
    en: {
      wv: "Draft",
      cv: "Recommendation",
      vv: "Proposed recommendation",
      def: "Definitive version",
      basis: "Document",
      eo: "Outdated version",
      tg: "Rescinded version",
    },
    nl: {
      wv: "Werkversie",
      cv: "Consultatieversie",
      vv: "Versie ter vaststelling",
      def: "Vastgestelde versie",
      basis: "Document",
      eo: "Verouderde versie",
      tg: "Teruggetrokken versie",
    },
  },

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

  labelColor: {
    def: "#154273",
    wv: "#32a852",
  },
  licenses: {
    cc0: {
      name: "Creative Commons 0 Public Domain Dedication",
      short: "CC0",
      url: "https://creativecommons.org/publicdomain/zero/1.0/",
      image:
        "https://tools.geostandaarden.nl/respec/style/logos/CC-Licentie.svg",
    },
    "cc-by": {
      name: "Creative Commons Attribution 4.0 International Public License",
      short: "CC-BY",
      url: "https://creativecommons.org/licenses/by/4.0/legalcode",
      image: "https://tools.geostandaarden.nl/respec/style/logos/cc-by.svg",
    },
    "cc-by-nd": {
      name: "Creative Commons Naamsvermelding-GeenAfgeleideWerken 4.0 Internationaal",
      short: "CC-BY-ND",
      url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode.nl",
      image: "https://tools.geostandaarden.nl/respec/style/logos/cc-by-nd.svg",
    },
  },
};
/* eslint-enable no-unused-vars */
