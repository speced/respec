//-------------------------------------------------------------------------------------
//-- File. . . :  config.js
//-- Bevat . . :  Template voor de  configuratie voor respec  
//--              Gebaseerd op https://github.com/Geonovum/respec/wiki
//--              Deze file moet worden neergezet in de root-directory van de 
//--              betreffende standaard. 
//-- Door. . . :  Jan van Gelder
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-- Log . . . :  20181015 - JvG - Initiele versie 
//-------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------
var respecConfig = 
{
  //-- specStatus is verplicht! (activeer 1 van de volgende) --------------------------
  specStatus: "GN-WV",                // Werk Versie
  //specStatus: "GN-CV",              // Consultatie Versie
  //specStatus: "GN-VV",              // Vaststellings Versie
  //specStatus: "GN-DEF",             // Definitieve Versie
  //-- specType is verplicht! (activeer 1 van de volgende) ----------------------------
  //specType: "NO",                   // Norm
  //specType: "ST",                   // Standaard
  //specType: "IM",                   // Informatie Model
  //specType: "PR",                     // Praktijk Richtlijn
  specType: "HR",                   // HandReiking
  //specType: "WA",                   // Werkafspraak
  //-- format is verplicht! -----------------------------------------------------------
  format: "markdown",                 // altijd "markdown"     
  //-- publishDate is verplicht -------------------------------------------------------
  //-- NB: in de werkversie uitzetten, want dan pakt Respec de pushdate ---------------
  //publishDate: "2018-09-18",  	    // Format is "YYY-MM-DD"
  //-- de namen van de Editor(s) ------------------------------------------------------
  //-- vul in: per Editor: name:, company:, companyURL: -------------------------------
  //-- de github repository waar je documentn in staat --------------------------------
  github: "https://github.com/geonovum/respec/examples/md_example",
  editors: 
  [
    {
      name:       "Anthony E. Pratt",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    }, 
    {
      name:       "Dr. Black",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    }, 
  ],
  //-- de namen van de Author(s) ------------------------------------------------------
  //-- vul in: per Author: name:, company:, companyURL: -------------------------------
  authors: 
  [
    {
      name:       "Colonel Mustard",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    }, 
    {
      name:       "Professor Plum",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    },   
    {
      name:       "Reverend Green",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    },    
    {
      name:       "Mrs. Peacock",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    },    
    {
      name:       "Miss Scarlet",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    }, 
    {
      name:       "Mrs. White",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    }, 
    {
      name:       "Dr. Orchid",
      company:    "Cluedo",
      companyURL: "https://nl.wikipedia.org/wiki/Cluedo"
    }, 
  ],
  //-- shortName is verplicht! (komt in de URL: kies logische naam) --------------------
  shortName: "clue",  	            // Wordt gebruikt in de document URL
  //-- pubDomain is verplicht! (komt in de URL: Activeer 1 van de volgende) ------------
  pubDomain: "mim", 	              // Metamodel Informatie Modellering
  //pubDomain: "bor", 	            // Beheer Openbare Ruimte
  //pubDomain: "bro", 	            // Basisregistratie Ondergrond
  //pubDomain: "imgeo", 	          // IMGeo / BGT
  //pubDomain: "kl", 	              // Kabels en Leidingen
  //pubDomain: "liv", 	            // Landelijke Informatievoorziening Vastgoedgebruik
  //pubDomain: "md", 	              // Metadata
  //pubDomain: "nen3610", 	        // Basismodel NEN3610
  //pubDomain: "oov", 	            // Openbare Orde en Veiligheid
  //pubDomain: "ro", 	              // Ruimtelijke Ordening
  //pubDomain: "serv", 	            // Services
  //pubDomain: "visu", 	            // Visualisatie
  //pubDomain: "wp", 	              // White Paper
  //-- Repositorynaam op GitHub -------------------------------------------------------
  //github: "https://github.com/JvG/",
  //-- Repositorynaam/issues op GitHub ------------------------------------------------
  //issueBase: "https://github.com/Geonovum/JvG/issues/",
  //-- license: voor de geldende gebruiksvoorwaarden
  licence: "cc-by-nd",              //-- bronvermelding, geen afgeleide werken (default)
  // licence: "cc0",                //-- Public Domain Dedication
  // licence: "cc-by",              //-- Attribution, met bronvermelding
  
  //-- localBiblio: lokale bibliografie, voor verwijzigingen
  //-- NB: kijk eesrt naar de beschikbare www.specref.org voor verwijziging 
  localBiblio: 
  {
    "KANDELAAR":
      {
        title:      "Nuttig gebruik van Kandelaars",
        href:       "https://nl.wikipedia.org/wiki/Cluedo",
        status:     "V1.0.1",
        publisher:  "Colonel Mustard",
        company:    "Cluedo",
    },
    "GIF":
      {
        title:      "De grote plantenalmanak",
        href:       "https://nl.wikipedia.org/wiki/Cluedo",
        status:     "V1.0.1",
        publisher:  "Miss Scarlet",
        company:    "Cluedo",
    },
    "PISTOOL":
      {
        title:      "Middeleeuwse Musketten",
        href:       "https://nl.wikipedia.org/wiki/Cluedo",
        status:     "V1.0.1",
        publisher:  "Reverend Green",
        company:    "Cluedo",
    },
  }

  //-- Voor dit blok geldt: alleen als er eerdere versies zijn en altijd beiden aan/uit! 
  //previousPublishDate: "2018-09-18",  	    // Format is "YYY-MM-DD"
  //previousMaturity: "CV",                   // kies 1 van deze 2 regels  	  
  //previousMaturity: "VV",  	                // kies 1 van deze 2 regels

  //-- Optionele parameters:
  //emailComments: "mim@geonovum.nl",         // reactie mailadres, alleen bij CV!
  //subtitle: "iets",                         // Subtitel van het document
  //maxTocLevel: 3,                           // Aantal niveau's ToC, default is 0
};
