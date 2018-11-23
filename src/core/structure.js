// Module core/structure
//  Handles producing the ToC and numbering sections across the document.

// LIMITATION:
//  At this point we don't support having more than 26 appendices.
// CONFIGURATION:
//  - noTOC: if set to true, no TOC is generated and sections are not numbered
//  - tocIntroductory: if set to true, the introductory material is listed in the TOC
//  - lang: can change the generated text (supported: en, fr)
//  - maxTocLevel: only generate a TOC so many levels deep

const secMap = {};
let appendixMode = false;
let lastNonAppendix = 0;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const name = "core/structure";
import { addId } from "./utils";

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
  let $secs = $("section:not(.introductory)")
    .find("h1:first, h2:first, h3:first, h4:first, h5:first, h6:first")
    .toArray()
    .filter(elem => elem.closest("section.introductory") === null);
  $secs = $($secs);
  if (!$secs.length) {
    return;
  }
  $secs.each(function() {
    let depth = $(this).parents("section").length + 1;
    if (depth > 6) depth = 6;
    const h = "h" + depth;
    if (this.localName.toLowerCase() !== h) $(this).renameElement(h);
  });

  // makeTOC
  if (!conf.noTOC) {
    const $ol = makeTOCAtLevel($("body"), document, [0], 1, conf);
    if (!$ol) return;
    const nav = document.createElement("nav");
    nav.id = "toc";
    nav.innerHTML = `<h2 class="introductory">${conf.l10n.toc}</h2>`;
    addId(nav.querySelector("h2"));
    nav.appendChild($ol[0]);
    let $ref = $("#toc");
    let replace = false;
    if ($ref.length) {
      replace = true;
    }
    if (!$ref.length) {
      $ref = $("#sotd");
    }
    if (!$ref.length) {
      $ref = $("#abstract");
    }
    if (replace) {
      $ref.replaceWith(nav);
    } else {
      $ref.after(nav);
    }

    const $link = $(
      "<p role='navigation' id='back-to-top'><a href='#title'><abbr title='Back to Top'>&uarr;</abbr></a></p>"
    );
    $("body").append($link);
  }

  // Update all anchors with empty content that reference a section ID
  $("a[href^='#']:not(.tocxref)").each(function() {
    const $a = $(this);
    if ($a.html() !== "") return;
    const id = $a.attr("href").slice(1);
    if (secMap[id]) {
      $a.addClass("sec-ref");
      $a.html(($a.hasClass("sectionRef") ? "section " : "") + secMap[id]);
    }
  });
}
