// Module core/structure
//  Handles producing the ToC and numbering sections across the document.

// LIMITATION:
//  At this point we don't support having more than 26 appendices.
// CONFIGURATION:
//  - noTOC: if set to true, no TOC is generated and sections are not numbered
//  - tocIntroductory: if set to true, the introductory material is listed in the TOC
//  - lang: can change the generated text (supported: en, fr)
//  - maxTocLevel: only generate a TOC so many levels deep

import { addId, parents, renameElement } from "./utils";
import hyperHTML from "../deps/hyperhtml";

const secMap = {};
let appendixMode = false;
let lastNonAppendix = 0;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const name = "core/structure";

function makeTOCAtLevel($parent, doc, current, level, conf) {
  const $secs = $parent.children(
    conf.tocIntroductory ? "section" : "section:not(.introductory)"
  );
  if ($secs.length === 0) {
    return null;
  }
  const $ol = $("<ol class='toc'></ol>");
  for (let i = 0; i < $secs.length; i++) {
    const $sec = $($secs[i], doc);
    const isIntro = $sec.hasClass("introductory");
    const noToc = $sec.hasClass("notoc");
    if (!$sec.children().length || noToc) {
      continue;
    }
    const h = $sec.children()[0];
    const ln = h.localName.toLowerCase();
    if (
      ln !== "h2" &&
      ln !== "h3" &&
      ln !== "h4" &&
      ln !== "h5" &&
      ln !== "h6"
    ) {
      continue;
    }
    const title = h.textContent;
    const $kidsHolder = $("<div></div>").append(
      $(h)
        .contents()
        .clone()
    );
    $kidsHolder
      .find("a")
      .renameElement("span")
      .attr("class", "formerLink")
      .removeAttr("href");
    $kidsHolder
      .find("dfn")
      .renameElement("span")
      .removeAttr("id");
    const id = h.id ? h.id : $sec.makeID(null, title);

    if (!isIntro) {
      current[current.length - 1]++;
    }
    const secnos = current.slice();
    if ($sec.hasClass("appendix") && current.length === 1 && !appendixMode) {
      lastNonAppendix = current[0];
      appendixMode = true;
    }
    if (appendixMode) {
      secnos[0] = alphabet.charAt(current[0] - lastNonAppendix);
    }
    let secno = secnos.join(".");
    const isTopLevel = secnos.length == 1;
    if (isTopLevel) {
      secno = secno + ".";
      // if this is a top level item, insert
      // an OddPage comment so html2ps will correctly
      // paginate the output
      $(h).before(document.createComment("OddPage"));
    }
    const $span = $("<span class='secno'></span>").text(secno + " ");
    if (!isIntro) {
      $(h).prepend($span);
    }
    secMap[id] =
      (isIntro ? "" : "<span class='secno'>" + secno + "</span> ") +
      "<span class='sec-title'>" +
      title +
      "</span>";

    const $a = $("<a/>")
      .attr({ href: "#" + id, class: "tocxref" })
      .append(isIntro ? "" : $span.clone())
      .append($kidsHolder.contents());
    const $item = $("<li class='tocline'/>").append($a);
    if (conf.maxTocLevel === 0 || level <= conf.maxTocLevel) $ol.append($item);
    current.push(0);
    const $sub = makeTOCAtLevel($sec, doc, current, level + 1, conf);
    if ($sub) {
      $item.append($sub);
    }
    current.pop();
  }
  return $ol;
}

export function run(conf) {
  if ("tocIntroductory" in conf === false) {
    conf.tocIntroductory = false;
  }
  if ("maxTocLevel" in conf === false) {
    conf.maxTocLevel = 0;
  }

  renameSectionHeaders();

  // makeTOC
  if (!conf.noTOC) {
    createTableOfContents(conf);
  }

  updateEmptyAnchors();
}

function renameSectionHeaders() {
  const headers = getNonintroductorySectionHeaders();
  if (!headers.length) {
    return;
  }
  headers.forEach(header => {
    const depth = Math.min(parents(header, "section").length + 1, 6);
    const h = "h" + depth;
    if (header.localName !== h) {
      renameElement(header, h);
    }
  });
}

function getNonintroductorySectionHeaders() {
  const headerSelector = ["h1", "h2", "h3", "h4", "h5", "h6"]
    .map(h => `section:not(.introductory) ${h}:first-child`)
    .join(",");
  return [...document.querySelectorAll(headerSelector)].filter(
    elem => !elem.closest("section.introductory")
  );
}

function createTableOfContents(conf) {
  const $ol = makeTOCAtLevel($("body"), document, [0], 1, conf);
  if (!$ol) {
    return;
  }
  const nav = hyperHTML`<nav id="toc">`;
  const h2 = hyperHTML`<h2 class="introductory">${conf.l10n.toc}</h2>`;
  addId(h2);
  nav.append(h2, $ol[0]);
  const ref =
    document.getElementById("toc") ||
    document.getElementById("sotd") ||
    document.getElementById("abstract");
  if (ref) {
    if (ref.id === "toc") {
      ref.replaceWith(nav);
    } else {
      ref.after(nav);
    }
  }

  const link = hyperHTML`<p role='navigation' id='back-to-top'><a href='#title'><abbr title='Back to Top'>&uarr;</abbr></a></p>`;
  document.body.append(link);
}

/**
 * Update all anchors with empty content that reference a section ID
 */
function updateEmptyAnchors() {
  document.querySelectorAll("a[href^='#']:not(.tocxref)").forEach(anchor => {
    if (anchor.innerHTML !== "") {
      return;
    }
    const id = anchor.getAttribute("href").slice(1);
    if (secMap[id]) {
      anchor.classList.add("sec-ref");
      const prefix = anchor.classList.contains("sectionRef") ? "section " : "";
      anchor.innerHTML = prefix + secMap[id];
    }
  });
}
