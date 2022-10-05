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
  headerLocalizationStrings: {
    en: {
      author: "Author:",
      authors: "Authors:",
      editor: "Editor:",
      editors: "Editors:",
      former_editor: "Former editor:",
      former_editors: "Former editors:",
      latest_editors_draft: "Latest editor's draft:",
      latest_published_version: "Latest published version:",
      edited_in_place: "edited in place",
      this_version: "This version:",
      test_suite: "Test suite:",
      implementation_report: "Implementation report:",
      prev_editor_draft: "Previous editor's draft:",
      prev_version: "Previous version:",
      prev_recommendation: "Previous Recommendation:",
      latest_recommendation: "Latest Recommendation:",
    },
    ko: {
      author: "저자:",
      authors: "저자:",
      editor: "편집자:",
      editors: "편집자:",
      former_editor: "이전 편집자:",
      former_editors: "이전 편집자:",
      latest_editors_draft: "최신 편집 초안:",
      latest_published_version: "최신 버전:",
      this_version: "현재 버전:",
    },
    zh: {
      author: "作者：",
      authors: "作者：",
      editor: "编辑：",
      editors: "编辑：",
      former_editor: "原编辑：",
      former_editors: "原编辑：",
      latest_editors_draft: "最新编辑草稿：",
      latest_published_version: "最新发布版本：",
      this_version: "本版本：",
      test_suite: "测试套件：",
      implementation_report: "实现报告：",
      prev_editor_draft: "上一版编辑草稿：",
      prev_version: "上一版：",
      prev_recommendation: "上一版正式推荐标准：",
      latest_recommendation: "最新发布的正式推荐标准：",
    },
    ja: {
      author: "著者：",
      authors: "著者：",
      editor: "編者：",
      editors: "編者：",
      former_editor: "以前の版の編者：",
      former_editors: "以前の版の編者：",
      latest_editors_draft: "最新の編集用草案：",
      latest_published_version: "最新バージョン：",
      this_version: "このバージョン：",
      test_suite: "テストスイート：",
      implementation_report: "実装レポート：",
    },
    nl: {
      author: "Auteur:",
      authors: "Auteurs:",
      editor: "Redacteur:",
      editors: "Redacteurs:",
      latest_editors_draft: "Laatste werkversie:",
      latest_published_version: "Laatst gepubliceerde versie:",
      this_version: "Deze versie:",
      prev_version: "Vorige versie",
      former_editor: "Voormalig redacteur",
      former_editors: "Voormalige redacteurs",
    },
    es: {
      author: "Autor:",
      authors: "Autores:",
      editor: "Editor:",
      editors: "Editores:",
      latest_editors_draft: "Borrador de editor mas reciente:",
      latest_published_version: "Versión publicada mas reciente:",
      this_version: "Ésta versión:",
    },
    de: {
      author: "Autor/in:",
      authors: "Autor/innen:",
      editor: "Redaktion:",
      editors: "Redaktion:",
      former_editor: "Frühere Mitwirkende:",
      former_editors: "Frühere Mitwirkende:",
      latest_editors_draft: "Letzter Entwurf:",
      latest_published_version: "Letzte publizierte Fassung:",
      this_version: "Diese Fassung:",
    },
  },
};
/* eslint-enable no-unused-vars */
