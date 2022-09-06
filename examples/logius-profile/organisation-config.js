/* eslint-disable no-unused-vars */
const organisationConfig = {
  specType: "HR",
  specStatus: "WV",
  labelColor: "red",

  // subtitle: "Hier komt een subtitle",
  shortName: "API-Design-Rules",

  publishDate: "2020-09-20",
  previousPublishDate: "2018-10-07",
  // Zie https://github.com/w3c/respec/wiki/previousMaturity. Dit moet een
  // A YYYY-MM-DD date. When a previousPublishDate is specified, this is typically required as well in order to generate the "Previous Version"
  previousMaturity: "DEF",
  pubDomain: "dk",
  pubSubDomain: "watisdk",

  editors: [
    {
      name: "P H",
      mailto: "api@digikoppeling",
      company: "Logius",
      companyURL: "https://logius.nl/standaarden",
    },
    {
      name: "P H",
      url: "https://logius.nl/standaarden",
    },
  ],
  authors: [
    {
      name: "P H",
      url: "https://logius.nl/standaarden",
    },
  ],
  github: "https://github.com/Logius-standaarden/API-Design-Rules",
  //   testSuiteURI: "https://github.com/Logius-standaarden/API-Design-Rules",
  highlightVars: true,
  // noHighlightCSS: true, // hidden config ?!
  nl_emailcomments: "digikoppeling@logius.nl",
  addSectionLinks: true,
  a11y: false,
  maxTocLevel: 3,
  alternateFormats: [
    {
      label: "html",
      uri: "https://publicatie.centrumvoorstandaarden.nl/api/oauth/static.html",
    },
    {
      label: "pdf",
      uri: "https://publicatie.centrumvoorstandaarden.nl/api/oauth/static.pdf",
    },
  ],

  // nl_addReleaseTagTitle: true,
  nl_markdownSplitH1sections: false,
  nl_github: {
    issueBase: "https://github.com/Geonovum/KP-APIs/issues/",
    revision: "https://github.com/Logius-standaarden/API-Design-Rules/commits/",
    pullrequests:
      "https://github.com/Logius-standaarden/API-Design-Rules/pulls/",
  },
  nl_organisationName: "Logius",
  nl_organisationPrefix: "LS-",
  nl_markdownTableClass: "simple",
  nl_markdownEmbedImageInFigure: true,
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
};
/* eslint-enable no-unused-vars */
