// @ts-check
/**
 * The header box of a Community Group specification using the redesign, i.e.
 * one whose `specStatus` is "CG-LIVING" or "CG-SNAPSHOT".
 *
 * cg-assets' cg-metadata.js builds it into the `data-cg-region` containers at
 * load time. A container left empty renders as nothing.
 */

import { W3CDate, concatDate } from "../../core/utils.js";
import { getSpecSubTitleElem, l10n } from "./headers.js";
import { html } from "../../core/import-maps.js";
import showPeople from "../../core/templates/show-people.js";

const LIFECYCLE =
  "https://github.com/w3c/cg-program/blob/main/proposals/spec-lifecycle.md#maturity-stages";
const LIVING_V_SNAPSHOT =
  "https://github.com/w3c/cg-program/blob/main/beta-2026/w3c-programs.md#living-specification-v-snapshot";
const COMMUNITY = "https://www.w3.org/community/";
const INCUBATION = "https://incubation.w3.org/";

/**
 * An empty container for cg-metadata.js + no JavaScript fallback.
 *
 * @param {string} name
 * @param {string} noScriptText
 * @param {"div" | "li"} elementName
 */
export function region(name, noScriptText, elementName = "div") {
  const message = document.createElement("p");
  message.className = "cg-metadata-unavailable";
  message.textContent = noScriptText;
  const fallback = document.createElement("noscript");
  fallback.append(message);

  const container = document.createElement(elementName);
  container.dataset.cgRegion = name;
  container.append(fallback);
  return container;
}

/**
 * Returns one of "draft", "transferred", "unmaintained", or "snapshot".
 * CG-SNAPSHOTS are considered "snapshot" variant.
 *
 * @param {Conf} conf
 */
export function cgVariant(conf) {
  if (conf.specStatus === "CG-SNAPSHOT") return "snapshot";
  return conf.cgMaturity ?? "draft";
}

/**
 * Builds the URL to the snapshots index for this specification. Returns an
 * empty string if it cannot be derived.
 *
 * @param {Conf} conf
 */
export function snapshotsIndex(conf) {
  // `group` may be type-qualified, as in "cg/wicg"
  const group =
    typeof conf.group === "string" ? conf.group.split("/", 2).at(-1) : "";
  if (!group || !conf.shortName) return "";
  const base = `${INCUBATION}groups/${encodeURIComponent(group)}/specs/`;
  return `${base}#${encodeURIComponent(conf.shortName)}`;
}

/**
 * The snapshot address.
 *
 * @param {Conf} conf
 */
export function snapshotAddress(conf) {
  if (conf.specStatus !== "CG-SNAPSHOT") return "";
  if (!conf.shortName || !conf.publishDate) return "";
  const dated = `${conf.shortName}-${concatDate(conf.publishDate)}`;
  return `${INCUBATION}specs/${encodeURIComponent(dated)}/`;
}

/** @param {Conf} conf */
function transferredTo(conf) {
  const to = conf.transferredTo;
  if (!to) return "Another organization";
  if (typeof to === "string") return to;
  return to.url ? html`<a href="${to.url}">${to.name}</a>` : to.name;
}

/**
 * The notice depending on the type of CG spec
 * @param {Conf} conf
 */
function noticeBox(conf) {
  switch (cgVariant(conf)) {
    case "snapshot":
      return html`<div class="box box--information">
        <h2>
          This is a <a href="${LIVING_V_SNAPSHOT}">snapshot</a> of an incubation
        </h2>
        <ul>
          <li>
            <strong
              >This document instance is archival and is not intended to
              change.</strong
            >
          </li>
          <li>
            It was published on
            <time class="dt-updated" datetime="${conf.dashDate}"
              >${W3CDate.format(conf.publishDate)}</time
            >.
          </li>
          ${
            conf.thisVersion
              ? html`<li>
                  The address of this snapshot is
                  <a href="${conf.thisVersion}">${conf.thisVersion}</a>.
                </li>`
              : ""
          }
        </ul>
      </div>`;
    case "transferred":
      return html`<div class="box box--information">
        <h2>
          This specification has been
          <a href="${LIFECYCLE}">transferred</a>
        </h2>
        <ul>
          <li>
            <strong
              >Rather than use or reference this specification, please consult
              the guidance of the organization to which the specification has
              been transferred.</strong
            >
          </li>
          <li>
            ${transferredTo(conf)} has taken up the work for standardization and
            so the Community Group is no longer the “owner”.
          </li>
        </ul>
      </div>`;
    case "unmaintained":
      return html`<div class="box box--warning">
        <h2>
          This specification is no longer in development and is
          <a href="${LIFECYCLE}">unmaintained</a>
        </h2>
        <ul>
          <li><strong>Do not use or reference.</strong></li>
          <li>
            If these circumstances change in the future, we will review our
            guidance.
          </li>
        </ul>
      </div>`;
    default:
      return html`<div class="box box--information">
        <h2>
          This is a
          <a href="${LIVING_V_SNAPSHOT}">living specification</a>
        </h2>
        <ul>
          <li>
            The text of this specification and the status information support
            for this specification are expected to change in place at this
            address.
          </li>
          ${region(
            "last-edited",
            "The last-edited date is loaded from the status metadata, which needs JavaScript.",
            "li"
          )}
          <li>
            This is a Community Group incubation and is not (yet) ready for
            standardization.
          </li>
        </ul>
      </div>`;
  }
}

