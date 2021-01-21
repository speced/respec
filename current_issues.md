# Respec Template Geonovum-Logius

| issue | module | line | issue | Geonovum | Logius |
| ---| --- | --- | --- | --- | --- |
|1.1| template/headers.js|15|Harde codering "Geonovum"|vervangen door een variabele in config.js, bijvoorbeeld {conf.orgName} of helemaal weglaten.|in deze versie: **conf.nl_organisationName**|
|2.1| templates/sotd.js|33|Geonovum specifieke teksten|Optie 1) Generiekere tekst van maken, andere partijen "GN-BASIS" laten gebruiken.<br>Optie 2) een nieuwe status introduceren "AO-DOC" = Andere Organisatie Document|W3C versie als basis gebruikt en de GN versie hierin opgenomen<br>Statussen gehandhaafd (en uitgebreid en de te genereren teksten in een beslisboom geplaatst.|
|2.2| templates/sotd.js|15|	Gebruik van status_at_publication|	Zie issue 05, als deze afhankelijk wordt gemaakt van "AO-DOC" kan de melding worden onderdrukt|zie 2.1|
|3.1| headers.js |126<br>385|Entry toevoegen aan status2text|Optioneel, afhankelijk van [02] "AO-DOC" als specstatus toevoegen|status2text uitgebreid. Naast "GN-"statussen ook 'generieke' statussen toegevoegd en uitgebreid|
|3.2| headers.js|240<br>259<br>285|Harde codering van "https://docs.geostandaarden.nl/"|Via een configuratie parameter laten lopen: conf.publishServer.<br>Defaulten naar https://docs.geostandaarden.nl| in deze versie: **conf.nl_organisationPublishURI** |
|4.1|seo.js|8|Harde codering van "https://docs.geostandaarden.nl/"|Via een configuratie parameter laten lopen: conf.publishServer deze defaulten naar https://docs.geostandaarden.nl|**todo**|
|4.2|seo.js|92<br>93|	Copyrightholder name en url via config.js laten lopen.|Twee variabelen nodig:<br>conf.CopyrightName en conf.CopyrightURL.<br>Defaulten naar "Geonovum" en "www.geonovum.nl"|**todo**| 
|5.1|l10n.js|8|	Harde codering van https://www.geonovum.nl/geo-standaarden/alle-standaarden|Url via config laten lopen, óf voorkomen dat deze melding gegeven wordt, zie daarvoor [02], line 15|hier is  de core en W3c versie gehandhaafd. **todo** is dat voldoende?|
|6.1|leafletfigures.js|100<br>106|Harde codering van https://tools.geostandaarden.nl/respec|Url via config laten lopen: conf.RespecURL, deze defaulten naar "https://tools.geostandaarden.nl/respec"|**todo** leafletfigures tijdelijk even uitgecommentarieerd. Op het oog lijken er een aantal modules te missen|
|7.1|style.js|46|Harde codering van https://tools.geostandaarden.nl/respec|Url via config laten lopen: conf.RespecURL, deze defaulten naar "https://tools.geostandaarden.nl/respec"|in deze versie: **conf.nl_organisationStylesURL** en<br>**conf.nl_organisationPrefix**|
|7.1|style.js|55<br>56<br>57<br>58<br>59|Ico file uit index.html wordt hier hard gecodeerd.|Alleen doen als er geen favicon is gedefinieerd in index.html|**todo**|
