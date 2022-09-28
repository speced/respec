# ReSpec

ReSpec is een JavaScript library voor het publiceren van technische documenten in een [toegankelijk](https://digitaaltoegankelijk.pleio.nl/cms/view/649ed793-7f0d-4676-bb10-f66fbd8a13c6/digitale-toegankelijkheid-bij-geonovum) HTML formaat. Deze repository is een fork van [w3c/respec](https://github.com/w3c/respec).

Momenteel bevat het een Geonovum profiel en daaruit afgeleid een Logius profiel. Er wordt gewerkt aan een meer configureerbaar profiel dat door meerdere Nederlandse organisaties toegepast kan worden. Iedereen is welkom om pull requests of issues in te dienen.

Het "NL-profiel" wordt periodiek in sync gehouden met de W3C-bron. Het profiel onderscheidt zich onder andere door de nadruk op zowel configureerbaarheid als het gebruik van Markdown.

## Toepassen

Om schrijvers op weg te helpen is er een [template](https://github.com/Logius-standaarden/respec-template) beschikbaar in een aparte repository. Indien u vragen heeft over het toepassen van ReSpec kunt daar de [issues](https://github.com/Logius-standaarden/ReSpec-template/issues?q=) bezoeken. Een uitgebreide Engelstalig overzicht van de algemene functies in ReSpec leest u op [respec.org](https://respec.org/docs/).

## Aanpassen

Wie wil sleutelen aan ReSpec wordt aangeraden de [Developers Guide](https://github.com/Logius-standaarden/respec/wiki/Developers-Guide) te raadplegen. Vragen of opmerkingen zijn welkom in de [issues](https://github.com/Logius-standaarden/respec/issues).

## Test runnen

Om mogelijke changes in de html te controleren na een update run `node test/test-html-build`. Dit maakt een snapshot van een html pagina en vergelijkt hem met het origineel. Als er veranderingen zijn, geeft hij aan wat en waar.
Voeg de `--createLog` vlag toe aan het commando om de veranderingen in een log file te printen ipv in de CMD prompt.
