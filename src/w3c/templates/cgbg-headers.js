import hyperHTML from "../../deps/hyperhtml";
import showLink from "./show-link";
import showLogo from "./show-logo";
import showPeople from "./show-people";

export default conf => {
  const html = hyperHTML;
  return html`
    <div class="head">
      ${conf.logos.map(showLogo)}
      <h1 class="title p-name" id="title">${conf.title}</h1>
      ${
        conf.subtitle
          ? html`
              <h2 id="subtitle">${conf.subtitle}</h2>
            `
          : ""
      }
      <h2>
        ${conf.longStatus}
        <time class="dt-published" datetime="${conf.dashDate}"
          >${conf.publishHumanDate}</time
        >
      </h2>
      <dl>
        ${
          conf.thisVersion
            ? html`
                <dt>${conf.l10n.this_version}</dt>
                <dd>
                  <a class="u-url" href="${conf.thisVersion}"
                    >${conf.thisVersion}</a
                  >
                </dd>
              `
            : ""
        }
        ${
          conf.latestVersion
            ? html`
                <dt>${conf.l10n.latest_published_version}</dt>
                <dd>
                  <a href="${conf.latestVersion}">${conf.latestVersion}</a>
                </dd>
              `
            : ""
        }
        ${
          conf.edDraftURI
            ? html`
                <dt>${conf.l10n.latest_editors_draft}</dt>
                <dd><a href="${conf.edDraftURI}">${conf.edDraftURI}</a></dd>
              `
            : ""
        }
        ${
          conf.testSuiteURI
            ? html`
                <dt>Test suite:</dt>
                <dd><a href="${conf.testSuiteURI}">${conf.testSuiteURI}</a></dd>
              `
            : ""
        }
        ${
          conf.implementationReportURI
            ? html`
                <dt>Implementation report:</dt>
                <dd>
                  <a href="${conf.implementationReportURI}"
                    >${conf.implementationReportURI}</a
                  >
                </dd>
              `
            : ""
        }
        ${
          conf.bugTrackerHTML
            ? html`
                <dt>${conf.l10n.bug_tracker}</dt>
                <dd>${[conf.bugTrackerHTML]}</dd>
              `
            : ""
        }
        ${
          conf.prevVersion
            ? html`
                <dt>Previous version:</dt>
                <dd><a href="${conf.prevVersion}">${conf.prevVersion}</a></dd>
              `
            : ""
        }
        ${
          !conf.isCGFinal
            ? html`
                ${
                  conf.prevED
                    ? html`
                        <dt>Previous editor's draft:</dt>
                        <dd><a href="${conf.prevED}">${conf.prevED}</a></dd>
                      `
                    : ""
                }
              `
            : ""
        }
        <dt>${conf.multipleEditors ? conf.l10n.editors : conf.l10n.editor}</dt>
        ${showPeople(conf, "Editor", conf.editors)}
        ${
          Array.isArray(conf.formerEditors) && conf.formerEditors.length > 0
            ? html`
                <dt>
                  ${
                    conf.multipleFormerEditors
                      ? conf.l10n.former_editors
                      : conf.l10n.former_editor
                  }
                </dt>
                ${showPeople(conf, "Editor", conf.formerEditors)}
              `
            : ""
        }
        ${
          conf.authors
            ? html`
                <dt>
                  ${conf.multipleAuthors ? conf.l10n.authors : conf.l10n.author}
                </dt>
                ${showPeople(conf, "Author", conf.authors)}
              `
            : ""
        }
        ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
      </dl>
      ${
        conf.alternateFormats
          ? html`
              <p>
                ${
                  conf.multipleAlternates
                    ? "This document is also available in these non-normative formats:"
                    : "This document is also available in this non-normative format:"
                }
                ${[conf.alternatesHTML]}
              </p>
            `
          : ""
      }
      <p class="copyright">
        <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Copyright"
          >Copyright</a
        >
        &copy;
        ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${
          conf.publishYear
        }
        ${
          conf.additionalCopyrightHolders
            ? html`
                ${[conf.additionalCopyrightHolders]} &amp;
              `
            : ""
        }
        the Contributors to the ${conf.title} Specification, published by the
        <a href="${conf.wgURI}">${conf.wg}</a> under the
        ${
          conf.isCGFinal
            ? html`
                <a href="https://www.w3.org/community/about/agreements/fsa/"
                  >W3C Community Final Specification Agreement (FSA)</a
                >. A human-readable
                <a
                  href="https://www.w3.org/community/about/agreements/fsa-deed/"
                  >summary</a
                >
                is available.
              `
            : html`
                <a href="https://www.w3.org/community/about/agreements/cla/"
                  >W3C Community Contributor License Agreement (CLA)</a
                >. A human-readable
                <a
                  href="https://www.w3.org/community/about/agreements/cla-deed/"
                  >summary</a
                >
                is available.
              `
        }
      </p>
      <hr title="Separator for header" />
    </div>
  `;
};
