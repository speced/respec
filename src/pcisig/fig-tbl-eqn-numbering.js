// Module pcisig/fig-tbl-eqn-numbering
// Find figure numbers and adjust them to include the chapter number.
// Edit the Table of Figures as well.
// This happens as a distinct pass for two reasons:
// 1. core/figures runs before core/structure and thus doesn't know Chapter and Appendix numbers
// 2. A second pass means that this plugin is not part of the src/core.

import { pub } from "../core/pubsubhub.js";

export const name = "pcisig/fig-tbl-eqn-numbering";

export function run(conf, doc, cb) {
  if (conf.numberByChapter) {
    let $secs = $("body > section[data-secno]", doc);
    let figNumMap = new Map();
    let tblNumMap = new Map();
    let eqnNumMap = new Map();
    for (let i = 0; i < $secs.length; i++) {
      let $sec = $($secs[i], doc);
      let secno = $sec.attr("data-secno");
      let first;

      // Process Figure Captions, populating figNumMap
      first = 0;
      $("figcaption > span.figno", $sec).each(function () {
          let $figno_elem = $(this);
          let figno = parseInt($figno_elem.text(), 10);
          if (first === 0) first = figno;
          let new_figno = secno + "-" + (figno - first + 1);
          figNumMap.set(figno, new_figno);
          $figno_elem.text(new_figno);
        }
      );

      // Process Table Captions, populating tblNumMap
      first = 0;
      $("caption > span.tblno", $sec).each(function () {
          let $tblno_elem = $(this);
          let tblno = parseInt($tblno_elem.text(), 10);
          if (first === 0) first = tblno;
          let new_tblno = secno + "-" + (tblno - first + 1);
          tblNumMap.set(tblno, new_tblno);
          $tblno_elem.text(new_tblno);
        }
      );

      // Process Eqnure Captions, populating eqnNumMap
      first = 0;
      $("figcaption > span.eqnno", $sec).each(function () {
          let $eqnno_elem = $(this);
          let eqnno = parseInt($eqnno_elem.text(), 10);
          if (first === 0) first = eqnno;
          let new_eqnno = secno + "-" + (eqnno - first + 1);
          eqnNumMap.set(eqnno, new_eqnno);
          $eqnno_elem.text(new_eqnno);
        }
      );
    }

    // Convert Figure References using figNumMap
    $("a.fig-ref > span.figno", doc).each(function () {
      let old_num = parseInt($(this).text(), 10);
      if (figNumMap.has(old_num)) {
        $(this).text(figNumMap.get(old_num));
      }
    });
    // Convert List of Figures using figNumMap
    $("li.tofline > a.tocxref > span.figno", doc).each(function () {
      let old_num = parseInt($(this).text(), 10);
      if (figNumMap.has(old_num)) {
        $(this).text(figNumMap.get(old_num));
      }
    });

    // Convert Table References using tblNumMap
    $("a.tbl-ref > span.tblno", doc).each(function () {
      let old_num = parseInt($(this).text(), 10);
      if (tblNumMap.has(old_num)) {
        $(this).text(tblNumMap.get(old_num));
      }
    });
    // Convert List of Tables using tblNumMap
    $("li.totline > a.tocxref > span.tblno", doc).each(function () {
      let old_num = parseInt($(this).text(), 10);
      if (tblNumMap.has(old_num)) {
        $(this).text(tblNumMap.get(old_num));
      }
    });

    // Convert Equation References using eqnNumMap
    $("a.eqn-ref > span.eqnno", doc).each(function () {
      let old_num = parseInt($(this).text(), 10);
      if (eqnNumMap.has(old_num)) {
        $(this).text(eqnNumMap.get(old_num));
      }
    });
    // Convert List of Equations using eqnNumMap
    $("li.toeline > a.tocxref > span.eqnno", doc).each(function () {
      let old_num = parseInt($(this).text(), 10);
      if (eqnNumMap.has(old_num)) {
        $(this).text(eqnNumMap.get(old_num));
      }
    });
  }
  cb();
}