/**
 * Where to go for what this document does not carry. A snapshot points at the
 * living specification; a living specification points at its own foot.
 *
 * @param {Conf} conf
 */
function whereToLook(conf) {
  const isSnapshot = cgVariant(conf) === "snapshot";
  const livingSpec = region(
    "living-spec",
    isSnapshot
      ? "The address of the living specification and its last-edited date are loaded from the status metadata, which needs JavaScript."
      : "The address of this specification and its last-edited date are loaded from the status metadata, which needs JavaScript.",
    "li"
  );
  return html`<div class="box box--information-alt">
    <h2>
      ${
        isSnapshot
          ? "Visit the living specification for the latest updates on this incubation"
          : "This document has the latest updates on this incubation"
      }
    </h2>
    <ul>
      ${livingSpec}
      <li>
        <a href="${snapshotsIndex(conf)}">Snapshots of this specification</a>
      </li>
      ${
        cgVariant(conf) === "draft"
          ? html`<li>
                <a href="#usage-guidance"
                  >Browser support details &amp; usage guidance</a
                >
              </li>
              <li>
                <a href="#cg-get-involved"
                  >Get involved to support this incubation</a
                >
              </li>`
          : ""
      }
    </ul>
  </div>`;
}

/**
 * @param {Conf} conf
 * @param {NodeListOf<ChildNode> | undefined} titleNodes
 */
function copyright(conf, titleNodes) {
  const isFinal = cgVariant(conf) === "snapshot";
  const agreement = isFinal
    ? html`<a href="https://www.w3.org/community/about/agreements/fsa/"
          >W3C Community Final Specification Agreement (FSA)</a
        >. A human-readable
        <a href="https://www.w3.org/community/about/agreements/fsa-deed/"
          >summary</a
        >
        is available.`
    : html`<a href="https://www.w3.org/community/about/agreements/cla/"
          >W3C Community Contributor License Agreement (CLA)</a
        >. A human-readable
        <a href="https://www.w3.org/community/about/agreements/cla-deed/"
          >summary</a
        >
        is available.`;
  return html`<p class="copyright">
    <a href="https://www.w3.org/policies/#copyright">Copyright</a> &copy;
    ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
    ${
      conf.additionalCopyrightHolders
        ? html` ${[conf.additionalCopyrightHolders]} &amp; `
        : ""
    }
    the Contributors to the ${titleNodes} Specification, published by the
    <a href="${conf.wgURI}">${conf.wg}</a> under the ${agreement}
  </p>`;
}

/**
 * @param {Conf} conf
 * @param {{ multipleAlternates: boolean; alternatesHTML: unknown }} _options
 */
export default (conf, _options) => {
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) existingCopyright.remove();

  const specTitleElem = document.querySelector("h1#title");
  const specTitleElemClone = specTitleElem?.cloneNode(true);
  const variant = cgVariant(conf);
  if (specTitleElem && variant !== "snapshot") {
    const label = variant[0].toUpperCase() + variant.slice(1);
    specTitleElem.append(
      " ",
      html`<a class="link--button link--button--tag" href="${LIFECYCLE}"
        >${label}<svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
          ></path></svg
      ></a>`
    );
  }

  return html`<div class="box box--head">
    ${specTitleElem} ${getSpecSubTitleElem(conf)}
    ${
      conf.wg
        ? html`<dl class="grid">
            <dt>Incubation by:</dt>
            <dd><a href="${conf.wgURI}">${conf.wg}</a></dd>
          </dl>`
        : ""
    }
    ${noticeBox(conf)}
    ${
      variant === "draft"
        ? html`${region(
            "progress",
            "The progress towards standardization is loaded from the status metadata, which needs JavaScript."
          )}
          ${region(
            "browser-support",
            "Browser support is loaded from the status metadata, which needs JavaScript."
          )}`
        : ""
    }
    ${whereToLook(conf)}
    ${
      (conf.editors ?? []).length
        ? html`<dl class="grid">
            <dt class="editor">
              ${(conf.editors ?? []).length > 1 ? l10n.editors : l10n.editor}
            </dt>
            ${showPeople(conf, "editors")}
          </dl>`
        : ""
    }
    ${
      (conf.authors ?? []).length
        ? html`<dl class="grid">
            <dt>
              ${(conf.authors ?? []).length > 1 ? l10n.authors : l10n.author}
            </dt>
            ${showPeople(conf, "authors")}
          </dl>`
        : ""
    }
    ${
      existingCopyright
        ? existingCopyright
        : copyright(conf, specTitleElemClone?.childNodes)
    }
  </div>`;
};

export { COMMUNITY, LIFECYCLE };
