var respecConfig = {
  specStatus: "GN-BASIS", // Kies uit de lijst: https://github.com/Geonovum/respec/wiki/specStatus
  specType: "HR", // Kies uit de lijst: https://github.com/Geonovum/respec/wiki/specType
  pubDomain: "wp", // Kies uit de lijst: https://github.com/Geonovum/respec/wiki/pubDomain. Of vraag aan bij beheerders
  publishDate: "2017-12-22", // Datum als jjjj-mm-dd, bijvoorbeeld
  editors: [
    {
      name: "Naam Eerste Auteur",
      company: "Geonovum",
      companyURL: "http://www.geonovum.nl/",
    },
    {
      name: "Naam Tweede Auteur",
      company: "Geonovum",
      companyURL: "http://www.geonovum.nl/",
    },
  ],
  shortName: "whitepaper-standaarden",
  subtitle: "Vastgestelde versie",
  github: "https://github.com/Geonovum/whitepaper-standaarden",
  issueBase: "https://github.com/Geonovum/whitepaper-standaarden/issues/",
  license: 'cc-by-nd',
  // logos: [], // Geef een lege array op als er geen Geonovum logo moet staan
  doJsonLd: true,
  localBiblio: {
    "DOC-REF1": {
      href: "http://example.com",
      title:
        "Titel van het document",
      authors: ["Auteur 1", "Auteur 2"],
      date: "1 januari 2099",
      publisher: "Naam van de uitgevende organisatie (indien beschikbaar)",
    },
    "ANDERE-DOC-REF": {
      href:
        "https://www.geonovum.nl/wegwijzer/standaarden/nederlands-profiel-web-map-service-op-iso-19128-versie-11",
      title:
        "Nederlands profiel op ISO 19128 Geographic information — Web Map Server Interface",
      authors: ["Geonovum"],
      date: "24 april 2015",
    },
  },
};
