// @ts-check
import { getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";

export default (conf, opts) => {
  const localizationStrings = {
    en: {
      sotd: "Status of This Document",
      def: `This is the definitive version of the ${opts.specDocument}. Edits resulting from consultations have been applied.`,
      wv: `This is a draft that could be altered, removed or replaced by other documents. It is not a recommendation approved by ${opts.operationalCommittee}.`,
      cv: `This is a proposed recommendation approved by ${opts.operationalCommittee}. Comments regarding this document may be sent to `,
      vv: `This is the definitive concept of the ${opts.specDocument}. Edits resulting from consultations have been applied.`,
      basis: "This document has no official standing.",
    },
    nl: {
      sotd: "Status van dit document",
      def: `Dit is de definitieve versie van ${opts.specDocument}. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.`,
      wv: `Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten. Het is geen door ${opts.operationalCommittee} goedgekeurde consultatieversie.`,
      cv: `Dit is een door ${opts.operationalCommittee} goedgekeurde consultatieversie. Commentaar over dit document kan gestuurd worden naar `,
      vv: `Dit is een definitief concept van de nieuwe versie van ${opts.specDocument}. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.`,
      basis: "Dit is een document zonder officiële status.",
    },
  };
  const l10n = getIntlData(localizationStrings);
  return html`
    <h2>${l10n.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""}
    ${conf.isDEF
      ? l10n.def
      : conf.isVV
      ? l10n.vv
      : conf.isCV
      ? html`${l10n.cv}<a href="${opts.emailCommentsMailto}"
            >${opts.emailComments}</a
          >.`
      : conf.isWV
      ? l10n.wv
      : conf.isBASIS
      ? l10n.basis
      : ""}
    ${renderGovernance(conf)} ${opts.additionalSections}
  `;
};

export function renderPreview(conf) {
  const { prUrl, prNumber, edDraftURI } = conf;
  return html`<details class="annoying-warning" open="">
    <summary>
      This is a
      preview${prUrl && prNumber
        ? html`
            of pull request
            <a href="${prUrl}">#${prNumber}</a>
          `
        : ""}
    </summary>
    <p>
      Do not attempt to implement this version of the specification. Do not
      reference this version as authoritative in any way.
      ${edDraftURI
        ? html`
            Instead, see
            <a href="${edDraftURI}">${edDraftURI}</a> for the Editor's draft.
          `
        : ""}
    </p>
  </details>`;
}

function renderGovernance(conf) {
  let governanceType = 0;
  let govText = "";

  if (!conf.nl_organisationName) {
    conf.nl_organisationName = "";
  }
  switch (conf.nl_organisationName.toLowerCase()) {
    case "logius": // Logius = 2
      governanceType += 2;
      break;
    case "geonovum":
    default:
      // Geonovum = 1
      governanceType += 1;
      break;
  }
  switch (conf.specType) {
    case "ST": // ST = 10
      governanceType += 10;
      break;
    case "PR": // PR = 20
      governanceType += 20;
      break;
    case "BP": // BP = 30
      governanceType += 30;
      break;
  }
  switch (conf.specStatus) {
    case "DEF": // DEF = 100
      governanceType += 100;
      break;
    case "VV": // VV = 200
      governanceType += 200;
      break;
  }
  // console.log(`governanceType: ${governanceType}`);
  switch (governanceType) {
    case 111: // Geonovum + ST + DEF
      govText = `De programmaraad van Geonovum heeft deze standaard goedgekeurd.`;
      break;
    case 211: // Geonovum + VV + DEF
      govText = `De programmaraad van Geonovum beoordeelt dit definitief concept. Keurt zij het goed, dan is er een nieuwe standaard.`;
      break;
    case 21: // Geonovum + PR
      govText = `Dit is de definitieve versie van de praktijkrichtlijn. Een praktijkrichtlijn is een product dat informatie geeft, vaak met een technisch karakter, dat nodig is voor het toepassen van een standaard. Een praktijkrichtlijn hoort altijd bij een standaard/norm.`;
      break;
    //case 112: // Logius + ST + DEF
    //  govText = `Het OBDO heeft op advies van het Forum Standaardisatie deze versie vastgesteld.`;
      break;
    default:
      break;
  }
  return html`<p>${govText}</p>`;
}
