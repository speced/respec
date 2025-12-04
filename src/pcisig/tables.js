// Module core/table
// Handles tables in the document.
// This is to enable the generation of a Table of Tables wherever there is a #tot element
// to be found as well as normalise the titles of tables.

import { pub } from "../core/pubsubhub.js";

export const name = "core/tables";

export function run(conf, doc, cb) {

  // process all tables
  let tblMap = {},
    tot = [],
    num = 0;
  $("table > caption").each(function () {
    // set proper caption title
    let $cap = $(this),
      tit = $cap.text(),
      id = $cap.parent().makeID("tbl", tit);
    num++;
    $cap
      .wrapInner($("<span class='tbl-title'/>"))
      .prepend($("<span class='tbl-title-decoration'>&nbsp;</span>"))
      .prepend($("<span class='tblno'>" + num + "</span>"))
      .prepend($("<span class='tbl-tblno-decoration'>" + conf.l10n.tbl + "&nbsp;</span>"));
    tblMap[id] = $cap.contents();
    let $totCap = $cap.clone();
    $totCap.find("a").renameElement("span").attr("class", "formerLink").removeAttr("href");
    $totCap.find("dfn").renameElement("span");
    $totCap.find("[id]").removeAttr("id");
    $totCap.find("span.footnote").remove();   // footnotes are in the caption, not #tot
    $totCap.find("span.issue").remove();      // issues are in the caption, not #tot
    $totCap.find("span.respec-error").remove(); // errors are in the caption, not #tot
    $totCap.find("span.noToc").remove();      // explicitly not in #tot
    tot.push(
      $("<li class='totline'><a class='tocxref' href='#" + id + "'></a></li>")
        .find(".tocxref")
        .append($totCap.contents())
        .end()
    );

  });


  // Update all anchors with empty content that reference a table ID
  $("a[href]", doc).each(function () {
    let $a = $(this),
      id = $a.attr("href");
    if (!id) return;
    id = id.substring(1);
    if (tblMap[id]) {
      $a.addClass("tbl-ref");
      if ($a.html() === "") {
        let ref = tblMap[id].clone();
        ref.find("a").renameElement("span").attr("class", "formerLink").removeAttr("href");
        ref.find("dfn").renameElement("span");
        ref.find("[id]").removeAttr("id");
        ref.find("span.footnote").remove();   // footnotes are in the caption, not references
        ref.find("span.issue").remove();      // issues are in the caption, not references
        ref.find("span.respec-error").remove(); // errors are in the caption, not references
        ref.find("span.noToc").remove();      // explicitly not in refs
        $a.append(ref);
      }
    }
  });

  // Create a Table of Tables if a section with id 'tot' exists.
  let $tot = $("#tot", doc);
  if (tot.length && $tot.length) {
    // if it has a parent section, don't touch it
    // if it has a class of appendix or introductory, don't touch it
    // if all the preceding section siblings are introductory, make it introductory
    // if there is a preceding section sibling which is an appendix, make it appendix
    if (
      !$tot.hasClass("appendix") &&
      !$tot.hasClass("introductory") &&
      !$tot.parents("section").length
    ) {
      if (
        $tot.prevAll("section.introductory").length ===
        $tot.prevAll("section").length
      ) {
        $tot.addClass("introductory");
      } else if ($tot.prevAll("appendix").length) {
        $tot.addClass("appendix");
      }
    }
    $tot.append($("<h2>" + conf.l10n.table_of_tbl + "</h2>"));
    $tot.append($("<ul class='tot'/>"));
    let $ul = $tot.find("ul");
    while (tot.length) $ul.append(tot.shift());
  }
  cb();
}
