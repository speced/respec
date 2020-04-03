// @ts-check
// Module geonovum/l10n
// Looks at the lang attribute on the root element and uses it to manage the config.l10n object so
// that other parts of the system can localise their text
import { html } from "../core/import-maps.js";
import { l10n } from "../core/l10n.js";
export const name = "geonovum/l10n";
const additions = {
  en: {
    status_at_publication: html`This section describes the status of this
      document at the time of its publication. Other documents may supersede
      this document. A list of current Geonovum publications and the latest
      revision of this document can be found via
      <a href="https://www.geonovum.nl/geo-standaarden/alle-standaarden"
        >https://www.geonovum.nl/geo-standaarden/alle-standaarden</a
      >(in Dutch).`,
  },
  nl: {
    status_at_publication: html`Deze paragraaf beschrijft de status van dit
      document ten tijde van publicatie. Het is mogelijk dat er actuelere
      versies van dit document bestaan. Een lijst van Geonovum publicaties en de
      laatste gepubliceerde versie van dit document zijn te vinden op
      <a href="https://www.geonovum.nl/geo-standaarden/alle-standaarden"
        >https://www.geonovum.nl/geo-standaarden/alle-standaarden</a
      >.`,
  },
};

Object.keys(additions).forEach(key => {
  if (!l10n[key]) l10n[key] = {};
  Object.assign(l10n[key], additions[key]);
});
