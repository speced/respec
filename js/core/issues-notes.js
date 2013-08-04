
// Module core/issues-notes
// Manages issues and notes, including marking them up, numbering, inserting the title,
// and injecting the style sheet.
// These are elements with classes "issue" or "note".
// When an issue or note is found, it is reported using the "issue" or "note" event. This can
// be used by a containing shell to extract all of these.
// Issues are automatically numbered by default, but you can assign them specific numbers (or,
// despite the name, any arbitrary identifier) using the data-number attribute. Note that as
// soon as you use one data-number on any issue all the other issues stop being automatically
// numbered to avoid involuntary clashes.
// If the configuration has issueBase set to a non-empty string, and issues are
// manually numbered, a link to the issue is created using issueBase and the issue number

define(
    ["text!core/css/issues-notes.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/issues-notes");
                var $ins = $(".issue, .note");
                if ($ins.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    var hasDataNum = $(".issue[data-number]").length > 0
                    ,   issueNum = 0;
                    $ins.each(function (i, inno) {
                        var $inno = $(inno)
                        ,   isIssue = $inno.hasClass("issue")
                        ,   isFeatureAtRisk = $inno.hasClass("atrisk")
                        ,   isInline = $inno.css("display") != "block"
                        ,   dataNum = $inno.attr("data-number")
                        ,   report = { inline: isInline, content: $inno.html() }
                        ;
                        report.type = isIssue ? "issue" : "note";

                        if (isIssue && !isInline && !hasDataNum) {
                            issueNum++;
                            report.number = issueNum;
                        }
                        else if (dataNum) {
                            report.number = dataNum;
                        }

                        // wrap
                        if (!isInline) {
                            var $div = $("<div class='" + report.type + (isFeatureAtRisk ? " atrisk" : "") + "'></div>")
                            ,   $tit = $("<div class='" + report.type + "-title'><span></span></div>")
                            ,   text = isIssue ? (isFeatureAtRisk ? "Feature at Risk" : "Issue") : "Note"
                            ;
                            if (isIssue) {
                                if (hasDataNum) {
                                    if (dataNum) {
                                        text += " " + dataNum;
                                        // Set issueBase to cause issue to be linked to the external issue tracker
                                        if (!isFeatureAtRisk && conf.issueBase) {
                                            $tit.find("span").wrap($("<a href='" + conf.issueBase + dataNum + "'/>"));
                                        }
                                        else if (isFeatureAtRisk && conf.atRiskBase) {
                                            $tit.find("span").wrap($("<a href='" + conf.atRiskBase + dataNum + "'/>"));
                                        }
                                    }
                                }
                                else {
                                    text += " " + issueNum;
                                }
                            }
                            $tit.find("span").text(text);
                            report.title = $inno.attr("title");
                            if (report.title) {
                                $tit.append(doc.createTextNode(": " + report.title));
                                $inno.removeAttr("title");
                            }
                            $div.append($tit);
                            $div.append($inno.clone().removeClass(report.type).removeAttr('data-number'));
                            $inno.replaceWith($div);
                        }
                        msg.pub(report.type, report);
                    });
                }
                msg.pub("end", "core/issues-notes");
                cb();
            }
        };
    }
);
