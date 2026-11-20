// @ts-check
/**
 * Module w3c/cg-sections
 *
 * The two boilerplate sections at the foot of a Community Group specification:
 * how to get involved, and the usage guidance.
 *
 * Registered after the index-generating modules and before core/structure, so
 * these land last in the document and in the table of contents, but are not
 * numbered.
 */

import {
  cgVariant,
  createRegion,
  repeatedNotice,
} from "./templates/cg-headers.js";
import { html } from "../core/import-maps.js";
import { isCGSpec } from "./cg-assets.js";

export const name = "w3c/cg-sections";

const COMMUNITY = "https://www.w3.org/community/";

/**
 * Nothing to get involved in once a specification is unmaintained, so the
 * section is omitted rather than left pointing at a dormant repository.
 *
 * @param {Conf} conf
 */
function getInvolved(conf) {
  // @ts-expect-error -- conf.github is normalized to object form by core/github
  const issuesURL = conf.github?.issuesURL;
  const hasIssueSummary = !!document.getElementById("issue-summary");
  // Only when a single group is named: the join page is per group, and there
  // is no one page to send a reader to for a joint publication.
  // `group` may be type-qualified, as in "cg/wicg".
  const groupShortName =
    typeof conf.group === "string" ? conf.group.split("/", 2).at(-1) : "";
  const joinURL = groupShortName
    ? new URL(`${encodeURIComponent(groupShortName)}/join`, COMMUNITY).href
    : null;

  // `introductory` is how ReSpec says "list this in the table of contents but
  // do not number it": boilerplate, not part of the specification's own
  // sequence of sections. See core/structure's `isIntro`.
  return html`<section class="introductory">
    <h2 id="cg-get-involved">Get involved</h2>
    <p>There are many ways to support this W3C Community Group incubation.</p>
    <dl>
      ${
        issuesURL || hasIssueSummary
          ? html`<dt id="cg-providing-feedback">
                Provide feedback and express support
              </dt>
              ${issuesURL ? html`<dd><a href="${issuesURL}">GitHub</a></dd>` : ""}
              ${
                hasIssueSummary
                  ? html`<dd><a href="#issue-summary">Inline in spec</a></dd>`
                  : ""
              }`
          : ""
      }
      ${
        conf.wg
          ? html`<dt id="cg-join-group">Join the group</dt>
              <dd>
                <a href="${conf.wgURI}">Learn about the W3C ${conf.wg}</a>
              </dd>
              ${
                joinURL
                  ? html`<dd><a href="${joinURL}">Join the group</a></dd>`
                  : ""
              }`
          : ""
      }
    </dl>
    <p>Learn more <a href="${COMMUNITY}">about W3C Community Groups</a>.</p>
  </section>`;
}

/**
 * A living specification carries the collected usage guidance, so the section
 * is an empty container for cg-metadata.js to fill.
 */
function draftGuidance() {
  return html`${createRegion(
      "usage-guidance",
      "The usage guidance for this specification is loaded from the status metadata, which needs JavaScript."
    )}
    <p class="copyright">
      <strong>Disclaimer:</strong> The data in these tables is managed outside
      the document and is updated automatically. While W3C strives to ensure the
      accuracy of status data, we do not guarantee that the information is
      error-free. Any mention of specific products or services is solely for
      informational purposes and does not imply endorsement by W3C, Inc. or its
      Members.
    </p>`;
}

/**
 * Guidance for someone deciding whether to build on this.
 *
 * A living specification still in development has collected guidance, which
 * cg-metadata.js fills in. The other three have none: a snapshot is archival,
 * and a transferred or unmaintained specification is not somewhere to build
 * on at all. For those, the section repeats the notice from the head of the
 * document, so a reader who arrives at the foot -- from the table of contents,
 * or a link to `#usage-guidance` -- reads it where they are.
 *
 * @param {Conf} conf
 */
function guidance(conf) {
  return cgVariant(conf) === "draft" ? draftGuidance() : repeatedNotice(conf);
}

/** @param {Conf} conf */
function usageGuidance(conf) {
  return html`<section class="box box--head introductory">
    <h2 id="usage-guidance">Usage guidance</h2>
    ${guidance(conf)}
  </section>`;
}

/** @param {Conf} conf */
export function run(conf) {
  if (!isCGSpec(conf)) return;

  if (cgVariant(conf) !== "unmaintained") {
    document.body.append(getInvolved(conf));
  }
  document.body.append(usageGuidance(conf));
}
