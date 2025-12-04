// Module core/impnote
// Manages PCISIG Implementation Notes, including marking them up, numbering, inserting the title,
// and injecting the style sheet.
// These are elements with class "impnote".

import { pub } from "../core/pubsubhub.js";
import css from "./css/impnote.css.js";
//import { fetch as ghFetch, fetchIndex } from "core/github";
export const name = "pcisig/impnote";

export function run(conf, doc, cb) {
  function handleIssues($ins) {
    $(doc).find("head link").first().before($("<style/>").text(css));
    $ins.each(function (i, inno) {
      var $inno = $(inno),
        isImpNote = $inno.hasClass("impnote"),
        isFeatureAtRisk = $inno.hasClass("atrisk"),
        isInline = $inno.css("display") !== "block",
        report = {
          inline: isInline,
          content: $inno.html(),
        };
      report.type = "impnote";
      var impnoteid = $inno.makeID("impnote", $inno.attr("title"));
      // wrap
      if (!isInline) {
        var $div = $(
          "<div class='" +
          report.type +
          (isFeatureAtRisk ? " atrisk" : "") +
          "' id='" + impnoteid +
          "'></div>"
          ),
          $tit = $(
            "<div class='" + report.type + "-title'><span></span></div>"
          ),
          text = conf.l10n.impnote;
        report.title = $inno.attr("title");
        $tit.find("span").text(text);
        if (report.title) {
          $tit.append(
            $(
              "<span style='text-transform: none'>: " + report.title + "</span>"
            )
          );
          $inno.removeAttr("title");
        }
        $tit.addClass("marker");
        $div.append($tit);
        $inno.removeAttr("id");
        $inno.replaceWith($div);
        var body = $inno.removeClass(report.type);
        $div.append(body);
      }
      pub(report.type, report);
    });
  }

  var $ins = $(".impnote");
  if ($ins.length) {
    handleIssues($ins);
    cb();
  } else {
    cb();
  }
}
