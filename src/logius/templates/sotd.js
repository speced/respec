// @ts-check
import { getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";

const localizationStrings = {
  en: {
    sotd: "Status of This Document",
  },
  ko: {
    sotd: "현재 문서의 상태",
  },
  zh: {
    sotd: "关于本文档",
  },
  ja: {
    sotd: "この文書の位置付け",
  },
  nl: {
    sotd: "Status van dit document",
  },
  es: {
    sotd: "Estado de este Document",
  },
  de: {
    sotd: "Status dieses Dokuments",
  },
};

export const l10n = getIntlData(localizationStrings);

export default (conf, opts) => {
  return html`
    <h2>${l10n.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""}
    ${conf.isDEF
      ? renderDEF(opts)
      : conf.isVV
      ? renderVV(opts)
      : conf.isCV
      ? renderCV(opts)
      : conf.isWV
      ? renderWV(opts)
      : conf.isBASIS
      ? renderBASIS()
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

function renderDEF(opts) {
  return html`<p>
    Dit is de definitieve versie van ${opts.specDocument}. Wijzigingen naar
    aanleiding van consultaties zijn doorgevoerd.
  </p>`;
}

function renderWV(opts) {
  return html`<p>
    Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of
    vervangen door andere documenten. Het is geen door
    ${opts.operationalCommittee} goedgekeurde consultatieversie.
  </p>`;
}

function renderCV(opts) {
  return html` Dit is een door ${opts.operationalCommittee} goedgekeurde
    consultatieversie. Commentaar over dit document kan gestuurd worden naar
    <a href="${opts.emailCommentsMailto}"> ${opts.emailComments}</a>.`;
}

function renderVV(opts) {
  return html`Dit is een definitief concept van de nieuwe versie van
  ${opts.specDocument}. Wijzigingen naar aanleiding van consultaties zijn
  doorgevoerd.`;
}

function renderBASIS() {
  return html`Dit is een document zonder officiële status.`;
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
    case 112: // Logius + ST + DEF
      govText = `Het OBDO heeft op advies van het Forum Standaardisatie deze versie vastgesteld.`;
      break;
    default:
      break;
  }
  return html`<p>${govText}</p>`;
}
