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
    ${conf.isUnofficial
      ? renderIsUnofficial(opts)
      : conf.isTagFinding
      ? opts.additionalContent
      : conf.isNoTrack
      ? renderIsNoTrack(conf, opts)
      : html`
          <p><em>${conf.l10n.status_at_publication}</em></p>
          ${conf.isSubmission
            ? noteForSubmission(conf, opts)
            : html`
                ${!conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                ${!conf.overrideStatus
                  ? html`
                      ${linkToWorkingGroup(conf)} ${linkToCommunity(conf, opts)}
                    `
                  : ""}
                ${conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                ${conf.isRec ? renderIsRec(conf) : renderNotRec(conf)}
                ${renderDeliverer(conf)}
                <p>
                  This document is governed by the
                  <a
                    id="w3c_process_revision"
                    href="https://www.w3.org/2020/Process-20200915/"
                    >15 September 2020 W3C Process Document</a
                  >.
                </p>
                ${conf.addPatentNote
                  ? html`<p>${[conf.addPatentNote]}</p>`
                  : ""}
              `}
        `}
    ${opts.additionalSections}
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

function renderIsUnofficial(opts) {
  const { additionalContent } = opts;
  return html`
    <p>
      This document is a draft of a potential specification. It has no official
      standing of any kind and does not represent the support or consensus of
      any standards organization.
    </p>
    ${additionalContent}
  `;
}

function renderIsNoTrack(conf, opts) {
  const { isMO } = conf;
  const { additionalContent } = opts;
  return html`
    <p>
      This document is merely a W3C-internal
      ${isMO ? "member-confidential" : ""} document. It has no official standing
      of any kind and does not represent consensus of the W3C Membership.
    </p>
    ${additionalContent}
  `;
}

function renderNotRec(conf) {
  let statusExplanation = "";
  let updatePolicy = html`This is a draft document and may be updated, replaced
  or obsoleted by other documents at any time. It is inappropriate to cite this
  document as other than work in progress.
  ${conf.updateableRec
    ? html`Future updates to this specification may incorporate
        <a href="https://www.w3.org/2020/Process-20200915/#allow-new-features"
          >new features</a
        >.`
    : ""}`;
  let reviewPolicy = "";
  if (conf.specStatus === "CRD") {
    statusExplanation =
      "A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.";
    if (conf.pubMode === "LS") {
      updatePolicy =
        "This document is maintained and updated at any time. Some parts of this document are work in progress. ";
    }
  } else if (conf.specStatus === "CR") {
    statusExplanation = html`A Candidate Recommendation Snapshot has received
      <a href="https://www.w3.org/2020/Process-20200915/#dfn-wide-review"
        >wide review</a
      >
      and is intended to gather
      <a href="${conf.implementationReportURI}">implementation experience</a>.`;
    updatePolicy = html`${conf.updateableRec
      ? html`Future updates to this specification may incorporate
          <a href="https://www.w3.org/2020/Process-20200915/#allow-new-features"
            >new features</a
          >.`
      : ""}`;
    if (conf.pubMode === "LS") {
      reviewPolicy = `Comments are welcome at any time but most especially before ${conf.humanCREnd}.`;
    } else {
      reviewPolicy = `This Candidate Recommendation is not expected to advance to Proposed Recommendation any earlier than ${conf.humanCREnd}.`;
    }
  } else if (conf.isPR) {
    reviewPolicy = html` The W3C Membership and other interested parties are
      invited to review the document and send comments through
      ${conf.humanPREnd}. Advisory Committee Representatives should consult
      their
      <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
        >WBS questionnaires</a
      >. Note that substantive technical comments were expected during the
      Candidate Recommendation review period that ended ${conf.humanCREnd}.`;
  } else if (conf.isPER) {
    reviewPolicy = html` W3C Advisory Committee Members are invited to send
      formal review comments on this Proposed Edited Recommendation to the W3C
      Team until ${conf.humanPEREnd}. Members of the Advisory Committee will
      find the appropriate review form for this document by consulting their
      list of current
      <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
        >WBS questionnaires</a
      >.`;
  }
  return html`<p>
      Publication as ${conf.anOrA} ${conf.textStatus} does not imply endorsement
      by the W3C Membership. ${statusExplanation}
    </p>
    ${updatePolicy ? html`<p>${updatePolicy}</p>` : ""}
    <p>${reviewPolicy}</p>`;
}

function renderIsRec({
  updateableRec,
  revisionTypes = [],
  humanRevisedRecEnd,
}) {
  let reviewTarget = "";
  if (revisionTypes.includes("addition")) {
    reviewTarget = "additions";
  }
  if (revisionTypes.includes("correction") && !reviewTarget) {
    reviewTarget = "corrections";
  }
  return html`<p>
      A W3C Recommendation is a specification that, after extensive
      consensus-building, has received the endorsement of the W3C and its
      Members. W3C recommends the wide deployment of this specification as a
      standard for the Web.
      ${updateableRec
        ? html`Future updates to this Recommendation may incorporate
            <a
              href="https://www.w3.org/2020/Process-20200915/#allow-new-features"
              >new features</a
            >.`
        : ""}
    </p>
    ${revisionTypes.includes("addition")
      ? html`<p class="addition">
          Proposed additions are marked in the document.
        </p>`
      : ""}
    ${revisionTypes.includes("correction")
      ? html`<p class="correction">
          Proposed corrections are marked in the document.
        </p>`
      : ""}
    ${reviewTarget
      ? html`<p>
          The W3C Membership and other interested parties are invited to review
          the proposed ${reviewTarget} and send comments through
          ${humanRevisedRecEnd}. Advisory Committee Representatives should
          consult their
          <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
            >WBS questionnaires</a
          >.
        </p>`
      : ""} `;
}

function renderDeliverer(conf) {
  const {
    isNote,
    wgId,
    isIGNote,
    multipleWGs,
    recNotExpected,
    wgPatentHTML,
    wgPatentURI,
    charterDisclosureURI,
    wgPatentPolicy,
  } = conf;

  const patentPolicyURL =
    wgPatentPolicy === "PP2017"
      ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
      : "https://www.w3.org/Consortium/Patent-Policy/";

  const producers = !isIGNote
    ? html`
        This document was produced by ${multipleWGs ? "groups" : "a group"}
        operating under the
        <a href="${patentPolicyURL}"
          >${wgPatentPolicy === "PP2017" ? "1 August 2017 " : ""}W3C Patent
          Policy</a
        >.
      `
    : "";
  const wontBeRec = recNotExpected
    ? `The ${
        multipleWGs ? "groups do" : "group does"
      } not expect this document to become a W3C Recommendation.`
    : "";
  return html`<p data-deliverer="${isNote || isIGNote ? wgId : null}">
    ${producers} ${wontBeRec}
    ${!isNote && !isIGNote
      ? html`
          ${multipleWGs
            ? html` W3C maintains ${wgPatentHTML} `
            : html`
                W3C maintains a
                <a href="${[wgPatentURI]}" rel="disclosure"
                  >public list of any patent disclosures</a
                >
              `}
          made in connection with the deliverables of
          ${multipleWGs
            ? "each group; these pages also include"
            : "the group; that page also includes"}
          instructions for disclosing a patent. An individual who has actual
          knowledge of a patent which the individual believes contains
          <a href="${patentPolicyURL}#def-essential">Essential Claim(s)</a>
          must disclose the information in accordance with
          <a href="${patentPolicyURL}#sec-Disclosure"
            >section 6 of the W3C Patent Policy</a
          >.
        `
      : ""}
    ${isIGNote
      ? html`
          The disclosure obligations of the Participants of this group are
          described in the
          <a href="${charterDisclosureURI}">charter</a>.
        `
      : ""}
  </p>`;
}

function noteForSubmission(conf, opts) {
  return html`
    ${opts.additionalContent}
    ${conf.isMemberSubmission
      ? noteForMemberSubmission(conf)
      : conf.isTeamSubmission
      ? noteForTeamSubmission(conf, opts)
      : ""}
  `;
}

function noteForMemberSubmission(conf) {
  const teamComment = `https://www.w3.org/Submission/${conf.publishDate.getUTCFullYear()}/${
    conf.submissionCommentNumber
  }/Comment/`;

  const patentPolicyURL =
    conf.wgPatentPolicy === "PP2017"
      ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
      : "https://www.w3.org/Consortium/Patent-Policy/";

  return html`<p>
    By publishing this document, W3C acknowledges that the
    <a href="${conf.thisVersion}">Submitting Members</a> have made a formal
    Submission request to W3C for discussion. Publication of this document by
    W3C indicates no endorsement of its content by W3C, nor that W3C has, is, or
    will be allocating any resources to the issues addressed by it. This
    document is not the product of a chartered W3C group, but is published as
    potential input to the
    <a href="https://www.w3.org/Consortium/Process">W3C Process</a>. A
    <a href="${teamComment}">W3C Team Comment</a> has been published in
    conjunction with this Member Submission. Publication of acknowledged Member
    Submissions at the W3C site is one of the benefits of
    <a href="https://www.w3.org/Consortium/Prospectus/Joining">
      W3C Membership</a
    >. Please consult the requirements associated with Member Submissions of
    <a href="${patentPolicyURL}#sec-submissions"
      >section 3.3 of the W3C Patent Policy</a
    >. Please consult the complete
    <a href="https://www.w3.org/Submission"
      >list of acknowledged W3C Member Submissions</a
    >.
  </p>`;
}

function noteForTeamSubmission(conf, opts) {
  return html`
    ${renderPublicList(conf, opts)}
    <p>
      Please consult the complete
      <a href="https://www.w3.org/TeamSubmission/">list of Team Submissions</a>.
    </p>
  `;
}

export function renderPublicList(conf, opts) {
  const { mailToWGPublicListWithSubject, mailToWGPublicListSubscription } =
    opts;
  const { wgPublicList, subjectPrefix } = conf;
  const archivesURL = `https://lists.w3.org/Archives/Public/${wgPublicList}/`;
  return html`<p>
    If you wish to make comments regarding this document, please send them to
    <a href="${mailToWGPublicListWithSubject}">${wgPublicList}@w3.org</a>
    (<a href="${mailToWGPublicListSubscription}">subscribe</a>,
    <a href="${archivesURL}">archives</a>)${subjectPrefix
      ? html` with <code>${subjectPrefix}</code> at the start of your email's
          subject`
      : ""}.
  </p>`;
}

function linkToWorkingGroup(conf) {
  if (!conf.wg) {
    return;
  }
  let proposedChanges = null;
  if (conf.isRec && conf.revisionTypes && conf.revisionTypes.length) {
    if (conf.revisionTypes.includes("addition")) {
      if (conf.revisionTypes.includes("correction")) {
        proposedChanges = html`It includes
          <a href="https://www.w3.org/2020/Process-20200915/#proposed-changes"
            >proposed changes</a
          >, introducing substantive changes and new features since the previous
          Recommentation.`;
      } else {
        proposedChanges = html`It includes
          <a href="https://www.w3.org/2020/Process-20200915/#proposed-addition"
            >proposed additions</a
          >, introducing new features since the previous Recommentation.`;
      }
    } else if (conf.revisionTypes.includes("correction")) {
      proposedChanges = html`It includes
        <a href="https://www.w3.org/2020/Process-20200915/#proposed-correction"
          >proposed corrections</a
        >.`;
    }
  }
  return html`<p>
    This document was published by ${conf.wgHTML} as ${conf.anOrA}
    ${conf.longStatus}. ${proposedChanges}
    ${conf.notYetRec
      ? "This document is intended to become a W3C Recommendation."
      : ""}
  </p>`;
}

export function linkToCommunity(conf, opts) {
  if (!conf.github && !conf.wgPublicList) {
    return;
  }
  return html`<p>
    ${conf.github
      ? html`
          <a href="${conf.issueBase}">GitHub Issues</a> are preferred for
          discussion of this specification.
        `
      : ""}
    ${conf.wgPublicList
      ? html`
          ${conf.github && conf.wgPublicList
            ? "Alternatively, you can send comments to our mailing list."
            : "Comments regarding this document are welcome."}
          Please send them to
          <a href="${opts.mailToWGPublicListWithSubject}"
            >${conf.wgPublicList}@w3.org</a
          >
          (<a href="${opts.mailToWGPublicListSubscription}">subscribe</a>,
          <a
            href="${`https://lists.w3.org/Archives/Public/${conf.wgPublicList}/`}"
            >archives</a
          >)${conf.subjectPrefix
            ? html` with <code>${conf.subjectPrefix}</code> at the start of your
                email's subject`
            : ""}.
        `
      : ""}
  </p>`;
}
