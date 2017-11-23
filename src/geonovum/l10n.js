// Module geonovum/l10n
// Looks at the lang attribute on the root element and uses it to manage the config.l10n object so
// that other parts of the system can localise their text
import { l10n } from "core/l10n";
export const name = "geonovum/l10n";
const additions = {
  nl: {
    status_at_publication:
      "Deze paragraaf beschrijft de status van dit document ten tijde van publicatie. Het is mogelijk dat er actuelere versies van dit document bestaan. Een lijst van Geonovum publicaties en de laatste gepubliceerde versie van dit document zijn te vinden op <a href='http://www.geonovum.nl/wegwijzer/standaarden'>http://www.geonovum.nl/wegwijzer/standaarden</a>",
  },
};

Object.keys(additions).reduce((l10n, key) => {
  Object.assign(l10n[key], additions[key]);
  return l10n;
}, l10n);
