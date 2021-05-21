// @ts-check
import { getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";
import showLink from "../../core/templates/show-link.js";
import showLogo from "../../core/templates/show-logo.js";
import showPeople from "../../core/templates/show-people.js";

const localizationStrings = {
  en: {
    author: "Author:",
    authors: "Authors:",
    editor: "Editor:",
    editors: "Editors:",
    former_editor: "Former editor:",
    former_editors: "Former editors:",
    latest_editors_draft: "Latest editor's draft:",
    latest_published_version: "Latest approved version:",
    this_version: "This version:",
    issue_tracker: "Issue Tracker:",
  },
};

export const l10n = getIntlData(localizationStrings);

function getSpecSubTitleElem(conf) {
  let specSubTitleElem = document.querySelector("h2#subtitle");

  if (specSubTitleElem && specSubTitleElem.parentElement) {
    specSubTitleElem.remove();
    conf.subtitle = specSubTitleElem.textContent.trim();
  } else if (conf.subtitle) {
    specSubTitleElem = document.createElement("h2");
    specSubTitleElem.textContent = conf.subtitle;
    specSubTitleElem.id = "subtitle";
  }
  if (specSubTitleElem) {
    specSubTitleElem.classList.add("subtitle");
  }
  return specSubTitleElem;
}

export default conf => {
  return html`<div class="head">
    ${conf.specStatus !== "PD" ? conf.logos.map(showLogo) : ""}
    ${document.querySelector("h1#title")} ${getSpecSubTitleElem(conf)}
    <h2>
      ${conf.textStatus} -
      <time class="dt-published" datetime="${conf.dashDate}"
        >${conf.publishHumanDate}</time
      >
    </h2>
    <dl>
      <dt>${l10n.this_version}</dt>
      <dd>
        <a class="u-url" href="${conf.thisVersion}">${conf.thisVersion}</a>
      </dd>
      <dt>${l10n.issue_tracker}</dt>
      <dd>
        <a class="u-url" href="${conf.issueTracker}">${conf.issueTracker}</a>
      </dd>
      <dt>${conf.multipleEditors ? l10n.editors : l10n.editor}</dt>
      ${showPeople(conf, "editors")}
      ${Array.isArray(conf.formerEditors) && conf.formerEditors.length > 0
        ? html`
            <dt>
              ${conf.multipleFormerEditors
                ? l10n.former_editors
                : l10n.former_editor}
            </dt>
            ${showPeople(conf, "formerEditors")}
          `
        : ""}
      ${conf.authors
        ? html`
            <dt>${conf.multipleAuthors ? l10n.authors : l10n.author}</dt>
            ${showPeople(conf, "authors")}
          `
        : ""}
      ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
    </dl>
    ${renderCopyright(conf)}
    <hr />
  </div>`;
};

function renderCopyright(conf) {
  // If there is already a copyright, let's relocate it.
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) {
    existingCopyright.remove();
    return existingCopyright;
  }
  return html`<p class="copyright">
    Copyright ${conf.publishYear},
    <a href="https://www.w3.org/"
      ><abbr title="The Alliance for Open Media">AOM</abbr></a
    ><br />
    Licensing information is available at http://aomedia.org/license/<br />
    The MATERIALS ARE PROVIDED “AS IS.” The Alliance for Open Media, its
    members,and its contributors expressly disclaim any warranties (express,
    implied, or otherwise), including implied warranties of merchantability,
    non-infringement, fitness for a particular purpose, or title, related to the
    materials. The entire risk as to implementing or otherwise using the
    materials is assumed by the implementer and user. IN NO EVENT WILL THE
    ALLIANCE FOR OPEN MEDIA, ITS MEMBERS, OR CONTRIBUTORS BE LIABLE TO ANY OTHER
    PARTY FOR LOST PROFITS OR ANY FORM OF INDIRECT, SPECIAL, INCIDENTAL, OR
    CONSEQUENTIAL DAMAGES OF ANY CHARACTER FROM ANY CAUSES OF ACTION OF ANY KIND
    WITH RESPECT TO THIS DELIVERABLE OR ITS GOVERNING AGREEMENT, WHETHER BASED
    ON BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, AND
    WHETHER OR NOT THE OTHER MEMBER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
    DAMAGE.
  </p>`;
}
