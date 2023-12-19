// @ts-check
import { W3CDate, getIntlData, htmlJoinAnd } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";
import { status2track } from "../headers.js";
const localizationStrings = {
  en: {
    sotd: "Status of This Document",
    status_at_publication: html`This section describes the status of this
      document at the time of its publication. A list of current W3C
      publications and the latest revision of this technical report can be found
      in the <a href="https://www.w3.org/TR/">W3C technical reports index</a> at
      https://www.w3.org/TR/.`,
  },
  ko: {
    sotd: "현재 문서의 상태",
    status_at_publication: html`이 부분은 현재 문서의 발행 당시 상태에 대해
      기술합니다. W3C 발행 문서의 최신 목록 및 테크니컬 리포트 최신판을
      https://www.w3.org/TR/ 의
      <a href="https://www.w3.org/TR/">W3C technical reports index</a> 에서
      열람할 수 있습니다.`,
  },
  zh: {
    sotd: "关于本文档",
    // eslint-disable-next-line prettier/prettier
    status_at_publication: html`本章节描述了本文档的发布状态。W3C的文档列表和最新版本可通过<a href="https://www.w3.org/TR/">W3C技术报告</a>索引访问。`,
  },
  ja: {
    sotd: "この文書の位置付け",
    status_at_publication: html`この節には、公開時点でのこの文書の位置づけが記されている。現時点でのW3Cの発行文書とこのテクニカルレポートの最新版は、下記から参照できる。
      <a href="https://www.w3.org/TR/">W3C technical reports index</a>
      (https://www.w3.org/TR/)`,
  },
  nl: {
    sotd: "Status van dit document",
  },
  es: {
    sotd: "Estado de este Document",
    status_at_publication: html`Esta sección describe el estado del presente
      documento al momento de su publicación. Una lista de las publicaciones
      actuales del W3C y la última revisión del presente informe técnico puede
      hallarse en http://www.w3.org/TR/
      <a href="https://www.w3.org/TR/">el índice de informes técnicos</a> del
      W3C.`,
  },
  de: {
    sotd: "Status dieses Dokuments",
    status_at_publication: html`Dieser Abschnitt beschreibt den Status des
      Dokuments zum Zeitpunkt der Publikation. Eine Liste der aktuellen
      Publikatinen des W3C und die aktuellste Fassung dieser Spezifikation kann
      im <a href="https://www.w3.org/TR/">W3C technical reports index</a> unter
      https://www.w3.org/TR/ abgerufen werden.`,
  },
};

export const l10n = getIntlData(localizationStrings);

const processLink = "https://www.w3.org/2023/Process-20231103/";

