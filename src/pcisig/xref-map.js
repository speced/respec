/*globals define*/
/*jshint browser:true, jquery:true, laxcomma:true */

// Module core/structure
//  Handles producing the ToC and numbering sections across the document.

// CONFIGURATION:
//  - noTOC: if set to true, no TOC is generated and sections are not numbered
//  - tocIntroductory: if set to true, the introductory material is listed in the TOC
//  - lang: can change the generated text (supported: en, fr)
//  - maxTocLevel: only generate a TOC so many levels deep
import { pub } from "../core/pubsubhub.js";

export const name = "pcisig/xref-map";

export function run(conf, doc, cb) {

  if (conf.addXrefMap) {
    let $refs = $("a.tocxref", doc);
    if ($refs.length > 0) {
      let $mapsec = $("<section id='xref-map' class='introductory appendix'><h2>Section, Figure, Table, and Equation ID Map</h2></section>").appendTo($("body"));
      let $tbody = $("<table class='data'><thead><tr><th>Number</th><th>Name</th><th>ID</th></tr></thead><tbody/></table>").appendTo($mapsec).children("tbody");

      $refs.each(function () {
        let number = ($(".secno, .figno, .tblno, .eqnno", this).text()
          .replace(/ /g, "&nbsp;").replace(/-/g, "&#8209;"));
        let id = $(this).attr("href");
        let name = $(".sect-title, .fig-title, .tbl-title, .eqn-title", this).text();
        $("<tr><td>" + number + "</td>" +
          "<td class='long'>" + name + "</td>" +
          "<td class='long'><a href=\"" + id + "\">" + id.substr(1) + "</a></td></tr>").appendTo($tbody);
      });
    }
  }
  cb();
}