function prefix(word) {
  return /^[aeiou]/i.test(word) ? `an ${word}` : `a ${word}`;
}

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
              <p><em>${l10n.status_at_publication}</em></p>
              ${conf.isMemberSubmission
                ? noteForSubmission(conf, opts)
                : html`
                    ${!conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                    ${!conf.overrideStatus
                      ? html` ${linkToWorkingGroup(conf)} `
                      : ""}
                    ${conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                    ${conf.isRec ? renderIsRec(conf) : renderNotRec(conf)}
                    ${renderDeliverer(conf)}
                    <p>
                      This document is governed by the
                      <a id="w3c_process_revision" href="${processLink}"
                        >03 November 2023 W3C Process Document</a
                      >.
                    </p>
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
  let statusExplanation = null;
  let reviewPolicy = null;
  let endorsement = html`Publication as ${prefix(conf.textStatus)} does not
  imply endorsement by W3C and its Members.`;
  let updatePolicy = html`<p>
    This is a draft document and may be updated, replaced or obsoleted by other
    documents at any time. It is inappropriate to cite this document as other
    than work in progress.
    ${conf.updateableRec
      ? html`Future updates to this specification may incorporate
          <a href="${processLink}#allow-new-features">new features</a>.`
      : ""}
  </p>`;
  if (conf.specStatus === "DISC") {
    updatePolicy = html`<p>
      Publication as a Discontinued Draft implies that this document is no
      longer intended to advance or to be maintained. It is inappropriate to
      cite this document as other than abandoned work.
    </p>`;
  }
  const lsUpdatePolicy = html`<p>
    This document is maintained and updated at any time. Some parts of this
    document are work in progress.
  </p>`;
  switch (conf.specStatus) {
    case "STMT":
      endorsement = html`<p>
        A W3C Statement is a specification that, after extensive
        consensus-building, has received the endorsement of the
        <abbr title="World Wide Web Consortium">W3C</abbr> and its Members.
      </p>`;
      break;
    case "RY":
      endorsement = html`<p>W3C recommends the wide usage of this registry.</p>
        <p>
          A W3C Registry is a specification that, after extensive
          consensus-building, has received the endorsement of the
          <abbr title="World Wide Web Consortium">W3C</abbr> and its Members.
        </p>`;
      break;
    case "CRD":
      statusExplanation = html`A Candidate Recommendation Draft integrates
      changes from the previous Candidate Recommendation that the Working Group
      intends to include in a subsequent Candidate Recommendation Snapshot.`;
      if (conf.pubMode === "LS") {
        updatePolicy = lsUpdatePolicy;
      }
      break;
    case "CRYD":
      statusExplanation = html`A Candidate Registry Draft integrates changes
      from the previous Candidate Registry Snapshot that the Working Group
      intends to include in a subsequent Candidate Registry Snapshot.`;
      if (conf.pubMode === "LS") {
        updatePolicy = lsUpdatePolicy;
      }
      break;
    case "CRY":
      statusExplanation = html`A Candidate Registry Snapshot has received
        <a href="${processLink}#dfn-wide-review">wide review</a>.`;
      reviewPolicy = html`<p>
        The W3C Membership and other interested parties are invited to review
        the document and send comments through ${conf.humanPREnd}. Advisory
        Committee Representatives should consult their
        <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
          >WBS questionnaires</a
        >. Note that substantive technical comments were expected during the
        Candidate Recommendation review period that ended ${conf.humanCREnd}.
      </p>`;
      break;
    case "CR":
      statusExplanation = html`A Candidate Recommendation Snapshot has received
        <a href="${processLink}#dfn-wide-review">wide review</a>, is intended to
        gather
        <a href="${conf.implementationReportURI}">implementation experience</a>,
        and has commitments from Working Group members to
        <a href="https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements"
          >royalty-free licensing</a
        >
        for implementations.`;
      updatePolicy = html`${conf.updateableRec
        ? html`Future updates to this specification may incorporate
            <a href="${processLink}#allow-new-features">new features</a>.`
        : ""}`;
      if (conf.pubMode === "LS") {
        reviewPolicy = html`<p>
          Comments are welcome at any time but most especially before
          ${W3CDate.format(conf.crEnd)}.
        </p>`;
      } else {
        reviewPolicy = html`<p>
          This Candidate Recommendation is not expected to advance to Proposed
          Recommendation any earlier than ${W3CDate.format(conf.crEnd)}.
        </p>`;
      }
      break;
    case "PR":
      reviewPolicy = html`<p>
        The W3C Membership and other interested parties are invited to review
        the document and send comments through ${W3CDate.format(conf.prEnd)}.
        Advisory Committee Representatives should consult their
        <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
          >WBS questionnaires</a
        >. Note that substantive technical comments were expected during the
        Candidate Recommendation review period that ended
        ${W3CDate.format(conf.crEnd)}.
      </p>`;
      break;
    case "DNOTE":
      endorsement = html`${conf.textStatus}s are not endorsed by
        <abbr title="World Wide Web Consortium">W3C</abbr> nor its Members.`;
      break;
    case "NOTE":
      endorsement = html`This ${conf.textStatus} is endorsed by
        ${getWgHTML(conf)}, but is not endorsed by
        <abbr title="World Wide Web Consortium">W3C</abbr> itself nor its
        Members.`;
      break;
  }
  return html`<p>${endorsement} ${statusExplanation}</p>
    ${updatePolicy} ${reviewPolicy}`;
}

function renderIsRec(conf) {
  const { updateableRec, revisionTypes = [], revisedRecEnd } = conf;
  let reviewTarget = "";
  if (revisionTypes.includes("proposed-addition")) {
    reviewTarget = "additions";
  } else if (revisionTypes.includes("proposed-correction")) {
    reviewTarget = "corrections";
  }
  return html`
    <p>
      W3C recommends the wide deployment of this specification as a standard for
      the Web.
    </p>

    <p>
      A W3C Recommendation is a specification that, after extensive
      consensus-building, is endorsed by
      <abbr title="World Wide Web Consortium">W3C</abbr> and its Members, and
      has commitments from Working Group members to
      <a href="https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements"
        >royalty-free licensing</a
      >
      for implementations.
      ${updateableRec
        ? html`Future updates to this Recommendation may incorporate
            <a href="${processLink}#allow-new-features">new features</a>.`
        : ""}
    </p>
    ${revisionTypes.includes("addition")
      ? html`<p class="addition">
          Candidate additions are marked in the document.
        </p>`
      : ""}
    ${revisionTypes.includes("correction")
      ? html`<p class="correction">
          Candidate corrections are marked in the document.
        </p>`
      : ""}
    ${revisionTypes.includes("proposed-addition")
      ? html`<p class="addition proposed">
          Proposed additions are marked in the document.
        </p>`
      : ""}
    ${revisionTypes.includes("proposed-correction")
      ? html`<p class="correction proposed">
          Proposed corrections are marked in the document.
        </p>`
      : ""}
    ${reviewTarget
      ? html`<p>
          The W3C Membership and other interested parties are invited to review
          the proposed ${reviewTarget} and send comments through
          ${W3CDate.format(revisedRecEnd)}. Advisory Committee Representatives
          should consult their
          <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
            >WBS questionnaires</a
          >.
        </p>`
      : ""}
  `;
}

function renderDeliverer(conf) {
  const {
    isNote,
    isRegistry,
    wgId,
    multipleWGs,
    wgPatentHTML,
    wgPatentURI,
    wgPatentPolicy,
  } = conf;

  const patentPolicyURL =
    wgPatentPolicy === "PP2017"
      ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
      : "https://www.w3.org/Consortium/Patent-Policy/";

  const producers = !(isNote || isRegistry)
    ? html`
        This document was produced by ${multipleWGs ? "groups" : "a group"}
        operating under the
        <a href="${patentPolicyURL}"
          >${wgPatentPolicy === "PP2017" ? "1 August 2017 " : ""}W3C Patent
          Policy</a
        >.
      `
    : html`
        The
        <a href="${patentPolicyURL}"
          >${wgPatentPolicy === "PP2017" ? "1 August 2017 " : ""}W3C Patent
          Policy</a
        >
        does not carry any licensing requirements or commitments on this
        document.
      `;
  return html`<p data-deliverer="${isNote || isRegistry ? wgId : null}">
    ${producers}
    ${!(isNote || isRegistry)
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
  </p>`;
}

function noteForSubmission(conf, opts) {
  return html`
    ${opts.additionalContent}
    ${conf.isMemberSubmission ? noteForMemberSubmission(conf) : ""}
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
  let changes = null;
  if (conf.isRec && conf.revisionTypes && conf.revisionTypes.length) {
    const pa = conf.revisionTypes.includes("proposed-addition");
    const pc = conf.revisionTypes.includes("proposed-correction");
    const ca = conf.revisionTypes.includes("addition");
    const cc = conf.revisionTypes.includes("correction");
    if ((pa && pc) || (ca && cc)) {
      changes = html`It includes
      ${pa
        ? html`<a href="${processLink}#proposed-amendments">
            proposed amendments</a
          >`
        : html`<a href="${processLink}#candidate-amendments">
            candidate amendments</a
          >`},
      introducing substantive changes and new features since the previous
      Recommendation.`;
    } else if (pa || ca) {
      changes = html`It includes
      ${pa
        ? html`<a href="${processLink}#proposed-addition">
            proposed additions</a
          >`
        : html`<a href="${processLink}#candidate-addition">
            candidate additions</a
          >`},
      introducing new features since the previous Recommendation.`;
    } else if (pc || cc) {
      changes = html`It includes
      ${pc
        ? html`<a href="${processLink}#proposed-correction">
            proposed corrections</a
          >`
        : html`<a href="${processLink}#candidate-correction">
            candidate corrections</a
          >`}.`;
    }
  }
  const track = status2track[conf.specStatus]
    ? html` using the
        <a href="${processLink}#recs-and-notes"
          >${status2track[conf.specStatus]} track</a
        >`
    : "";
  return html`<p>
    This document was published by ${getWgHTML(conf)} as
    ${prefix(conf.longStatus)}${track}. ${changes}
  </p>`;
}

function getWgHTML(conf) {
  if (Array.isArray(conf.wg)) {
    return htmlJoinAnd(conf.wg, (wg, idx) => {
      return html`the <a href="${conf.wgURI[idx]}">${wg}</a>`;
    });
  } else if (conf.wg) {
    return html`the <a href="${conf.wgURI}">${conf.wg}</a>`;
  }
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
